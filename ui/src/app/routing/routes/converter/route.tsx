import { createRoute } from "@tanstack/react-router";
import ConverterPage from "@/pages/converter-page/converter-page";
import { rootRoute } from "../root/route";

export const converterRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: ConverterPage,
});
