import { buildContext } from "../../shared/lib";
import type { ConverterModel } from "./converter-page.model";

type Context = {
	$store: ConverterModel;
};

export const {
	Provider: ConverterPageProvider,
	useContext: useConverterPageContext,
} = buildContext<Context>();
