import { NumberInput, Select, Stack } from "@mantine/core";
import { type FC } from "react";
import type { UseUnitFieldState } from "./model/use-unit-field-state";
import { Units } from "./model/data";

type Props = {
  state: UseUnitFieldState;
  readOnly?: boolean;
  isDisabled?: boolean;
};

const UnitField: FC<Props> = ({
  state,
  isDisabled = false,
  readOnly = false,
}) => {
  return (
    <Stack flex={1} gap={4}>
      <Select
        {...state.select}
        autoFocus={false}
        size="md"
        variant="filled"
        placeholder="ед. изм."
        rightSectionWidth={21}
        data={Units}
      />
      <NumberInput
        {...state.input}
        size="lg"
        min={0}
        autoFocus={false}
        readOnly={readOnly}
        disabled={state.select.value === null || isDisabled}
        variant="default"
        decimalScale={4}
        decimalSeparator=","
        thousandSeparator=" "
        allowNegative={false}
        stepHoldDelay={500}
        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
      />
    </Stack>
  );
};

export default UnitField;
