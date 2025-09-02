import { z } from "zod";
import { paginationSchema } from "../../core/services/pagination/pagination.schema.js";

export const pathwaySchemas = {
	create: {
		body: z.object({
			title: z
				.string()
				.min(1, "Title is required")
				.max(255, "Title must be less than 255 characters"),
			description: z
				.string()
				.min(1, "Description is required")
				.max(1000, "Description must be less than 1000 characters")
				.optional(),
		}),
	},

	update: {
		params: z.object({
			id: z.uuid("Invalid pathway ID format"),
		}),
		body: z
			.object({
				title: z
					.string()
					.min(1, "Title cannot be empty")
					.max(255, "Title must be less than 255 characters")
					.optional(),
				description: z
					.string()
					.max(1000, "Description must be less than 1000 characters")
					.optional(),
			})
			.refine((data) => data.title || data.description, {
				message: "At least one field must be provided",
			}),
	},

	findOneById: {
		params: z.object({
			id: z.uuid("Invalid pathway ID format"),
		}),
	},

	findAll: {
		query: paginationSchema.query.extend({
			search: z.string().max(100, "Search term too long").optional(),
		}),
	},

	remove: {
		params: z.object({
			id: z.uuid("Invalid pathway ID format"),
		}),
	},
};

export namespace PathwayDto {
	export type Create = z.infer<typeof pathwaySchemas.create.body>;
	export namespace Update {
		export type Params = z.infer<typeof pathwaySchemas.update.params>;
		export type Body = z.infer<typeof pathwaySchemas.update.body>;
	}
	export type FindOneById = z.infer<typeof pathwaySchemas.findOneById.params>;
	export type FindAll = z.infer<typeof pathwaySchemas.findAll.query>;
	export type Remove = z.infer<typeof pathwaySchemas.remove.params>;
}
