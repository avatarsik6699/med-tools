import { createRoute } from "@tanstack/react-router";
import ConverterPage from "@/pages/converter-page";
import { rootRoute } from "../root/route";

export const converterRoute = createRoute({
  getParentRoute: () => rootRoute,
  // validateSearch: searchParams,
  path: "/",
  component: ConverterPage
});
