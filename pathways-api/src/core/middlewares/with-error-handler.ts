import { Context, Next } from "koa";
import { BaseError, InternalServerError } from "../errors.js";
import { ILoggerService } from "../interfaces.js";

export function withErrorHandler(args: { logger: ILoggerService }) {
	return async (ctx: Context, next: Next) => {
		try {
			await next();
		} catch (error) {
			if (error instanceof BaseError) {
				ctx.status = error.statusCode;
				ctx.body = error.toJSON();

				args.logger.error(`Error ${error.statusCode}:`, error.toJSON());
			} else {
				const validUnknownError = getValidUnknownError(error);

				args.logger.error("Unhandled error:", validUnknownError);

				const internalError = new InternalServerError(
					"Internal server error",
					validUnknownError,
				);

				ctx.status = internalError.statusCode;
				ctx.body = internalError.toJSON();
			}
		}
	};
}

function getValidUnknownError(error: unknown) {
	return error instanceof Error ? error : new Error(String(error));
}
