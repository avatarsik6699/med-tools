import { EnvConfigService } from "../core/env.js";
import { LoggerService } from "../core/logger.js";
import { PrismaClient } from "../generated/prisma/index.js";

const env = new EnvConfigService();
const logger = new LoggerService(env);
const prisma = new PrismaClient();

async function main() {
	logger.info("🌱 Seeding database...");

	// Создаем pathway для диагностики диабета
	const createdPathways = await Promise.all([
		prisma.pathway.create({
			data: {
				title: "Диагностика сахарного диабета",
				description: "Комплексная схема диагностики сахарного диабета: от первичных симптомов до постановки диагноза",
			}
		}),
		prisma.pathway.create({
			data: {
				title: "Мониторинг диабета 2 типа",
				description: "Алгоритм наблюдения и контроля состояния пациентов с диабетом 2 типа",
			}
		}),
	]);

	// Создаем узлы для диагностики диабета
	const diabetesNodes = await Promise.all([
		prisma.node.create({
			data: {
				label: "Первичные симптомы",
				pathwayId: createdPathways[0].id,
			}
		}),
		prisma.node.create({
			data: {
				label: "Анализ глюкозы натощак",
				pathwayId: createdPathways[0].id,
			}
		}),
		prisma.node.create({
			data: {
				label: "Глюкозотолерантный тест",
				pathwayId: createdPathways[0].id,
			}
		}),
		prisma.node.create({
			data: {
				label: "HbA1c анализ",
				pathwayId: createdPathways[0].id,
			}
		}),
		prisma.node.create({
			data: {
				label: "Постановка диагноза",
				pathwayId: createdPathways[0].id,
			}
		}),
	]);

	// Создаем узлы для мониторинга диабета 2 типа
	const monitoringNodes = await Promise.all([
		prisma.node.create({
			data: {
				label: "Контроль гликемии",
				pathwayId: createdPathways[1].id,
			}
		}),
		prisma.node.create({
			data: {
				label: "Контроль артериального давления",
				pathwayId: createdPathways[1].id,
			}
		}),
		prisma.node.create({
			data: {
				label: "Осмотр офтальмолога",
				pathwayId: createdPathways[1].id,
			}
		}),
	]);

	// Создаем связи между узлами диагностики
	const diagnosticEdges = await Promise.all([
		prisma.edge.create({
			data: {
				condition: "yes",
				pathwayId: createdPathways[0].id,
				fromNodeId: diabetesNodes[0].id, // Первичные симптомы
				toNodeId: diabetesNodes[1].id, // Анализ глюкозы натощак
			}
		}),
		prisma.edge.create({
			data: {
				condition: "glucose_high",
				pathwayId: createdPathways[0].id,
				fromNodeId: diabetesNodes[1].id, // Анализ глюкозы натощак
				toNodeId: diabetesNodes[2].id, // Глюкозотолерантный тест
			}
		}),
		prisma.edge.create({
			data: {
				condition: "glucose_normal",
				pathwayId: createdPathways[0].id,
				fromNodeId: diabetesNodes[1].id, // Анализ глюкозы натощак
				toNodeId: diabetesNodes[3].id, // HbA1c анализ
			}
		}),
		prisma.edge.create({
			data: {
				condition: "positive",
				pathwayId: createdPathways[0].id,
				fromNodeId: diabetesNodes[2].id, // Глюкозотолерантный тест
				toNodeId: diabetesNodes[4].id, // Постановка диагноза
			}
		}),
		prisma.edge.create({
			data: {
				condition: "elevated",
				pathwayId: createdPathways[0].id,
				fromNodeId: diabetesNodes[3].id, // HbA1c анализ
				toNodeId: diabetesNodes[4].id, // Постановка диагноза
			}
		}),
	]);

	// Создаем связи между узлами мониторинга
	const monitoringEdges = await Promise.all([
		prisma.edge.create({
			data: {
				condition: "yes",
				pathwayId: createdPathways[1].id,
				fromNodeId: monitoringNodes[0].id, // Контроль гликемии
				toNodeId: monitoringNodes[1].id, // Контроль АД
			}
		}),
		prisma.edge.create({
			data: {
				condition: "yes",
				pathwayId: createdPathways[1].id,
				fromNodeId: monitoringNodes[1].id, // Контроль АД
				toNodeId: monitoringNodes[2].id, // Осмотр офтальмолога
			}
		}),
	]);

	logger.info(`✅ Created ${createdPathways.length} pathways`);
	logger.info(`✅ Created ${diabetesNodes.length + monitoringNodes.length} nodes`);
	logger.info(`✅ Created ${diagnosticEdges.length + monitoringEdges.length} edges`);
	logger.info("🌱 Seeding completed!");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
