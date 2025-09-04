import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	// Определяем целевой URL в зависимости от режима
	// TODO: в идеале настроить работу с env переменными и брать ссылки оттуда
	const targetUrl = (() => {
		switch (mode) {
			case "local":
				return env.VITE_API_URL;
			case "proxy":
				return "";
			default:
				return env.VITE_API_URL;
		}
	})();

	// Логируем конфигурацию для дебага
	console.log("🚀 Vite Config Debug:");
	console.log("  Mode:", mode);
	console.log("  VITE_API_URL:", env.VITE_API_URL);
	console.log("  Target URL:", targetUrl);

	return {
		plugins: [react()],
		/*
      Зачем нужен:
      В production ("/med-tools/") - приложение будет развернуто в подпапке, например https://domain.com/med-tools/
      В development ("/") - приложение доступно в корне, например http://localhost:5173/
      Нужен ли:
      ДА, если планируете деплой в подпапку на сервере
      НЕТ, если приложение всегда будет в корне домена
    */
		base: process.env.NODE_ENV === "production" ? "/med-tools/" : "/",
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			port: 3001,
			strictPort: true,
			proxy: {
				// Прокси для локальной разработки
				"/api": {
					target: targetUrl,
					changeOrigin: true,
					secure: mode !== "local", // Отключаем SSL проверку только для localhost
					rewrite: (path) => path,
					configure: (proxy, options) => {
						/** Раскомментируется по необходимости нужные уровни логгирования */
						proxy.on("proxyReq", (proxyReq, req) => {
							// Логируем детали проксирования
							console.group(`🔍 Proxy Request[ ${proxyReq.method} ]:`);
							console.log("  Original URL:", req.url);
							console.log("  Target URL:", `${options.target}${proxyReq.path}`);
							console.groupEnd();
							console.log(""); // Пустая строка для разделения
						});

						proxy.on("proxyRes", (proxyRes, req) => {
							// Логируем ответ от прокси
							console.group(`📡 Proxy Response:`);
							console.log("  Status:", proxyRes.statusCode);
							console.log("  URL:", req.url);
							console.groupEnd();
							console.log(""); // Пустая строка для разделения
						});

						proxy.on("error", (err, req) => {
							// Логируем ошибки прокси
							console.error("❌ Proxy Error:", err.message);
							console.error("  URL:", req.url);
							console.error("  Target:", options.target);
						});
					},
				},
				"/ws": {
					target: targetUrl,
					ws: true,
					changeOrigin: true,
					secure: mode !== "local",
					rewrite: (path) => path,
					configure: (proxy, options) => {
						proxy.on("proxyReq", (proxyReq, req) => {
							// Логируем детали проксирования WebSocket
							console.group(`🔍 WS Proxy Request[ ${proxyReq.method} ]:`);
							console.log("  Original URL:", req.url);
							console.log("  Target URL:", `${options.target}${proxyReq.path}`);
							console.groupEnd();
							console.log("");
						});

						proxy.on("proxyRes", (proxyRes, req) => {
							// Логируем ответ от прокси WebSocket
							console.group(`📡 WS Proxy Response:`);
							console.log("  Status:", proxyRes.statusCode);
							console.log("  URL:", req.url);
							console.groupEnd();
							console.log("");
						});

						proxy.on("error", (err, req) => {
							// Логируем ошибки прокси WebSocket
							console.error("❌ WS Proxy Error:", err.message);
							console.error("  URL:", req.url);
							console.error("  Target:", options.target);
						});
					},
				},
			},
		},
	};
});
