import z from "zod";
import { HandlerTypes } from "../../handler/handler.types.js";
import { PaginationTypes } from "./pagination.types.js";
import { paginationSchema } from "./pagination.schema.js";

const DEFAULT_LIMIT = 10;
const DEFAULT_MAX_LIMIT = 100;
const DEFAULT_MIN_LIMIT = 1;

export class PaginationService {
	private readonly defaultLimit: number;
	private readonly maxLimit: number;
	private readonly minLimit: number;

	constructor(config: PaginationTypes.Config = {}) {
		this.defaultLimit = config.defaultLimit ?? DEFAULT_LIMIT;
		this.maxLimit = config.maxLimit ?? DEFAULT_MAX_LIMIT;
		this.minLimit = config.minLimit ?? DEFAULT_MIN_LIMIT;
	}

	// Извлечение и валидация параметров пагинации из контекста
	getPaginationDtoFromQueryParams(
		query: z.infer<typeof paginationSchema.query>,
	) {
		const page = Math.max(1, query.page || 1);

		const limit = Math.min(
			this.maxLimit,
			Math.max(this.minLimit, query.limit || this.defaultLimit),
		);

		const offset = (page - 1) * limit;

		return { page, limit, offset };
	}

	// Создание результата с метаданными пагинации
	buildPaginatedResponse<Item>(args: {
		data: Item[];
		params: PaginationTypes.Params;
		total: number;
	}): PaginationTypes.Response<Item> {
		const { data, params, total } = args;

		const totalPages = Math.ceil(total / params.limit);
		const hasNextPage = params.page < totalPages;
		const hasPrevPage = params.page > 1;

		return {
			data,
			meta: {
				page: params.page,
				limit: params.limit,
				total,
				totalPages,
				hasNextPage,
				hasPrevPage,
			},
		};
	}
}
