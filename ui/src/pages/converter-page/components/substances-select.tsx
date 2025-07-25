import { Select } from "@mantine/core";
import { useMemo } from "react";
import { useConverterPageContext } from "../converter-page.context";
import { BASE_SUBSTANCES } from "../model/substances.model";

import { observer } from "mobx-react-lite";

const Inner: React.FC = () => {
	const { $store } = useConverterPageContext();

	const data = useMemo(
		() =>
			Array.from(BASE_SUBSTANCES.entries()).map(([id, substance]) => ({
				value: id,
				label: substance.label,
			})),
		[],
	);

	return (
		<Select
			value={$store.selectedSubstanceId}
			onChange={(value) => {
				if (value) {
					$store.setSelectedSubstanceId(value);
				}
			}}
			size="md"
			mb="md"
			searchable={false}
			// comboboxProps={{ transitionProps: { transition: "pop", duration: 200 } }}
			clearable={false}
			allowDeselect={false}
			placeholder="Выберите вещество"
			nothingFoundMessage="Ничего не найдено"
			data={data}
		/>
	);
};

export const SubstancesSelect = observer(Inner);
