import type { SelectProps } from "@mantine/core";
import { useCallback, useState } from "react";

type StateValue = Exclude<SelectProps["value"], undefined>;
type OriginalValue = SelectProps["value"];

export namespace UseSelectStateTypes {
	export type Return = ReturnType<typeof useSelectState>;
	export type Params = {
		initialValue: SelectProps["defaultValue"];
	};
}

export const useSelectState = (params: UseSelectStateTypes.Params) => {
	const [value, setValue] = useState<StateValue>(() =>
		toStateValue(params.initialValue),
	);

	return {
		value,
		onChange: useCallback((value: OriginalValue) => {
			setValue(toStateValue(value));
		}, []),
	};
};

function toStateValue(value: OriginalValue): StateValue {
	if (value === undefined) {
		return null;
	}

	return value;
}
