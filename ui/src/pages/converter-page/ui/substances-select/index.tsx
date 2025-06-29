import type { UseSelectState } from "@/shared/hooks/use-select-state";
import { Select } from "@mantine/core";
import { type FC } from "react";
import { substances } from "./data";

type Props = {
  state: UseSelectState;
};

const SubstancesSelect: FC<Props> = ({ state }) => {
  return (
    <Select
      {...state}
      size="md"
      searchable
      maxDropdownHeight={200}
      comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
      clearable
      label="Выберите вещество:"
      placeholder="Вещество..."
      nothingFoundMessage="Nothing found..."
      data={substances}
    />
  );
};

export default SubstancesSelect;
