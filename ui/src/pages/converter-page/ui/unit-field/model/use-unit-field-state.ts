import { useSelectState } from "@/shared/hooks/use-select-state"
import { useInputState } from "@mantine/hooks"

export const useUnitFieldState = () => {
  const selectState = useSelectState()
  const [numberValue, setNumberValue] = useInputState<string | number | undefined>(undefined)

  return {
    select: selectState,
    input: {
      value: numberValue,
      onChange: setNumberValue
    }
  }
}

export type UseUnitFieldState = ReturnType<typeof useUnitFieldState>