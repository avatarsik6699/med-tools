export namespace PaginationTypes {
	export interface Config {
		defaultLimit?: number;
		maxLimit?: number;
		minLimit?: number;
	}

	export interface Params {
		page: number;
		limit: number;
	}

	export interface Response<Item = unknown> {
		data: Item[];
		meta: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
			hasNextPage: boolean;
			hasPrevPage: boolean;
		};
	}
}
