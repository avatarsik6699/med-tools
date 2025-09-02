import { Context, Next } from "koa";
import { ILoggerService } from "../interfaces.js";

export function withRequestLogger(args: { logger: ILoggerService }) {
	return async (ctx: Context, next: Next) => {
		const start = Date.now();

		args.logger.info(`→ ${ctx.method} ${ctx.path}`);

		try {
			await next();
		} finally {
			const duration = Date.now() - start;

			args.logger.info(
				`← ${ctx.method} ${ctx.path} - ${ctx.status} (${duration}ms)`,
			);
		}
	};
}
