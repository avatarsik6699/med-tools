import {
	createRoute,
	createRouter,
	Link,
	Outlet,
} from "@tanstack/react-router";
import { z } from "zod";
import { mainRoute } from "./routes/main/route";
import { rootRoute } from "./routes/root/route";
import { converterRoute } from "./routes/converter/route";
import { pathWaysRoute } from "./routes/pathways/pathways.route";

const productSearchSchema = z.object({
	page: z.number().default(1),
	filter: z.string().default(""),
	sort: z.enum(["newest", "oldest", "price"]).default("newest"),
});

const aboutPage = createRoute({
	getParentRoute: () => rootRoute,
	path: "/about",
	validateSearch: productSearchSchema,
	component: () => {
		return <>about</>;
	},
});

// Пример pathless роута для проверки авторизации
const protectedRoute = createRoute({
	getParentRoute: () => rootRoute,
	id: "protected", // Pathless роут - нет path
	beforeLoad: ({ context }) => {
		// Здесь можно добавить проверку авторизации
		// if (true) {
		//   throw redirect({ to: "/" });
		// }
		console.log(context);
	},
	component: function ProtectedLayout() {
		return (
			<div>
				<div
					style={{
						padding: "0.5rem",
						backgroundColor: "#e3f2fd",
						marginBottom: "1rem",
					}}
				>
					🔒 Защищенная область
				</div>
				<Link to="/about">go to about</Link>
				<Outlet />
			</div>
		);
	},
});

// Дочерний роут protected роута
const profileRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: "profile", // URL будет /profile (не /protected/profile)
	component: function Profile() {
		return (
			<div className="p-2">
				<h2>Профиль пользователя</h2>
				<p>Эта страница доступна только авторизованным пользователям</p>
			</div>
		);
	},
});

// Еще один дочерний роут protected роута
const settingsRoute = createRoute({
	getParentRoute: () => protectedRoute,
	path: "settings", // URL будет /settings
	component: function Settings() {
		return (
			<div className="p-2">
				<h2>Настройки</h2>
				<p>Настройки вашего аккаунта</p>
			</div>
		);
	},
});

export const router = createRouter({
	// Добавляем base URL для GitHub Pages
	basepath: import.meta.env.PROD ? "/med-tools" : "",
	routeTree: rootRoute.addChildren([
		converterRoute,
		mainRoute,
		aboutPage,
		protectedRoute.addChildren([profileRoute, settingsRoute, pathWaysRoute]),
	]),
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
