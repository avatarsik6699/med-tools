import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: process.env.NODE_ENV === "production" ? "/med-tools/" : "/",
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "0.0.0.0", // Позволяет доступ из внешней сети
		port: 5173, // Стандартный порт Vite
		strictPort: true, // Если порт занят, попробует следующий
		hmr: {
			clientPort: 5173,
		},
	},
});
