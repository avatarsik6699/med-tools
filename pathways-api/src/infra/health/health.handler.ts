import { Context } from "koa";
import { BaseHandler } from "../../core/handler/base-handler.js";

export class HealthHandler extends BaseHandler {
	constructor() {
		super();
	}

	protected initRoutes() {
		this.router.get("/health", this.getHealth.bind(this));
	}

	private async getHealth(ctx: Context) {
		ctx.body = {
			status: "OK",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
			state: ctx.state,
			memory: process.memoryUsage(),
			platform: process.platform,
			nodeVersion: process.version,
		};
	}
}
