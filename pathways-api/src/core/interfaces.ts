// src/core/interfaces.ts

import { PaginationTypes } from "./services/pagination/pagination.types.js";

export type Repository<
	Entity,
	CreateDto = unknown,
	UpdateDto = unknown,
	FindAllDto = unknown,
> = {
	findAll(args: FindAllDto): Promise<PaginationTypes.Response<Entity>>;

	findOneById(args: { id: string }): Promise<Entity | null>;
	create(args: { payload: CreateDto }): Promise<Entity>;
	update(args: { id: string; payload: UpdateDto }): Promise<Entity>;
	remove(args: { id: string }): Promise<Entity>;
};

export type Service<T, CreateDTO = any, UpdateDTO = any> = {
	getAll(filters?: any): Promise<T[]>;
	getById(id: string): Promise<T | null>;
	create(data: CreateDTO): Promise<T>;
	update(id: string, data: UpdateDTO): Promise<T>;
	remove(id: string): Promise<void>;
};

export type EnvConfig = {
	NODE_ENV: "development" | "production" | "test";
};

export type IEnvConfigService<E = EnvConfig> = {
	getConfig(): E;
	get<K extends keyof E>(key: K): E[K];
	getOrThrow<K extends keyof E>(key: K): NonNullable<E[K]>;
	isValid(): boolean;
};

export type ILoggerService = {
	info(message: string, meta?: Record<string, unknown>): void;
	error(message: string, meta?: Record<string, unknown> | Error): void;
	warn(message: string, meta?: Record<string, unknown>): void;
	debug(message: string, meta?: Record<string, unknown>): void;
};
