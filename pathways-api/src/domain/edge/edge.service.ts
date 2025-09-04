import { BadRequestError, NotFoundError } from "../../core/errors.js";
import { Repository } from "../../core/interfaces.js";
import { PaginationTypes } from "../../core/services/pagination/pagination.types.js";
import { Edge } from "../../generated/prisma/index.js";
import { EdgeDto } from "./edge.schemas.js";

export class EdgeService {
	constructor(
		private readonly edgeRepository: Repository<
			Edge,
			EdgeDto.Create,
			EdgeDto.Update.Body,
			EdgeDto.FindAll
		>,
	) {}

	async create(args: { payload: EdgeDto.Create }): Promise<Edge> {
		return this.edgeRepository.create(args);
	}

	async findAll(
		args: EdgeDto.FindAll,
	): Promise<PaginationTypes.Response<Edge>> {
		return this.edgeRepository.findAll(args);
	}

	async findOneById(args: Pick<Edge, "id">): Promise<Edge> {
		const targetEdge = await this.edgeRepository.findOneById({
			id: args.id,
		});

		if (targetEdge === null) {
			throw NotFoundError.resource("Edge", args.id);
		}

		return targetEdge;
	}

	async remove(args: Pick<Edge, "id">): Promise<void> {
		const targetEdge = await this.edgeRepository.findOneById({
			id: args.id,
		});

		if (targetEdge === null) {
			throw new BadRequestError("Edge not found");
		}

		await this.edgeRepository.remove(args);
	}

	async update(
		args: EdgeDto.Update.Params & {
			payload: EdgeDto.Update.Body;
		},
	): Promise<Edge> {
		const targetEdge = await this.edgeRepository.findOneById({
			id: args.id,
		});

		if (targetEdge === null) {
			throw new BadRequestError("Edge not found");
		}

		return await this.edgeRepository.update(args);
	}
}
