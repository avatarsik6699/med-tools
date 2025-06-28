import { z } from "zod";
import type { searchParams } from "./search-params-schema";

export namespace MainRouteTypes {
  export type SearchParams = z.infer<typeof searchParams>
}