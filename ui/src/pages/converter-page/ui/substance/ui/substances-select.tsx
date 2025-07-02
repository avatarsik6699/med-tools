import { Select } from "@mantine/core";
import { useMemo, type FC } from "react";
import { Substances } from "../model/data";
import type { UseSelectStateTypes } from "@/shared/hooks/use-select-state";

type Props = {
	state: UseSelectStateTypes.Return;
};

const SubstancesSelect: FC<Props> = ({ state }) => {
	return (
		<Select
			{...state}
			size="md"
			searchable
			maxDropdownHeight={250}
			comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
			clearable
			placeholder="Выберите вещество"
			nothingFoundMessage="Ничего не найдено"
			data={useMemo(
				() =>
					Array.from(Substances.entries()).map(([id, substance]) => ({
						value: id,
						label: substance.label,
					})),
				[],
			)}
		/>
	);
};

export default SubstancesSelect;
