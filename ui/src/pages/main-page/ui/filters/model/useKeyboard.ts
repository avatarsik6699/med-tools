import { getHotkeyHandler } from "@mantine/hooks";
import type { KeyboardEvent } from "react";

type Params = {
	onBackspace: (e: KeyboardEvent) => void;
};

export const useKeyboard = (params: Params) => {
	return getHotkeyHandler([
		[
			"Enter",
			() => {
				console.log("Enter pressed in search");
			},
			{ preventDefault: false },
		],
		["Backspace", params.onBackspace, { preventDefault: false }],
		[
			"Escape",
			() => {
				console.log("Escape pressed in search");
			},
			{ preventDefault: false },
		],
	]);
};
