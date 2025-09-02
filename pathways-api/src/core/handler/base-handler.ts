import Router from "@koa/router";
import { z } from "zod";
import {
	UnauthorizedError,
	ValidationDetails,
	ValidationError,
} from "../errors.js";
import { HandlerTypes } from "./handler.types.js";
import { Types } from "../types.js";

export abstract class BaseHandler {
	protected router: Router;

	constructor(routerOptions?: Router.RouterOptions) {
		this.router = new Router(routerOptions);
		this.initRoutes();
	}

	getRouter(): Router {
		return this.router;
	}

	// Основной метод для обработки запросов
	protected withHandler<
		Response = unknown,
		Query = unknown,
		Params = unknown,
		Body = unknown,
	>(
		method: HandlerTypes.Method<Response, Query, Params, Body>,
		config: HandlerTypes.Config<Query, Params, Body> = {},
	) {
		return async (ctx: HandlerTypes.HandlerContext<Query, Params, Body>) => {
			try {
				// Валидация
				await this.validateRequest(ctx, config.schemas);

				// Аутентификация (если нужна)
				if (config.withAuth) {
					await this.authenticateRequest(ctx);
				}

				// Авторизация (если нужна)
				if (config.withPermissions?.length) {
					await this.authorizeRequest(ctx, config.withPermissions);
				}

				// Выполнение основной логики
				const response = await method(ctx);

				// Формирование успешного ответа
				this.sendSuccessResponse(ctx, response);
			} catch (error) {
				throw error;
			}
		};
	}

	// Валидация с помощью Zod
	private async validateRequest<
		Query = unknown,
		Params = unknown,
		Body = unknown,
	>(
		ctx: HandlerTypes.HandlerContext<Query, Params, Body>,
		schemas?: HandlerTypes.ValidationSchemas<Query, Params, Body>,
	): Promise<void> {
		if (!schemas) return;

		try {
			if (schemas.params) {
				ctx.params = schemas.params.parse(ctx.params) as Params;
			}

			if (schemas.query) {
				// @ts-ignore
				ctx.query = schemas.query.parse(ctx.query) as Query;
			}

			if (schemas.body) {
				ctx.request.body = schemas.body.parse(ctx.request.body) as Body;
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				throw new ValidationError(
					"Validation failed",
					this.formatZodErrors(error),
				);
			}

			throw error;
		}
	}

	// Аутентификация (заглушка)
	private async authenticateRequest(
		ctx: HandlerTypes.HandlerContext,
	): Promise<void> {
		// Здесь будет логика проверки JWT токена
		const authHeader = ctx.headers.authorization;
		if (!authHeader) {
			throw new UnauthorizedError("Authorization header is required");
		}
		// ... логика проверки токена
	}

	// Авторизация (заглушка)
	private async authorizeRequest(
		ctx: HandlerTypes.HandlerContext,
		permissions: string[],
	): Promise<void> {
		// Здесь будет логика проверки прав доступа
		// ... логика проверки permissions
	}

	// Отправка успешного ответа
	private sendSuccessResponse(
		ctx: HandlerTypes.HandlerContext,
		response: unknown,
	): void {
		// Автоматическое определение статуса по HTTP методу
		ctx.status = ctx.method === 'POST' ? 201 : ctx.method === 'DELETE' ? 204 : 200;

		// Если это массив, добавляем информацию о количестве
		// if (Array.isArray(data)) {
		// 	meta.total = data.length;
		// }

		ctx.body = response;
	}

	private formatZodErrors(error: z.ZodError): ValidationDetails {
		return {
			validationErrors: error.issues.map((err) => ({
				field: err.path.join("."),
				message: err.message,
				value: err.input,
			})),
		};
	}

	protected abstract initRoutes(): void;
}
