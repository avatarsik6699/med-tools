// Типы для details различных категорий ошибок
export type ValidationDetails = {
	field?: string;
	value?: unknown;
	constraints?: string[];
	validationErrors?: Array<{
		field: string;
		message: string;
		value?: unknown;
	}>;
};

export type ResourceDetails = {
	resourceType: string;
	resourceId?: string;
	action?: string;
};

export type AuthDetails = {
	realm?: string;
	scope?: string;
	requiredPermissions?: string[];
};

export type DatabaseDetails = {
	operation?: string;
	table?: string;
	constraint?: string;
};

export type ExternalServiceDetails = {
	service: string;
	endpoint?: string;
	responseStatus?: number;
};

export type RateLimitDetails = {
	limit: number;
	remaining: number;
	resetTime: Date;
	windowSize: string;
};

export abstract class BaseError<T = unknown> extends Error {
	abstract readonly statusCode: number;
	abstract readonly errorCode: string;

	constructor(
		message: string,
		public readonly details?: T,
		public readonly cause?: Error,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			statusCode: this.statusCode,
			errorCode: this.errorCode,
			details: this.details,
			...(this.cause && { cause: this.cause.message }),
		};
	}
}

// === VALIDATION ERRORS (4xx Client Errors) ===

export class ValidationError extends BaseError<ValidationDetails> {
	readonly statusCode = 400;
	readonly errorCode = "VALIDATION_ERROR";

	constructor(
		message: string = "Validation failed",
		details?: ValidationDetails,
	) {
		super(message, details);
	}

	static field(
		field: string,
		message: string,
		value?: unknown,
	): ValidationError {
		return new ValidationError(
			`Validation failed for field '${field}': ${message}`,
			{
				field,
				value,
				constraints: [message],
			},
		);
	}

	static multiple(
		errors: ValidationDetails["validationErrors"],
	): ValidationError {
		return new ValidationError("Multiple validation errors", {
			validationErrors: errors,
		});
	}
}

export class BadRequestError extends BaseError {
	readonly statusCode = 400;
	readonly errorCode = "BAD_REQUEST";

	constructor(message: string = "Bad request") {
		super(message);
	}
}

export class UnprocessableEntityError extends BaseError<ValidationDetails> {
	readonly statusCode = 422;
	readonly errorCode = "UNPROCESSABLE_ENTITY";

	constructor(
		message: string = "Unprocessable entity",
		details?: ValidationDetails,
	) {
		super(message, details);
	}
}

// === RESOURCE ERRORS ===

export class NotFoundError extends BaseError<ResourceDetails> {
	readonly statusCode = 404;
	readonly errorCode = "NOT_FOUND";

	constructor(message?: string, details?: ResourceDetails) {
		super(
			message || `${details?.resourceType || "Resource"} not found`,
			details,
		);
	}

	static resource(resourceType: string, resourceId?: string): NotFoundError {
		const message = resourceId
			? `${resourceType} with ID '${resourceId}' not found`
			: `${resourceType} not found`;

		return new NotFoundError(message, {
			resourceType,
			resourceId,
		});
	}
}

export class ConflictError extends BaseError<ResourceDetails> {
	readonly statusCode = 409;
	readonly errorCode = "CONFLICT";

	constructor(
		message: string = "Resource conflict",
		details?: ResourceDetails,
	) {
		super(message, details);
	}

	static resource(resourceType: string, action: string): ConflictError {
		return new ConflictError(`${resourceType} ${action} conflict`, {
			resourceType,
			action,
		});
	}
}

// === AUTHENTICATION & AUTHORIZATION ERRORS ===

export class UnauthorizedError extends BaseError<AuthDetails> {
	readonly statusCode = 401;
	readonly errorCode = "UNAUTHORIZED";

	constructor(message: string = "Unauthorized access", details?: AuthDetails) {
		super(message, details);
	}

	static missingToken(): UnauthorizedError {
		return new UnauthorizedError("Authentication token is required");
	}

	static invalidToken(): UnauthorizedError {
		return new UnauthorizedError("Invalid authentication token");
	}

	static expiredToken(): UnauthorizedError {
		return new UnauthorizedError("Authentication token has expired");
	}
}

export class ForbiddenError extends BaseError<AuthDetails> {
	readonly statusCode = 403;
	readonly errorCode = "FORBIDDEN";

	constructor(message: string = "Forbidden access", details?: AuthDetails) {
		super(message, details);
	}

	static insufficientPermissions(
		requiredPermissions: string[],
	): ForbiddenError {
		return new ForbiddenError("Insufficient permissions", {
			requiredPermissions,
		});
	}

	static scope(scope: string): ForbiddenError {
		return new ForbiddenError(`Access denied for scope: ${scope}`, {
			scope,
		});
	}
}

// === RATE LIMITING ERRORS ===

export class TooManyRequestsError extends BaseError<RateLimitDetails> {
	readonly statusCode = 429;
	readonly errorCode = "TOO_MANY_REQUESTS";

	constructor(
		message: string = "Too many requests",
		details?: RateLimitDetails,
	) {
		super(message, details);
	}

	static rateLimit(
		limit: number,
		windowSize: string,
		resetTime: Date,
	): TooManyRequestsError {
		return new TooManyRequestsError(
			`Rate limit exceeded: ${limit} requests per ${windowSize}`,
			{
				limit,
				remaining: 0,
				resetTime,
				windowSize,
			},
		);
	}
}

// === SERVER ERRORS (5xx) ===

export class InternalServerError extends BaseError {
	readonly statusCode = 500;
	readonly errorCode = "INTERNAL_SERVER_ERROR";

	constructor(message: string = "Internal server error", cause?: Error) {
		super(message, undefined, cause);
	}
}

export class DatabaseError extends BaseError<DatabaseDetails> {
	readonly statusCode = 500;
	readonly errorCode = "DATABASE_ERROR";

	constructor(
		message: string = "Database operation failed",
		details?: DatabaseDetails,
		cause?: Error,
	) {
		super(message, details, cause);
	}

	static operation(
		operation: string,
		table?: string,
		cause?: Error,
	): DatabaseError {
		return new DatabaseError(
			`Database ${operation} failed`,
			{
				operation,
				table,
			},
			cause,
		);
	}

	static constraint(constraint: string, table?: string): DatabaseError {
		return new DatabaseError(`Database constraint violation: ${constraint}`, {
			constraint,
			table,
		});
	}
}

export class ExternalServiceError extends BaseError<ExternalServiceDetails> {
	readonly statusCode = 502;
	readonly errorCode = "EXTERNAL_SERVICE_ERROR";

	constructor(
		message: string = "External service error",
		details?: ExternalServiceDetails,
		cause?: Error,
	) {
		super(message, details, cause);
	}

	static service(
		service: string,
		endpoint?: string,
		responseStatus?: number,
		cause?: Error,
	): ExternalServiceError {
		const message = responseStatus
			? `External service '${service}' returned status ${responseStatus}`
			: `External service '${service}' error`;

		return new ExternalServiceError(
			message,
			{
				service,
				endpoint,
				responseStatus,
			},
			cause,
		);
	}
}

export class ServiceUnavailableError extends BaseError {
	readonly statusCode = 503;
	readonly errorCode = "SERVICE_UNAVAILABLE";

	constructor(message: string = "Service unavailable", cause?: Error) {
		super(message, undefined, cause);
	}
}

export class GatewayTimeoutError extends BaseError {
	readonly statusCode = 504;
	readonly errorCode = "GATEWAY_TIMEOUT";

	constructor(message: string = "Gateway timeout", cause?: Error) {
		super(message, undefined, cause);
	}
}

// === ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ===

/*
// Валидационные ошибки
throw ValidationError.field("email", "Invalid email format", "invalid-email");
throw ValidationError.multiple([
	{ field: "name", message: "Name is required" },
	{ field: "age", message: "Age must be positive", value: -5 }
]);

// Ошибки ресурсов
throw NotFoundError.resource("User", "123");
throw ConflictError.resource("Email", "already exists");

// Аутентификация и авторизация
throw UnauthorizedError.missingToken();
throw UnauthorizedError.invalidToken();
throw UnauthorizedError.expiredToken();
throw ForbiddenError.insufficientPermissions(["read:users", "write:users"]);
throw ForbiddenError.scope("admin");

// Лимитирование запросов
throw TooManyRequestsError.rateLimit(100, "1 hour", new Date(Date.now() + 3600000));

// Ошибки базы данных
throw DatabaseError.operation("SELECT", "users", new Error("Connection timeout"));
throw DatabaseError.constraint("unique_email", "users");

// Ошибки внешних сервисов
throw ExternalServiceError.service("PaymentAPI", "/payments", 503);

// Серверные ошибки
throw new InternalServerError("Unexpected error occurred");
throw new ServiceUnavailableError("Database is down for maintenance");
throw new GatewayTimeoutError("Upstream service timeout");

// Использование с middleware
export function errorHandler(args: { logger: Logger }) {
	return async (ctx: Context, next: Next) => {
		try {
			await next();
		} catch (error) {
			if (error instanceof BaseError) {
				ctx.status = error.statusCode;
				ctx.body = error.toJSON();
				args.logger.error(`Error ${error.statusCode}:`, error.toJSON());
			} else {
				args.logger.error("Unhandled error:", error);
				ctx.status = 500;
				ctx.body = {
					error: "INTERNAL_SERVER_ERROR",
					message: "An unexpected error occurred",
				};
			}
		}
	};
}
*/
