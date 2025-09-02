import {
	Browser,
	BrowserContext,
	BrowserContextOptions,
	chromium,
} from "playwright";
import { ILoggerService } from "./interfaces.js";

export class Parser {
	browser!: Browser;
	contexts: Map<string, BrowserContext> = new Map();
	USER_AGENTS: string[] = [
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
		"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
	];

	constructor(private readonly logger: ILoggerService) {
		// this.browser = null;
		// this.contexts = new Map(); // Для изоляции сессий
	}

	// Инициализация браузера (вызывается при старте приложения)
	async init() {
		if (this.browser) return;

		this.logger.info("🎭 Launching Chromium browser in stealth mode...");

		this.browser = await chromium.launch({
			// headless: process.env.NODE_ENV === "development" ? false : true,
			headless: false,
			executablePath: process.env.CHROMIUM_PATH || undefined,
			args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--disable-dev-shm-usage",
				"--disable-accelerated-2d-canvas",
				"--no-first-run",
				"--no-zygote",
				"--disable-web-security",
				"--disable-features=VizDisplayCompositor",
				"--disable-background-timer-throttling",
				"--disable-backgrounding-occluded-windows",
				"--disable-renderer-backgrounding",
				"--disable-ipc-flooding-protection",
				"--enable-features=NetworkService",
				"--hide-scrollbars",
				"--mute-audio",
				"--no-default-browser-check",
				`--user-agent=${this.getRandomUserAgent()}`,
			],
			ignoreDefaultArgs: [
				"--enable-automation",
				"--enable-blink-features=IdleDetection",
			],
		});

		this.logger.info("🎭 Playwright browser launched");
	}

	private getRandomUserAgent(): string {
		return this.USER_AGENTS[
			Math.floor(Math.random() * this.USER_AGENTS.length)
		];
	}

	async createContext(options: BrowserContextOptions = {}) {
		if (!this.browser) {
			throw new Error("Browser is not initialized. Please call init() first.");
		}

		const contextOptions: BrowserContextOptions = {
			viewport: { width: 1920, height: 1080 },
			userAgent: this.getRandomUserAgent(),
			locale: "ru-RU,ru",
			timezoneId: "Europe/Moscow",
			...options,
		};

		const context = await this.browser.newContext(contextOptions);

		// Эмуляция человеческого поведения
		// await this.setupHumanEmulation(context);

		const contextId = Date.now().toString();

		this.contexts.set(contextId, context);

		this.logger.info(`New context created: ${contextId}`);

		return contextId;
	}

	// async setupHumanEmulation(context: BrowserContext) {
	// 	// Переопределяем WebDriver property
	// 	await context.addInitScript(() => {
	// 		Object.defineProperty(navigator, "webdriver", {
	// 			get: () => false,
	// 		});
	// 	});

	// 	// Эмуляция человеческих свойств
	// 	await context.addInitScript(() => {
	// 		window.chrome = {
	// 			runtime: {},
	// 			app: {},
	// 			webstore: {},
	// 			csi: () => {},
	// 			loadTimes: () => {},
	// 		};
	// 	});

	// 	// Скрываем наличие automation
	// 	await context.addInitScript(() => {
	// 		const originalQuery = window.navigator.permissions.query;
	// 		window.navigator.permissions.query = (parameters) =>
	// 			parameters.name === "notifications"
	// 				? Promise.resolve({ state: Notification.permission })
	// 				: originalQuery(parameters);
	// 	});
	// }

	// async getPage(contextId, loggingEnabled = true) {
	// 	const context = this.contexts.get(contextId);
	// 	if (!context) throw new Error(`Context ${contextId} not found`);

	// 	const page = await context.newPage();

	// 	if (loggingEnabled) {
	// 		this.setupPageLogging(page, contextId);
	// 	}

	// 	// Дополнительные настройки для stealth
	// 	await page.setExtraHTTPHeaders({
	// 		"Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
	// 		Accept:
	// 			"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
	// 		"Accept-Encoding": "gzip, deflate, br",
	// 	});

	// 	// Рандомные задержки между действиями
	// 	page.humanDelay = async (min = 100, max = 500) => {
	// 		const delay = Math.floor(Math.random() * (max - min + 1)) + min;
	// 		await page.waitForTimeout(delay);
	// 	};

	// 	return page;
	// }

	// setupPageLogging(page, contextId) {
	// 	// Логирование запросов
	// 	page.on("request", (request) => {
	// 		this.logger.info(
	// 			`[${contextId}] Request: ${request.method()} ${request.url()}`,
	// 		);
	// 	});

	// 	page.on("response", (response) => {
	// 		if (response.status() >= 400) {
	// 			this.logger.warn(
	// 				`[${contextId}] Response: ${response.status()} ${response.url()}`,
	// 			);
	// 		}
	// 	});

	// 	page.on("console", (msg) => {
	// 		const type = msg.type();
	// 		const text = msg.text();
	// 		if (type === "error" || type === "warning") {
	// 			this.logger.warn(`[${contextId}] Console ${type}: ${text}`);
	// 		}
	// 	});

	// 	page.on("pageerror", (error) => {
	// 		this.logger.error(`[${contextId}] Page error: ${error.message}`);
	// 	});

	// 	page.on("requestfailed", (request) => {
	// 		this.logger.error(
	// 			`[${contextId}] Request failed: ${request.failure().errorText} ${request.url()}`,
	// 		);
	// 	});

	// 	// Логирование навигации
	// 	page.on("load", () => {
	// 		this.logger.info(`[${contextId}] Page loaded: ${page.url()}`);
	// 	});
	// }

	public async getPage(contextId: string) {
		const timeout = 30000;

		const context = this.contexts.get(contextId);

		if (!context) {
			throw new Error(`Context ${contextId} not found`);
		}

		const page = await context.newPage();

		// if (loggingEnabled) {
		// 	this.setupPageLogging(page, contextId);
		// }

		await page.setExtraHTTPHeaders({
			"Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
			Accept:
				"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Accept-Encoding": "gzip, deflate, br",
		});

		page.setDefaultTimeout(timeout);

		// // Добавляем метод для человеческих задержек
		// (page as any).humanDelay = async (
		// 	min: number = 100,
		// 	max: number = 500,
		// ): Promise<void> => {
		// 	const delay = Math.floor(Math.random() * (max - min + 1)) + min;
		// 	await page.waitForTimeout(delay);
		// };

		return page;
	}

	async closeContext(contextId: string) {
		const context = this.contexts.get(contextId);
		if (context) {
			this.logger.info(`Closing context: ${contextId}`);
			await context.close();
			this.contexts.delete(contextId);
		}
	}

	async shutdown() {
		this.logger.info("Shutting down Playwright manager...");

		for (const [id, context] of this.contexts) {
			await context.close();
		}

		this.contexts.clear();

		if (this.browser) {
			await this.browser.close();
		}

		this.logger.info("Playwright manager shut down successfully");
	}
}
