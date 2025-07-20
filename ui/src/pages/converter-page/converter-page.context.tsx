import { buildContext } from "../../shared/lib";
import type { Unit } from "./components/unit-field/model/convert-unit";

type Context = {
	fromInputUnit: Unit;
	fromInputValue: number | null;
};

export const {
	Provider: ConverterPageProvider,
	useContext: useConverterPageContext,
} = buildContext<Context>();
