import { Context, Next } from "koa";
import { nanoid } from "nanoid";

export function withRequestId() {
	return async (ctx: Context, next: Next) => {
		ctx.state.requestId = `req_${nanoid()}`;

		ctx.set("X-Request-ID", ctx.state.requestId);

		await next();
	};
}
