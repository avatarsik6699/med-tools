import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root/route";
import PathwaysPage from "@/pages/pathways-page/pathways-page";

export const pathWaysRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/path-ways",
	component: PathwaysPage,
});
