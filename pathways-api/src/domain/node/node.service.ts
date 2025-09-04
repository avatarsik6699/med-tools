import { BadRequestError, NotFoundError } from "../../core/errors.js";
import { Repository } from "../../core/interfaces.js";
import { PaginationTypes } from "../../core/services/pagination/pagination.types.js";
import { Node } from "../../generated/prisma/index.js";
import { NodeDto } from "./node.schemas.js";

export class NodeService {
	constructor(
		private readonly nodeRepository: Repository<
			Node,
			NodeDto.Create,
			NodeDto.Update.Body,
			NodeDto.FindAll
		>,
	) {}

	async create(args: { payload: NodeDto.Create }): Promise<Node> {
		return this.nodeRepository.create(args);
	}

	async findAll(
		args: NodeDto.FindAll,
	): Promise<PaginationTypes.Response<Node>> {
		return this.nodeRepository.findAll(args);
	}

	async findOneById(args: Pick<Node, "id">): Promise<Node> {
		const targetNode = await this.nodeRepository.findOneById({
			id: args.id,
		});

		if (targetNode === null) {
			throw NotFoundError.resource("Node", args.id);
		}

		return targetNode;
	}

	async remove(args: Pick<Node, "id">): Promise<void> {
		const targetNode = await this.nodeRepository.findOneById({
			id: args.id,
		});

		if (targetNode === null) {
			throw new BadRequestError("Node not found");
		}

		await this.nodeRepository.remove(args);
	}

	async update(
		args: NodeDto.Update.Params & {
			payload: NodeDto.Update.Body;
		},
	): Promise<Node> {
		const targetNode = await this.nodeRepository.findOneById({
			id: args.id,
		});

		if (targetNode === null) {
			throw new BadRequestError("Node not found");
		}

		return await this.nodeRepository.update(args);
	}
}
