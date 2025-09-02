import { z } from "zod";
import { EnvConfig, IEnvConfigService } from "./interfaces.js";

// Схема валидации переменных окружения
const schema = z.object({
	// Общие настройки приложения
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	// PORT: z.coerce.number().min(1).max(65535).default(3000),
	// HOST: z.string().default("localhost"),

	// Настройки логирования
	// LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

	// База данных
	// DATABASE_URL: z.string().url(),
	// DATABASE_MAX_CONNECTIONS: z.coerce.number().min(1).max(100).default(10),
	// DATABASE_TIMEOUT: z.coerce.number().min(1000).default(30000), // 30 секунд

	// // Redis (опционально)
	// REDIS_URL: z.string().url().optional(),
	// REDIS_MAX_RETRIES: z.coerce.number().min(0).default(3),
	// REDIS_TIMEOUT: z.coerce.number().min(1000).default(5000),

	// Аутентификация и безопасность
	// JWT_SECRET: z.string().min(32),
	// JWT_EXPIRES_IN: z.string().default("24h"),
	// JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

	// // CORS настройки
	// CORS_ORIGIN: z.string().default("*"),
	// CORS_CREDENTIALS: z.coerce.boolean().default(false),

	// // Rate limiting
	// RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 минут
	// RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).default(100),

	// // Мониторинг и метрики
	// METRICS_ENABLED: z.coerce.boolean().default(false),
	// HEALTH_CHECK_TIMEOUT: z.coerce.number().min(1000).default(5000),

	// // Внешние сервисы
	// EXTERNAL_API_URL: z.string().url().optional(),
	// EXTERNAL_API_KEY: z.string().optional(),
	// EXTERNAL_API_TIMEOUT: z.coerce.number().min(1000).default(10000),
});

// Класс для управления конфигурацией
export class EnvConfigService
	implements IEnvConfigService<z.infer<typeof schema>>
{
	private readonly config: EnvConfig;

	constructor() {
		this.config = this.createEnvConfig();
	}

	private createEnvConfig(): EnvConfig {
		try {
			return schema.parse(process.env);
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorMessages = error.issues.map(
					(err) => `${err.path.join(".")}: ${err.message}`,
				);

				throw new Error(
					`Environment variables validation failed:\n${errorMessages.join("\n")}`,
				);
			}
			throw error;
		}
	}

	// Получение всей конфигурации
	public getConfig(): EnvConfig {
		return this.config;
	}

	// Получение конкретного значения
	public get<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
		return this.config[key];
	}

	// Получение обязательного значения с проверкой
	public getOrThrow<K extends keyof EnvConfig>(
		key: K,
	): NonNullable<EnvConfig[K]> {
		const value = this.config[key];

		if (value === undefined || value === null) {
			throw new Error(`Required environment variable ${key} is not set`);
		}

		return value as NonNullable<EnvConfig[K]>;
	}

	// Проверка, что конфигурация инициализирована
	public isValid(): boolean {
		return this.config !== undefined;
	}
}
