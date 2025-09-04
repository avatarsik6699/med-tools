import { Repository } from "../../core/interfaces.js";
import { PaginationService } from "../../core/services/pagination/pagination.service.js";
import { PaginationTypes } from "../../core/services/pagination/pagination.types.js";
import { Edge, PrismaClient } from "../../generated/prisma/index.js";
import { EdgeDto } from "./edge.schemas.js";

export class EdgeRepository
	implements
		Repository<
			Edge,
			EdgeDto.Create,
			EdgeDto.Update.Body,
			EdgeDto.FindAll
		>
{
	private readonly services = {
		pagination: new PaginationService(),
	};

	constructor(private readonly client: PrismaClient) {}

	async create(args: { payload: EdgeDto.Create }): Promise<Edge> {
		return await this.client.edge.create({
			data: args.payload,
		});
	}

	async findAll(
		args: EdgeDto.FindAll,
	): Promise<PaginationTypes.Response<Edge>> {
		const pagination =
			this.services.pagination.getPaginationDtoFromQueryParams(args);

		const [data, total] = await Promise.all([
			this.client.edge.findMany({
				skip: pagination.offset,
				take: pagination.limit,
				orderBy: { id: "desc" },
			}),
			this.client.edge.count(),
		]);

		return this.services.pagination.buildPaginatedResponse({
			data,
			params: pagination,
			total,
		});
	}

	async findOneById(args: Pick<Edge, "id">): Promise<Edge | null> {
		return this.client.edge.findUnique({ where: { id: args.id } });
	}

	async remove(args: Pick<Edge, "id">): Promise<Edge> {
		return this.client.edge.delete({ where: { id: args.id } });
	}

	async update(
		args: EdgeDto.Update.Params & {
			payload: EdgeDto.Update.Body;
		},
	): Promise<Edge> {
		return await this.client.edge.update({
			where: { id: args.id },
			data: args.payload,
		});
	}
}
