import { z } from "zod";

export const paginationSchema = {
	query: z.object({
		page: z
			.string()
			.optional()
			.transform((val) => (val ? parseInt(val, 10) : 1))
			.refine((val) => val >= 1, { message: "Page must be greater than 0" }),
		limit: z
			.string()
			.optional()
			.transform((val) => (val ? parseInt(val, 10) : 10))
			.refine((val) => val >= 1 && val <= 100, {
				message: "Limit must be between 1 and 100",
			}),
	}),
};
