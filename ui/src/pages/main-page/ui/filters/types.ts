/* eslint-disable @typescript-eslint/no-explicit-any */

export namespace FiltersTypes {
	export type State = any;

	export type Filter = {
		id: string;
		value: string;
		label: string;
		children?: Filter[];
	};

	export type Page = Required<Pick<Filter, "label" | "children" | "id">> & {};
}
