import { Repository } from "../../core/interfaces.js";
import { PaginationService } from "../../core/services/pagination/pagination.service.js";
import { PaginationTypes } from "../../core/services/pagination/pagination.types.js";
import { Node, PrismaClient } from "../../generated/prisma/index.js";
import { NodeDto } from "./node.schemas.js";

export class NodeRepository
	implements
		Repository<
			Node,
			NodeDto.Create,
			NodeDto.Update.Body,
			NodeDto.FindAll
		>
{
	private readonly services = {
		pagination: new PaginationService(),
	};

	constructor(private readonly client: PrismaClient) {}

	async create(args: { payload: NodeDto.Create }): Promise<Node> {
		return await this.client.node.create({
			data: args.payload,
		});
	}

	async findAll(
		args: NodeDto.FindAll,
	): Promise<PaginationTypes.Response<Node>> {
		const pagination =
			this.services.pagination.getPaginationDtoFromQueryParams(args);

		const [data, total] = await Promise.all([
			this.client.node.findMany({
				skip: pagination.offset,
				take: pagination.limit,
				orderBy: { id: "desc" },
			}),
			this.client.node.count(),
		]);

		return this.services.pagination.buildPaginatedResponse({
			data,
			params: pagination,
			total,
		});
	}

	async findOneById(args: Pick<Node, "id">): Promise<Node | null> {
		return this.client.node.findUnique({ where: { id: args.id } });
	}

	async remove(args: Pick<Node, "id">): Promise<Node> {
		return this.client.node.delete({ where: { id: args.id } });
	}

	async update(
		args: NodeDto.Update.Params & {
			payload: NodeDto.Update.Body;
		},
	): Promise<Node> {
		return await this.client.node.update({
			where: { id: args.id },
			data: args.payload,
		});
	}
}
