import { z } from "zod";

export const searchParams = z.object({
	authors: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	statuses: z.array(z.string()).optional(),
	withArchived: z.boolean().optional(),
	withDeleted: z.boolean().optional(),
});
