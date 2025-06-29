import type { UseSelectState } from "@/shared/hooks/use-select-state";
import { Select } from "@mantine/core";
import { useMemo, type FC } from "react";
import { Substances } from "../model/data";

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
      nothingFoundMessage="Ничего не найдено"
      data={useMemo(
        () =>
          Array.from(Substances.entries()).map(([id, substance]) => ({
            value: id,
            label: substance.label,
          })),
        []
      )}
    />
  );
};

export default SubstancesSelect;
