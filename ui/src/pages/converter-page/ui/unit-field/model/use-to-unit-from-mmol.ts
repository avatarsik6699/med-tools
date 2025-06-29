import {
  useSelectState,
  type UseSelectState,
} from "@/shared/hooks/use-select-state";
import type { UseUnitFieldState } from "./use-unit-field-state";
import { noop } from "@mantine/core";
import { useMemo } from "react";
import { convertMmolToUnit, convertUnitToMmol } from "./convert-unit";
import { Substances } from "../../substance/model/data";

type Params = {
  selectedSubstanceState: UseSelectState;
  fromUnitFieldState: UseUnitFieldState;
};

export const useToUnitFromMmol = (params: Params): UseUnitFieldState => {
  const toUnitSelectState = useSelectState();

  return {
    select: toUnitSelectState,
    input: {
      onChange: noop,
      value: useMemo(() => {
        const validParams = getValidParams({ ...params, toUnitSelectState });

        if (validParams !== null) {
          return convertMmolToUnit({
            unit: toUnitSelectState.value!,
            molarMass: validParams.substanceMolarMass,
            value: validParams.mmol,
          });
        }
      }, [params, toUnitSelectState]),
    },
  };
};

type ValidParams = {
  substanceMolarMass: number;
  mmol: number;
};

function getValidParams(
  params: Params & { toUnitSelectState: UseSelectState }
): ValidParams | null {
  if (params.selectedSubstanceState.value === null) {
    return null;
  }

  if (
    params.fromUnitFieldState.select.value === null ||
    params.toUnitSelectState.value === null ||
    params.fromUnitFieldState.input.value === undefined ||
    params.fromUnitFieldState.input.value === ""
  ) {
    return null;
  }

  const substanceMolarMass = Number(
    Substances.get(params.selectedSubstanceState.value)!.value
  );

  return {
    substanceMolarMass,
    mmol: convertUnitToMmol({
      unit: params.fromUnitFieldState.select.value,
      value: Number(params.fromUnitFieldState.input.value),
      molarMass: substanceMolarMass,
    }),
  };
}
