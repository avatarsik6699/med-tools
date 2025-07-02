import { useCallback, useState } from "react";

const INITIAL_VALUE = "";

export const useSearchState = () => {
	const [value, setValue] = useState(INITIAL_VALUE);

	return {
		value,
		isEmpty: value.length === 0,
		set: useCallback((value: string | undefined | null) => {
			if (typeof value != "string") {
				setValue(INITIAL_VALUE);
			} else {
				setValue(value.toLowerCase().trim());
			}
		}, []),
		reset: useCallback(() => {
			setValue(INITIAL_VALUE);
		}, []),
	};
};
