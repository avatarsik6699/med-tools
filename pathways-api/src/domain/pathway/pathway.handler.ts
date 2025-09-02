import { Context } from "koa";
import { BaseHandler } from "../../core/handler/base-handler.js";
import { PathwayService } from "./pathway.service.js";

import { HandlerTypes } from "../../core/handler/handler.types.js";
import { PathwayDto, pathwaySchemas } from "./pathway.schemas.js";

export class PathwayHandler extends BaseHandler {
	constructor(private readonly pathwayService: PathwayService) {
		super({ prefix: "/pathways" });
	}

	protected initRoutes() {
		this.router.get(
			"/",
			this.withHandler(this.findAll.bind(this), {
				schemas: pathwaySchemas.findAll,
			}),
		);

		this.router.get(
			"/:id",
			this.withHandler(this.findOneById.bind(this), {
				schemas: pathwaySchemas.findOneById,
			}),
		);

		this.router.post(
			"/",
			this.withHandler(this.create.bind(this), {
				schemas: pathwaySchemas.create,
				// withAuth: true // Раскомментировать когда нужна аутентификация
			}),
		);

		this.router.patch(
			"/:id",
			this.withHandler(this.update.bind(this), {
				schemas: pathwaySchemas.update,
			}),
		);

		this.router.delete(
			"/:id",
			this.withHandler(this.remove.bind(this), {
				schemas: pathwaySchemas.remove,
				// withPermissions: ['pathway:delete'] // Раскомментировать для авторизации
			}),
		);
	}

	private async findAll(ctx: HandlerTypes.HandlerContext<PathwayDto.FindAll>) {
		return this.pathwayService.findAll({
			page: ctx.query.page,
			limit: ctx.query.limit,
		});
	}

	private async findOneById(
		ctx: HandlerTypes.HandlerContext<unknown, PathwayDto.FindOneById>,
	) {
		return this.pathwayService.findOneById({
			id: ctx.params.id,
		});
	}

	async create(
		ctx: HandlerTypes.HandlerContext<unknown, unknown, PathwayDto.Create>,
	) {
		return this.pathwayService.create({
			payload: ctx.request.body,
		});
	}

	async update(
		ctx: HandlerTypes.HandlerContext<
			unknown,
			PathwayDto.Update.Params,
			PathwayDto.Update.Body
		>,
	) {
		return this.pathwayService.update({
			id: ctx.params.id,
			payload: ctx.request.body,
		});
	}

	async remove(ctx: HandlerTypes.HandlerContext<unknown, PathwayDto.Remove>) {
		return this.pathwayService.remove({ id: ctx.params.id });
	}
}
