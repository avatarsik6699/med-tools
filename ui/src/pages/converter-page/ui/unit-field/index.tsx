import { NumberInput, Select, Stack } from "@mantine/core";
import { type FC } from "react";
import type { UseUnitFieldState } from "./model/use-unit-field-state";
import data from "./data.json";

type Props = {
  state: UseUnitFieldState;
  readOnly?: boolean;
};

const UnitField: FC<Props> = ({ state, readOnly = false }) => {
  return (
    <Stack gap={4}>
      <Select
        {...state.select}
        size="xs"
        variant="filled"
        placeholder="ед. изм."
        rightSectionWidth={21}
        data={data.units}
      />
      <NumberInput
        {...state.input}
        readOnly={readOnly}
        disabled={state.select.value === null}
        placeholder="Введите значение..."
        variant="default"
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
