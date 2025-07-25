import {
	NumberInput,
	rem,
	Select,
	type NumberInputProps,
	type SelectProps,
} from "@mantine/core";
import React from "react";
import { BASE_UNITS_LIST } from "../model/units-convert.utils";

type Props = {
	select: SelectProps;
	input: NumberInputProps;
};

const UnitField: React.FC<Props> = (props) => {
	return (
		<NumberInput
			{...props.input}
			w="100%"
			flex={1}
			miw={200}
			rightSectionWidth={110}
			rightSectionProps={{
				style: { paddingLeft: 4 },
			}}
			inputMode="decimal"
			rightSection={
				<Select
					{...props.select}
					autoComplete="off"
					autoCorrect="off"
					// autoFocus={false}
					rightSectionWidth={20}
					comboboxProps={{
						width: "max-content",
					}}
					styles={{
						root: {
							marginRight: rem(4),
						},
						input: {
							height: rem(32),
							minHeight: rem(32),
							paddingRight: rem(5),
							paddingLeft: rem(5),
						},
					}}
					size="md"
					placeholder="ед. изм."
					data={BASE_UNITS_LIST}
					clearable={false}
					allowDeselect={false}
				/>
			}
			size="md"
			min={0}
			autoComplete="off"
			autoFocus={false}
			variant="default"
			decimalScale={4}
			decimalSeparator=","
			thousandSeparator=" "
			allowNegative={false}
			hideControls={false}
			allowDecimal={true}
			clampBehavior="strict"
			autoCorrect="off"
		/>
	);
};

export default UnitField;
