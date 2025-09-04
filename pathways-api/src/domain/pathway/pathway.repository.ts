import { Repository } from "../../core/interfaces.js";
import { PaginationService } from "../../core/services/pagination/pagination.service.js";
import { PaginationTypes } from "../../core/services/pagination/pagination.types.js";
import { Pathway, Prisma, PrismaClient } from "../../generated/prisma/index.js";
import { PathwayDto } from "./pathway.schemas.js";

export class PathwayRepository
	implements
		Repository<
			Pathway,
			PathwayDto.Create,
			PathwayDto.Update.Body,
			PathwayDto.FindAll
		>
{
	private readonly services = {
		pagination: new PaginationService(),
	};

	constructor(private readonly client: PrismaClient) {}

	async create(args: { payload: PathwayDto.Create }): Promise<Pathway> {
		return await this.client.pathway.create({
			data: args.payload,
		});
	}

	async findAll(
		args: PathwayDto.FindAll,
	): Promise<PaginationTypes.Response<Pathway>> {
		const pagination =
			this.services.pagination.getPaginationDtoFromQueryParams(args);

		const [data, total] = await Promise.all([
			this.client.pathway.findMany({
				skip: pagination.offset,
				take: pagination.limit,
				orderBy: { createdAt: "desc" },
			}),
			this.client.pathway.count(),
		]);

		return this.services.pagination.buildPaginatedResponse({
			data,
			params: pagination,
			total,
		});
	}

	async findOneById(
		args: Pick<Pathway, "id">,
	): Promise<Prisma.PathwayGetPayload<{
		include: { nodes: true; edges: true };
	}> | null> {
		return this.client.pathway.findUnique({
			where: { id: args.id },
			include: {
				nodes: true,
				edges: true,
			},
		});
	}

	async remove(args: Pick<Pathway, "id">): Promise<Pathway> {
		return this.client.pathway.delete({ where: { id: args.id } });
	}

	async update(
		args: PathwayDto.Update.Params & {
			payload: PathwayDto.Update.Body;
		},
	): Promise<Pathway> {
		return await this.client.pathway.update({
			where: { id: args.id },
			data: args.payload,
		});
	}
}
