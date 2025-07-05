import { Box, Container, Stack, Text, Title } from "@mantine/core";
import { type FC } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import {
	useSelectState,
	type UseSelectStateTypes,
} from "../../shared/hooks/use-select-state";
import IconWrapper from "../../shared/ui/icon-wrapper";
import { Substances } from "./components/substance/model/data";
import SubstancesSelect from "./components/substance/ui/substances-select";
import UnitField from "./components/unit-field";
import { useFromToUnitsState } from "./model/use-from-to-units-state";
import cn from "./styles.module.css";

const ConverterPage: FC = () => {
	const selectedSubstanceState = useSelectState({
		initialValue: "litium",
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
						<UnitFields selectedSubstanceId={selectedSubstanceState.value} />
					</Box>
				)}

				<Text size="sm" c="dark.0" ta="start">
					Примечание: Для лития значения в ммоль/л и мЭкв/л численно равны,
					поскольку литий является одновалентным ионом (Li⁺).
				</Text>
			</Stack>

			{selectedSubstanceState.value && (
				<Stack>
					{Substances.get(selectedSubstanceState.value)!.NormativeValues}
					{Substances.get(selectedSubstanceState.value)!.InfoSections}
				</Stack>
			)}
		</Container>
	);
};

type UnitFieldsProps = {
	selectedSubstanceId: NonNullable<UseSelectStateTypes.Return["value"]>;
};

const UnitFields: FC<UnitFieldsProps> = (props) => {
	const state = useFromToUnitsState({
		selectedSubstanceId: props.selectedSubstanceId,
	});

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
