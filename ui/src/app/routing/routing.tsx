import { createRouter } from "@tanstack/react-router";
import { converterRoute } from "./routes/converter/route";
import { pathWaysRoute } from "./routes/pathways/pathways.route";
import { rootRoute } from "./routes/root/route";

export const router = createRouter({
	// Добавляем base URL для GitHub Pages
	basepath: import.meta.env.PROD ? "/med-tools" : "",
	routeTree: rootRoute.addChildren([converterRoute, pathWaysRoute]),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
