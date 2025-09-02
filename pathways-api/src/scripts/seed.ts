import { EnvConfigService } from "../core/env.js";
import { LoggerService } from "../core/logger.js";
import { PrismaClient } from "../generated/prisma/index.js";

const env = new EnvConfigService();
const logger = new LoggerService(env);
const prisma = new PrismaClient();

async function main() {
	logger.info("🌱 Seeding database...");

	// Создаем тестовые аптеки
	const pathways = await prisma.pathway.createMany({
		data: [
			{
				title: "Machine Learning Fundamentals",
				description:
					"Comprehensive pathway covering basic concepts of machine learning, including supervised and unsupervised learning algorithms",
			},
			{
				title: "Web Development with React",
				description:
					"Full-stack web development pathway focusing on React ecosystem, including hooks, state management, and modern tooling",
			},
			{
				title: "Data Science Pipeline",
				description:
					"End-to-end data science workflow from data collection and cleaning to model deployment and monitoring",
			},
			{
				title: "DevOps Best Practices",
				description:
					"Infrastructure as code, CI/CD pipelines, containerization, and cloud deployment strategies",
			},
		],
	});

	logger.info(`✅ Created ${pathways.count} pathways`);
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
