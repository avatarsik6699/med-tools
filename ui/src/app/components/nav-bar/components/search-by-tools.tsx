import { TextInput } from "@mantine/core";
import { type FC } from "react";
import { useSearchState } from "@/shared/hooks/use-search-state";
import { LuSearch } from "react-icons/lu";

const SearchByTools: FC = () => {
	const search = useSearchState();

	return (
		<TextInput
			leftSection={<LuSearch size={16} />}
			value={search.value}
			miw={240}
			w="100%"
			onChange={(e) => search.set(e.currentTarget.value)}
			placeholder="Введите название..."
		/>
	);
};

export default SearchByTools;
