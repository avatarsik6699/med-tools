import { Box, Container, Stack, Text, Title } from "@mantine/core";
import { type FC } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { useSelectState } from "../../shared/hooks/use-select-state";
import IconWrapper from "../../shared/ui/icon-wrapper";
import { Substances } from "./components/substance/model/data";
import SubstancesSelect from "./components/substance/ui/substances-select";
import UnitField from "./components/unit-field";
import { ConverterPageProvider } from "./converter-page.context";
import { useFromToUnitsState } from "./model/use-from-to-units-state";
import cn from "./styles.module.css";

const ConverterPage: FC = () => {
	const selectedSubstanceState = useSelectState({
		initialValue: "litium",
	});

	const state = useFromToUnitsState({
		selectedSubstanceId: selectedSubstanceState.value!,
	});

	return (
		<Container size="md">
			<Title mb="xl" c="dark.5">
				Концентрация лития в крови
			</Title>

			<Stack gap={0} mb="xl">
				<SubstancesSelect state={selectedSubstanceState} />

				{selectedSubstanceState.value && (
					<Box mb={4} className={cn["units-fields-wrapper"]}>
						<UnitFields state={state} />
					</Box>
				)}

				<Text size="sm" c="dark.0" ta="start">
					Примечание: Для лития значения в ммоль/л и мЭкв/л численно равны,
					поскольку литий является одновалентным ионом (Li⁺).
				</Text>
			</Stack>

			<ConverterPageProvider
				value={{
					fromInputValue:
						// TODO: надо сделать более норм проверку
						state.from.input.value === undefined ||
						state.from.input.value === ""
							? null
							: (state.from.input.value as number),
				}}
			>
				{selectedSubstanceState.value && (
					<Stack>
						{Substances.get(selectedSubstanceState.value)!.NormativeValues}
						{Substances.get(selectedSubstanceState.value)!.InfoSections}
					</Stack>
				)}
			</ConverterPageProvider>
		</Container>
	);
};

type UnitFieldsProps = {
	state: ReturnType<typeof useFromToUnitsState>;
};

const UnitFields: FC<UnitFieldsProps> = ({ state }) => {
	return (
		<>
			<UnitField {...state.from} />

			<IconWrapper color="dark.4">
				<AiOutlineSwap size={24} />
			</IconWrapper>

			<UnitField {...state.to} />
		</>
	);
};

export default ConverterPage;
