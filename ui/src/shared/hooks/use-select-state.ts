import { useState } from "react";

export const useSelectState = (defaultValue?: string | null) => {
  const [value, setValue] = useState<string | null>(defaultValue ?? null);

  return {
    value,
    onChange: setValue
  }
}

export type UseSelectState = ReturnType<typeof useSelectState>