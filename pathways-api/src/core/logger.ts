import pino from "pino";
import { IEnvConfigService, ILoggerService } from "./interfaces.js";
import { Types } from "./types.js";

export class LoggerService implements ILoggerService {
	private readonly logger: pino.Logger;

	constructor(env: IEnvConfigService) {
		const isDevelopment = env.get("NODE_ENV") === "development";

		this.logger = pino({
			level: process.env.LOG_LEVEL || "info",
			...(isDevelopment && {
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
					},
				},
			}),
		});
	}

	info(message: string, meta?: Types.GenericObject): void {
		this.logger.info(meta, message);
	}

	error(message: string, meta?: Types.GenericObject | Error): void {
		this.logger.error(meta, message);
	}

	warn(message: string, meta?: Types.GenericObject): void {
		this.logger.warn(meta, message);
	}

	debug(message: string, meta?: Types.GenericObject): void {
		this.logger.debug(meta, message);
	}
}
