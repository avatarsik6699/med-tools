import { EnvConfigService } from "../core/env.js";
import { LoggerService } from "../core/logger.js";
import { Parser } from "../core/parser.js";

const env = new EnvConfigService();
const logger = new LoggerService(env);
const parser = new Parser(logger);

async function testParser(): Promise<void> {
	await parser.init();
	const contextId = await parser.createContext();
	const page = await parser.getPage(contextId);

	try {
		await page.goto("https://www.google.com");
		const text = await page.$(
			"body > div:nth-child(7) > div > div.col-sm-12.col-lg-10.main > div > div:nth-child(1) > div > div.blue > p",
		);
		console.log(await text?.innerHTML());
	} catch (error) {
		console.error("❌ Unexpected error:");
		console.error(error);
	}
}

testParser();
