import Koa from "koa";

export async function bootstrap(
	app: Koa,
	port: number | string = process.env.PORT || 3000,
) {
	const server = app.listen(port, () => {
		console.log(`🚀 Сервер запущен на порту 1 ${port}`);
	});

	if (process.env.NODE_ENV !== "development") {
		const gracefulShutdown = (signal: string) => {
			console.warn(
				`\n⚠️  Получен сигнал ${signal}, корректно завершаем работу...`,
			);

			server.close((err) => {
				if (err) {
					console.error("❌ Ошибка при закрытии сервера:", err);
					process.exit(1);
				} else {
					console.log("✅ Сервер корректно остановлен");
					// Здесь можно добавить закрытие БД, очистку ресурсов и т.д.
					process.exit(0);
				}
			});

			// Принудительное завершение через 10 секунд, если graceful shutdown не сработал
			setTimeout(() => {
				console.error("⏰ Принудительное завершение работы");

				process.exit(1);
			}, 10000);
		};

		process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
		process.on("SIGINT", () => gracefulShutdown("SIGINT"));
	}

	return server;
}
