import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../root/route";
import { searchParams } from "./search-params-schema";
import MainPage from "../../../../pages/main-page/main-page";

export const mainRoute = createRoute({
  getParentRoute: () => rootRoute,
  validateSearch: searchParams,
  path: "/",
  component: MainPage,
});
