import type { UseSelectState } from "@/shared/hooks/use-select-state";
import { rem, Select } from "@mantine/core";
import { type FC } from "react";
import { substances } from "./data";

type Props = {
  state: UseSelectState;
};

const SubstancesSelect: FC<Props> = ({ state }) => {
  return (
    <Select
      {...state}
      maw={rem(432)}
      searchable
      maxDropdownHeight={200}
      comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
      clearable
      labelProps={{
        fz: "xs",
      }}
      label="Выберите вещество:"
      placeholder="Вещество..."
      nothingFoundMessage="Nothing found..."
      data={substances}
    />
  );
};

export default SubstancesSelect;
