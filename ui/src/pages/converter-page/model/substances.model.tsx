export type Substance = {
	// molar mass
	value: string;
	label: string;
};

export const BASE_SUBSTANCES = new Map<string, Substance>([
	[
		"litium",
		{
			value: "6.94",
			label: "Литий (Li)",
		},
	],
]);
