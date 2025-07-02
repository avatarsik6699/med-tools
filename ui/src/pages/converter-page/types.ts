import type React from "react";

export namespace ConverterPageTypes {
	export type Substance = {
		value: string;
		label: string;
		NormativeValues: React.ReactNode;
		InfoSections: React.ReactNode[];
	};
}
