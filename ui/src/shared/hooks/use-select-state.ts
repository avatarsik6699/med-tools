import { useState } from "react";

export const useSelectState = () => {
  const [value, setValue] = useState<string | null>(null);

  return {
    value,
    onChange: setValue
}
}

export type UseSelectState = ReturnType<typeof useSelectState>