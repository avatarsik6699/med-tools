import { Context } from "koa";
import { BaseHandler } from "../../core/handler/base-handler.js";
import { NodeService } from "./node.service.js";

import { HandlerTypes } from "../../core/handler/handler.types.js";
import { NodeDto, nodeSchemas } from "./node.schemas.js";

export class NodeHandler extends BaseHandler {
	constructor(private readonly nodeService: NodeService) {
		super({ prefix: "/nodes" });
	}

	protected initRoutes() {
		this.router.get(
			"/",
			this.withHandler(this.findAll.bind(this), {
				schemas: nodeSchemas.findAll,
			}),
		);

		this.router.get(
			"/:id",
			this.withHandler(this.findOneById.bind(this), {
				schemas: nodeSchemas.findOneById,
			}),
		);

		this.router.post(
			"/",
			this.withHandler(this.create.bind(this), {
				schemas: nodeSchemas.create,
				// withAuth: true // Раскомментировать когда нужна аутентификация
			}),
		);

		this.router.patch(
			"/:id",
			this.withHandler(this.update.bind(this), {
				schemas: nodeSchemas.update,
			}),
		);

		this.router.delete(
			"/:id",
			this.withHandler(this.remove.bind(this), {
				schemas: nodeSchemas.remove,
				// withPermissions: ['node:delete'] // Раскомментировать для авторизации
			}),
		);
	}

	private async findAll(ctx: HandlerTypes.HandlerContext<NodeDto.FindAll>) {
		return this.nodeService.findAll({
			page: ctx.query.page,
			limit: ctx.query.limit,
		});
	}

	private async findOneById(
		ctx: HandlerTypes.HandlerContext<unknown, NodeDto.FindOneById>,
	) {
		return this.nodeService.findOneById({
			id: ctx.params.id,
		});
	}

	async create(
		ctx: HandlerTypes.HandlerContext<unknown, unknown, NodeDto.Create>,
	) {
		return this.nodeService.create({
			payload: ctx.request.body,
		});
	}

	async update(
		ctx: HandlerTypes.HandlerContext<
			unknown,
			NodeDto.Update.Params,
			NodeDto.Update.Body
		>,
	) {
		return this.nodeService.update({
			id: ctx.params.id,
			payload: ctx.request.body,
		});
	}

	async remove(ctx: HandlerTypes.HandlerContext<unknown, NodeDto.Remove>) {
		return this.nodeService.remove({ id: ctx.params.id });
	}
}
