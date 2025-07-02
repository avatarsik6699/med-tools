import type { NumberInputProps } from "@mantine/core";
import { useMemo } from "react";
import {
	useInputState,
	type UseInputStateTypes,
} from "@/shared/hooks/use-input-state";
import {
	useSelectState,
	type UseSelectStateTypes,
} from "@/shared/hooks/use-select-state";
import { Substances } from "../ui/substance/model/data";
import { convertUnit, type Unit } from "../ui/unit-field/model/convert-unit";
import { Units } from "../ui/unit-field/model/data";

type InputStateValue = NumberInputProps["value"];
type SelectStateValue = UseSelectStateTypes.Params["initialValue"];

type Params = {
	selectedSubstanceId: NonNullable<UseSelectStateTypes.Return["value"]>;
};

export const useFromToUnitsState = (params: Params) => {
	const substanceMolarMass = useMemo(() => {
		return Number(Substances.get(params.selectedSubstanceId)!.value);
	}, [params.selectedSubstanceId]);

	const fromSelectState = useSelectState({ initialValue: Units[4].value });
	const fromInputState = useInputState<InputStateValue>({
		initialValue: "",
	});

	const toSelectState = useSelectState({ initialValue: Units[1].value });
	const toInputState = useInputState<InputStateValue>({
		initialValue: "",
	});

	const onChangeDependField = (
		value: InputStateValue,
		fromUnit: Unit,
		toUnit: Unit,
		unitFieldOnChangeFn: UseInputStateTypes.Return<InputStateValue>["onChange"],
	) => {
		if (typeof value !== "number") {
			unitFieldOnChangeFn("");
		} else {
			unitFieldOnChangeFn(
				convertUnit({
					molarMass: substanceMolarMass,
					fromUnit,
					toUnit,
					value,
				}),
			);
		}
	};

	return {
		from: {
			input: {
				value: fromInputState.value,
				onChange: (value: InputStateValue) => {
					fromInputState.onChange(value);

					onChangeDependField(
						value,
						fromSelectState.value as Unit,
						toSelectState.value as Unit,
						toInputState.onChange,
					);
				},
			},
			select: {
				value: fromSelectState.value,
				onChange: (value: SelectStateValue) => {
					fromSelectState.onChange(value);

					// Если меняю выбор в левом поле, то пересчитывается значение в правом поле
					// т.к. это интуитивно кажется правильным.
					onChangeDependField(
						fromInputState.value,
						value as Unit,
						toSelectState.value as Unit,
						toInputState.onChange,
					);
				},
			},
		},

		to: {
			input: {
				value: toInputState.value,
				onChange: (value: InputStateValue) => {
					toInputState.onChange(value);

					onChangeDependField(
						value,
						toSelectState.value as Unit,
						fromSelectState.value as Unit,
						fromInputState.onChange,
					);
				},
			},
			select: {
				value: toSelectState.value,
				onChange: (value: SelectStateValue) => {
					toSelectState.onChange(value);

					// Если меняю выбор в правом поле, то пересчитывается значение в этом же поле
					// т.к. это интуитивно кажется правильным.
					onChangeDependField(
						fromInputState.value,
						fromSelectState.value as Unit,
						value as Unit,
						toInputState.onChange,
					);
				},
			},
		},
	};
};
