import { Box, Container, List, rem, Stack, Text, Title } from "@mantine/core";
import React, { useMemo } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { MdTimeline } from "react-icons/md";
import { TfiHandPointRight } from "react-icons/tfi";
import IconWrapper from "../../shared/ui/icon-wrapper";
import InfoSection from "./components/info-section";
import UnitField from "./components/unit-field";
import {
	ConverterPageProvider,
	useConverterPageContext,
} from "./converter-page.context";
import { ConverterModel } from "./converter-page.model";
import cn from "./converter-page.module.css";
import { SubstancesSelect } from "./components/substances-select";
import LitiumStandarts from "./components/litium-standarts";
import { observer } from "mobx-react-lite";
import type { Unit } from "./model/units-convert.utils";

const ConverterPage: React.FC = () => {
	return (
		<ConverterPageProvider
			value={useMemo(() => ({ $store: new ConverterModel() }), [])}
		>
			<Container size="md">
				<Title mb="xl" c="dark.5">
					Концентрация лития в крови
				</Title>

				<Stack gap={0} mb="xl">
					<SubstancesSelect />

					<Box mb={4} className={cn["units-fields-wrapper"]}>
						<FromUnitField />

						<IconWrapper color="dark.4">
							<AiOutlineSwap size={24} />
						</IconWrapper>

						<ToUnitField />
					</Box>

					<Text size="sm" c="dark.0" ta="start">
						Примечание: Для лития значения в ммоль/л и мЭкв/л численно равны,
						поскольку литий является одновалентным ионом (Li⁺).
					</Text>
				</Stack>

				<Stack>
					<LitiumStandarts />
					<InfoSection
						withScroll={false}
						title="Частота сдачи крови на Литий (Li)"
						color="cyan.5"
						variant="light"
						icon={<MdTimeline size={24} />}
					>
						<List
							component={Stack}
							styles={{
								itemWrapper: {
									display: "flex",
									alignItems: "flex-start",
								},
								root: {
									listStyle: "none",
									gap: rem(8),
									marginBottom: rem(8),
								},
							}}
							icon={<TfiHandPointRight />}
							c="dark.5"
							size="sm"
						>
							<List.Item>
								Один раз в неделю — до достижения целевой концентрации
							</List.Item>
							<List.Item>
								Один раз в три месяца — первые полгода после достижения целевой
								концентрации
							</List.Item>
							<List.Item>
								Один раз в год на протяжении всего времени приёма
							</List.Item>
						</List>
						<Text c="dark.1" size="xs">
							Источник: Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE
							(8th edition, 2024)
						</Text>
					</InfoSection>
				</Stack>
			</Container>
		</ConverterPageProvider>
	);
};

const FromUnitField: React.FC = observer(() => {
	const { $store } = useConverterPageContext();

	return (
		<UnitField
			input={{
				value: $store.fromValue,
				onChange: $store.setFromValue,
			}}
			select={{
				value: $store.fromUnit,
				onChange: (value) => {
					if (value !== null) {
						$store.setFromUnit(value as Unit);
					}
				},
			}}
		/>
	);
});

const ToUnitField: React.FC = observer(() => {
	const { $store } = useConverterPageContext();

	return (
		<UnitField
			input={{
				value: $store.toValue,
				onChange: $store.setToValue,
			}}
			select={{
				value: $store.toUnit,
				onChange: (value) => {
					if (value !== null) {
						$store.setToUnit(value as Unit);
					}
				},
			}}
		/>
	);
});

export default ConverterPage;
