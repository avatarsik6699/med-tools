import Router from "@koa/router";
import Koa from "koa";
import { bootstrap } from "./core/bootstrap.js";
import { HealthHandler } from "./infra/health/health.handler.js";
import { PathwayHandler } from "./domain/pathway/pathway.handler.js";
import { PathwayService } from "./domain/pathway/pathway.service.js";
import { PathwayRepository } from "./domain/pathway/pathway.repository.js";
import { PrismaClient } from "./generated/prisma/index.js";
import { EnvConfigService } from "./core/env.js";

import { LoggerService } from "./core/logger.js";
import { withBodyParser } from "./core/middlewares/with-body-parser.js";
import {
	withErrorHandler,
	withRequestId,
	withRequestLogger,
} from "./core/middlewares/index.js";
import { EdgeHandler } from "./domain/edge/edge.handler.js";
import { EdgeRepository } from "./domain/edge/edge.repository.js";
import { EdgeService } from "./domain/edge/edge.service.js";
import { NodeHandler } from "./domain/node/node.handler.js";
import { NodeRepository } from "./domain/node/node.repository.js";
import { NodeService } from "./domain/node/node.service.js";

const env = new EnvConfigService();
const logger = new LoggerService(env);
const client = new PrismaClient({
	log: ['query', 'info', 'warn', 'error'],
});
const app = new Koa();
const router = new Router({
	prefix: "/api",
});

router
	.use(new HealthHandler().getRouter().routes())
	.use(
		new PathwayHandler(new PathwayService(new PathwayRepository(client)))
			.getRouter()
			.routes(),
	)
	.use(
		new NodeHandler(new NodeService(new NodeRepository(client)))
			.getRouter()
			.routes(),
	)
	.use(
		new EdgeHandler(new EdgeService(new EdgeRepository(client)))
			.getRouter()
			.routes(),
	);

app
	.use(withErrorHandler({ logger }))
	.use(withRequestId())
	.use(withRequestLogger({ logger }))
	.use(withBodyParser())
	.use(router.routes())
	// 	router.allowedMethods() нужен для автоматической обработки HTTP методов, которые не поддерживаются маршрутом:
	// 405 Method Not Allowed - когда путь существует, но HTTP метод не поддерживается
	// 501 Not Implemented - для неизвестных HTTP методов
	// Заголовок Allow - автоматически добавляет список разрешенных методов для OPTIONS запросов
	// Без него: несуществующие методы будут возвращать 404 вместо корректных 405/501 статусов.
	.use(router.allowedMethods());

bootstrap(app);
