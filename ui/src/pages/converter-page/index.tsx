import { Container, Grid, Group, Stack } from "@mantine/core";
import { type FC } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import {
	useSelectState,
	type UseSelectStateTypes,
} from "../../shared/hooks/use-select-state";
import IconWrapper from "../../shared/ui/icon-wrapper";
import { useFromToUnitsState } from "./model/use-from-to-units-state";
import cn from "./styles.module.css";
import { Substances } from "./ui/substance/model/data";
import SubstancesSelect from "./ui/substance/ui/substances-select";
import UnitField from "./ui/unit-field";
import { Text } from "@mantine/core";

const ConverterPage: FC = () => {
	const selectedSubstanceState = useSelectState({
		initialValue: "litium",
	});

	return (
		<Container size="xl">
			<Grid gutter={{ base: "md" }}>
				<Grid.Col pt={24} span={{ base: 12, sm: 6 }}>
					<Stack>
						<SubstancesSelect state={selectedSubstanceState} />

						{selectedSubstanceState.value && (
							<Group className={cn["units-fields-wrapper"]}>
								<UnitFields
									selectedSubstanceId={selectedSubstanceState.value}
								/>
							</Group>
						)}

						<Text size="sm" c="dark.0" ta="start">
							Примечание: Для лития значения в ммоль/л и мЭкв/л численно равны,
							поскольку литий является одновалентным ионом (Li⁺).
						</Text>
					</Stack>
				</Grid.Col>

				<Grid.Col span={{ base: 12, sm: 6 }}>
					{selectedSubstanceState.value && (
						<Stack>
							{Substances.get(selectedSubstanceState.value)!.NormativeValues}
							{Substances.get(selectedSubstanceState.value)!.InfoSections}
						</Stack>
					)}
				</Grid.Col>
				<Group></Group>
			</Grid>
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
