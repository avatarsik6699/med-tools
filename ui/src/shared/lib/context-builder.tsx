import React, { createContext, useContext, useMemo } from "react";

const DEFAULT_CONTEXT_NAME = "CustomContext";
const DEFAULT_ERROR_MESSAGE =
	"Context value is undefined. Make sure you are inside the Provider.";

type ProviderProps<State> = {
	value: State;
	children: React.ReactNode;
};

type Params<State> = {
	name?: string;
	defaultValue?: State;
};

export const buildContext = <State,>({
	name = DEFAULT_CONTEXT_NAME,
	defaultValue,
}: Params<State> = {}) => {
	const Context = createContext<State | undefined>(defaultValue);

	function useCustomContext(): State {
		const ctx = useContext(Context);

		if (ctx === undefined) {
			throw new Error(`[${name}] ${DEFAULT_ERROR_MESSAGE}`);
		}

		return ctx;
	}

	const Provider: React.FC<ProviderProps<State>> = ({ children, ...props }) => {
		// useMemo to avoid unnecessary rerenders
		const memoizedValue = useMemo(() => props.value, [props.value]);

		return (
			<Context.Provider value={memoizedValue}>{children}</Context.Provider>
		);
	};

	return {
		Context,
		Provider,
		useContext: useCustomContext,
	};
};

// Пример использования:
// const { Provider: MyProvider, useContext: useMyContext } = createContextBuilder<MyType>({ name: 'MyContext' });
// <MyProvider value={...}>{children}</MyProvider>
// const value = useMyContext();
