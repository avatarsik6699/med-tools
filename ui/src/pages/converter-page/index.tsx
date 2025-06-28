import { Alert, Group, noop, rem, Stack, Text } from "@mantine/core";
import { useMemo, type FC } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { useSelectState } from "../../shared/hooks/use-select-state";
import IconWrapper from "../../shared/ui/icon-wrapper";
import SubstancesSelect from "./ui/substances-select";
import UnitField from "./ui/unit-field";
import { convertMmolToUnit, convertUnitToMmol } from "./ui/unit-field/model/convert-unit";
import { useUnitFieldState } from "./ui/unit-field/model/use-unit-field-state";
import { TbInfoCircle } from "react-icons/tb";
import { substances } from "./ui/substances-select/data";

const ConverterPage: FC = () => {
  const substance = useSelectState();
  const fromUnit = useUnitFieldState();
  const toUnit = useSelectState();

  const toUnitValue = useMemo(() => {
    const { input, select } = fromUnit;

    if (select.value && input.value && substance.value && toUnit.value) {
      const mmol = convertUnitToMmol({
        unit: select.value,
        value: +input.value,
        molarMass: +substance.value,
      });

      return convertMmolToUnit({
        unit: toUnit.value,
        value: mmol,
        molarMass: +substance.value,
      });
    }

    return undefined;
  }, [fromUnit, substance.value, toUnit.value]);

  return (
    <Group w="100%" align="flex-start" wrap="nowrap">
      <Stack miw={450}>
        <SubstancesSelect state={substance} />
        <Group wrap="nowrap" align="center">
          <UnitField state={fromUnit} />
          <IconWrapper
            styles={{
              root: {
                paddingTop: rem(32),
              },
            }}
            color="dark.4">
            <AiOutlineSwap size={18} />
          </IconWrapper>
          <UnitField
            readOnly
            state={{
              select: toUnit,
              input: {
                value: toUnitValue,
                onChange: noop,
              },
            }}
          />
        </Group>
      </Stack>
      {/* TODO: переделать на нормальный поиск с использованием id */}
      {substance.value && substances.find((item) => item.value === substance.value)?.description}
    </Group>
  );
};

export default ConverterPage;
