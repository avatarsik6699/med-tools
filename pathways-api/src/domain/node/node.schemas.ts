import { z } from "zod";
import { paginationSchema } from "../../core/services/pagination/pagination.schema.js";

export const nodeSchemas = {
	create: {
		body: z.object({
			label: z
				.string()
				.min(1, "Label is required")
				.max(255, "Label must be less than 255 characters"),
			pathwayId: z.uuid("Invalid pathway ID format"),
		}),
	},

	update: {
		params: z.object({
			id: z.uuid("Invalid node ID format"),
		}),
		body: z.object({
			label: z
				.string()
				.min(1, "Label cannot be empty")
				.max(255, "Label must be less than 255 characters")
				.optional(),
		}),
	},

	findOneById: {
		params: z.object({
			id: z.uuid("Invalid node ID format"),
		}),
	},

	findAll: {
		query: paginationSchema.query.extend({
			search: z.string().max(100, "Search term too long").optional(),
		}),
	},

	remove: {
		params: z.object({
			id: z.uuid("Invalid node ID format"),
		}),
	},
};

export namespace NodeDto {
	export type Create = z.infer<typeof nodeSchemas.create.body>;
	export namespace Update {
		export type Params = z.infer<typeof nodeSchemas.update.params>;
		export type Body = z.infer<typeof nodeSchemas.update.body>;
	}
	export type FindOneById = z.infer<typeof nodeSchemas.findOneById.params>;
	export type FindAll = z.infer<typeof nodeSchemas.findAll.query>;
	export type Remove = z.infer<typeof nodeSchemas.remove.params>;
}
