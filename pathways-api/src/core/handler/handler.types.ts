import { Context } from "koa";
import { z } from "zod";

export namespace HandlerTypes {
	export type Method<
		Response = unknown,
		Query = unknown,
		Params = unknown,
		Body = unknown,
	> = (ctx: HandlerContext<Query, Params, Body>) => Promise<Response>;

	export type Config<Query = unknown, Params = unknown, Body = unknown> = {
		schemas?: ValidationSchemas<Query, Params, Body>;
		withAuth?: boolean;
		withPermissions?: string[];
		withRateLimit?: {
			max: number;
			windowMs: number;
		};
	};

	export type HandlerContext<
		Query = unknown,
		Params = unknown,
		Body = unknown,
	> = Context & {
		meta: {
			requestId: string;
			startTime: number;
		};
		query: Query;
		params: Params;
		request: Omit<Context["request"], "body"> & {
			body: Body;
		};
	};

	export type Response<Data = unknown> = {
		data: Data;
	};

	export type ValidationSchemas<
		Query = unknown,
		Params = unknown,
		Body = unknown,
	> = {
		body?: z.ZodSchema<Body>;
		params?: z.ZodSchema<Params>;
		query?: z.ZodSchema<Query>;
	};
}
