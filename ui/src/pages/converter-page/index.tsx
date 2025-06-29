import { Container, Group, Stack } from "@mantine/core";
import { type FC } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { useSelectState } from "../../shared/hooks/use-select-state";
import IconWrapper from "../../shared/ui/icon-wrapper";
import SubstancesSelect from "./ui/substances-select";
import cn from "./styles.module.css";
import { Substances } from "./ui/substances-select/model/data";
import UnitField from "./ui/unit-field";
import { useToUnitFromMmol } from "./ui/unit-field/model/use-to-unit-from-mmol";
import { useUnitFieldState } from "./ui/unit-field/model/use-unit-field-state";

const ConverterPage: FC = () => {
  const selectedSubstanceState = useSelectState();
  const fromUnitFieldState = useUnitFieldState();
  const toUnitFieldState = useToUnitFromMmol({
    selectedSubstanceState,
    fromUnitFieldState,
  });

  return (
    <Container size="xl">
      <Group className={cn.root}>
        <Stack w="100%" className={cn.units}>
          <SubstancesSelect state={selectedSubstanceState} />

          <Group wrap="nowrap">
            <UnitField
              isDisabled={selectedSubstanceState.value === null}
              state={fromUnitFieldState}
            />
            <IconWrapper color="dark.4" pt={42}>
              <AiOutlineSwap size={24} />
            </IconWrapper>
            <UnitField
              readOnly
              isDisabled={selectedSubstanceState.value === null}
              state={toUnitFieldState}
            />
          </Group>
        </Stack>

        {selectedSubstanceState.value !== null && (
          <Group w="100%">
            {Substances.get(selectedSubstanceState.value)!.Description}
          </Group>
        )}
      </Group>
    </Container>
  );
};

export default ConverterPage;
