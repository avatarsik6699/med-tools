import {
	NumberInput,
	rem,
	Select,
	type NumberInputProps,
	type SelectProps,
} from "@mantine/core";
import { type FC } from "react";
import { Units } from "./model/data";

type Props = {
	select?: SelectProps;
	input?: NumberInputProps;
};

const UnitField: FC<Props> = (props) => {
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
			rightSection={
				<Select
					{...props.select}
					autoFocus={false}
					rightSectionWidth={20}
					comboboxProps={{
						width: "max-content",
					}}
					styles={{
						root: {
							marginRight: rem(5),
						},
						input: {
							height: "var(--input-height-sm)",
							minHeight: "var(--input-height-sm)",
							paddingRight: rem(5),
							paddingLeft: rem(5),
						},
					}}
					size="md"
					placeholder="ед. изм."
					data={Units}
					clearable={false}
					allowDeselect={false}
				/>
			}
			size="lg"
			min={0}
			autoFocus={false}
			variant="default"
			decimalScale={4}
			decimalSeparator=","
			thousandSeparator=" "
			allowNegative={false}
			hideControls={false}
			allowDecimal={true}
			clampBehavior="strict"
		/>
	);
};

export default UnitField;
