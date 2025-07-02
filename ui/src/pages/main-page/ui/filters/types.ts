import type { MainRouteTypes } from "../../../../app/routing/routes/main/types";

export namespace FiltersTypes {
	export type State = MainRouteTypes.SearchParams;

	export type Filter = {
		id: string;
		value: string;
		label: string;
		children?: Filter[];
	};

	export type Page = Required<Pick<Filter, "label" | "children" | "id">> & {};
}
