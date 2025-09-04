import { Context } from "koa";
import { BaseHandler } from "../../core/handler/base-handler.js";
import { EdgeService } from "./edge.service.js";

import { HandlerTypes } from "../../core/handler/handler.types.js";
import { EdgeDto, edgeSchemas } from "./edge.schemas.js";

export class EdgeHandler extends BaseHandler {
	constructor(private readonly edgeService: EdgeService) {
		super({ prefix: "/edges" });
	}

	protected initRoutes() {
		this.router.get(
			"/",
			this.withHandler(this.findAll.bind(this), {
				schemas: edgeSchemas.findAll,
			}),
		);

		this.router.get(
			"/:id",
			this.withHandler(this.findOneById.bind(this), {
				schemas: edgeSchemas.findOneById,
			}),
		);

		this.router.post(
			"/",
			this.withHandler(this.create.bind(this), {
				schemas: edgeSchemas.create,
				// withAuth: true // Раскомментировать когда нужна аутентификация
			}),
		);

		this.router.patch(
			"/:id",
			this.withHandler(this.update.bind(this), {
				schemas: edgeSchemas.update,
			}),
		);

		this.router.delete(
			"/:id",
			this.withHandler(this.remove.bind(this), {
				schemas: edgeSchemas.remove,
				// withPermissions: ['edge:delete'] // Раскомментировать для авторизации
			}),
		);
	}

	private async findAll(ctx: HandlerTypes.HandlerContext<EdgeDto.FindAll>) {
		return this.edgeService.findAll({
			page: ctx.query.page,
			limit: ctx.query.limit,
		});
	}

	private async findOneById(
		ctx: HandlerTypes.HandlerContext<unknown, EdgeDto.FindOneById>,
	) {
		return this.edgeService.findOneById({
			id: ctx.params.id,
		});
	}

	async create(
		ctx: HandlerTypes.HandlerContext<unknown, unknown, EdgeDto.Create>,
	) {
		return this.edgeService.create({
			payload: ctx.request.body,
		});
	}

	async update(
		ctx: HandlerTypes.HandlerContext<
			unknown,
			EdgeDto.Update.Params,
			EdgeDto.Update.Body
		>,
	) {
		return this.edgeService.update({
			id: ctx.params.id,
			payload: ctx.request.body,
		});
	}

	async remove(ctx: HandlerTypes.HandlerContext<unknown, EdgeDto.Remove>) {
		return this.edgeService.remove({ id: ctx.params.id });
	}
}
