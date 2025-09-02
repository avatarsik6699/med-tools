import { BadRequestError, NotFoundError } from "../../core/errors.js";
import { Repository } from "../../core/interfaces.js";
import { PaginationTypes } from "../../core/services/pagination/pagination.types.js";
import { Pathway } from "../../generated/prisma/index.js";
import { PathwayDto } from "./pathway.schemas.js";

export class PathwayService {
	constructor(
		private readonly pathwayRepository: Repository<
			Pathway,
			PathwayDto.Create,
			PathwayDto.Update.Body,
			PathwayDto.FindAll
		>,
	) {}

	async create(args: { payload: PathwayDto.Create }): Promise<Pathway> {
		return this.pathwayRepository.create(args);
	}

	async findAll(
		args: PathwayDto.FindAll,
	): Promise<PaginationTypes.Response<Pathway>> {
		return this.pathwayRepository.findAll(args);
	}

	async findOneById(args: Pick<Pathway, "id">): Promise<Pathway> {
		const targetPathway = await this.pathwayRepository.findOneById({
			id: args.id,
		});

		if (targetPathway === null) {
			throw NotFoundError.resource("Pathway", args.id);
		}

		return targetPathway;
	}

	async remove(args: Pick<Pathway, "id">): Promise<void> {
		const targetPathway = await this.pathwayRepository.findOneById({
			id: args.id,
		});

		if (targetPathway === null) {
			throw new BadRequestError("Pathway not found");
		}

		await this.pathwayRepository.remove(args);
	}

	async update(
		args: PathwayDto.Update.Params & {
			payload: PathwayDto.Update.Body;
		},
	): Promise<Pathway> {
		const targetPathway = await this.pathwayRepository.findOneById({
			id: args.id,
		});

		if (targetPathway === null) {
			throw new BadRequestError("Pathway not found");
		}

		return await this.pathwayRepository.update(args);
	}
}
