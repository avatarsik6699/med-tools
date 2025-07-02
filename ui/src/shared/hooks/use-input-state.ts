import { useInputState as useLibInputState } from "@mantine/hooks";
import { useCallback } from "react";

export namespace UseInputStateTypes {
	export type Return<V = unknown> = ReturnType<typeof useInputState<V>>;
	export type Params<InitialValue> = {
		initialValue: InitialValue;
	};
}

export const useInputState = <InitialValue>(
	params: UseInputStateTypes.Params<InitialValue>,
) => {
	const [value, setValue] = useLibInputState<InitialValue>(params.initialValue);

	return {
		value,
		onChange: useCallback(
			(value: InitialValue) => {
				setValue(value);
			},
			[setValue],
		),
	};
};
