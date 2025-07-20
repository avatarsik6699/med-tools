import { buildContext } from "../../shared/lib";

type Context = {
	fromInputValue: number | null;
};

export const {
	Provider: ConverterPageProvider,
	useContext: useConverterPageContext,
} = buildContext<Context>();
