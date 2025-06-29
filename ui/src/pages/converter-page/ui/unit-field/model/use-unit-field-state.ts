import { useSelectState } from "@/shared/hooks/use-select-state";
import { useInputState } from "@mantine/hooks";

type Value = string | number | undefined;

export const useUnitFieldState = () => {
  const selectState = useSelectState();
  const [numberValue, setNumberValue] = useInputState<Value>("");

  return {
    select: selectState,
    input: {
      value: numberValue,
      onChange: (value: Value) => {
        setNumberValue(value);
      },
    },
  };
};

export type UseUnitFieldState = ReturnType<typeof useUnitFieldState>;
