import { z } from "zod";
import { paginationSchema } from "../../core/services/pagination/pagination.schema.js";

export const edgeSchemas = {
	create: {
		body: z.object({
			condition: z
				.string()
				.min(1, "Condition is required")
				.max(500, "Condition must be less than 500 characters"),
			pathwayId: z.uuid("Invalid pathway ID format"),
			fromNodeId: z.uuid("Invalid fromNode ID format"),
			toNodeId: z.uuid("Invalid toNode ID format"),
		}),
	},

	update: {
		params: z.object({
			id: z.uuid("Invalid edge ID format"),
		}),
		body: z.object({
			condition: z
				.string()
				.min(1, "Condition cannot be empty")
				.max(500, "Condition must be less than 500 characters")
				.optional(),
		}),
	},

	findOneById: {
		params: z.object({
			id: z.uuid("Invalid edge ID format"),
		}),
	},

	findAll: {
		query: paginationSchema.query.extend({
			search: z.string().max(100, "Search term too long").optional(),
		}),
	},

	remove: {
		params: z.object({
			id: z.uuid("Invalid edge ID format"),
		}),
	},
};

export namespace EdgeDto {
	export type Create = z.infer<typeof edgeSchemas.create.body>;
	export namespace Update {
		export type Params = z.infer<typeof edgeSchemas.update.params>;
		export type Body = z.infer<typeof edgeSchemas.update.body>;
	}
	export type FindOneById = z.infer<typeof edgeSchemas.findOneById.params>;
	export type FindAll = z.infer<typeof edgeSchemas.findAll.query>;
	export type Remove = z.infer<typeof edgeSchemas.remove.params>;
}
