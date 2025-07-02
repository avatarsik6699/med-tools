import { useSelectState } from "@/shared/hooks/use-select-state";
import { Group, List, rem, Select, Stack, Text } from "@mantine/core";
import { type FC } from "react";
import { TbPoint } from "react-icons/tb";

import { PiStandardDefinition } from "react-icons/pi";
import InfoSection from "../info-section";

interface ValidationRange {
	min: number;
	max: number;
	unit: string;
}

interface ValidationItem {
	condition: string;
	range: ValidationRange;
}

interface StandardData {
	value: string;
	label: string;
	source: string;
	items: ValidationItem[];
}

const data = new Map<string, StandardData>([
	[
		"Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE",
		{
			value: "Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE",
			label: "Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE",
			source:
				"Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE (8th edition, 2024)",
			items: [
				{
					condition: "маниакальный эпизод",
					range: { min: 1.0, max: 1.5, unit: "ммоль/л" },
				},
				{
					condition: "депрессивный эпизод",
					range: { min: 0.6, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "поддерживающая концентрация",
					range: { min: 0.7, max: 1.0, unit: "ммоль/л" },
				},
			],
		},
	],
	[
		"МОДСЛИ",
		{
			value: "МОДСЛИ",
			label: "МОДСЛИ",
			source:
				"МОДСЛИ (The Maudsley Prescribing Guidelines in Psychiatry (15th edition, 2025))",
			items: [
				{
					condition: "поддерживающая концентрация",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
				{
					condition: "хороший ответ и/или плохая переносимость",
					range: { min: 0.4, max: 0.6, unit: "ммоль/л" },
				},
				{
					condition: "плохой ответ и/или хорошая переносимость",
					range: { min: 0.8, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "монополярная депрессия",
					range: { min: 0.6, max: 1.0, unit: "ммоль/л" },
				},
			],
		},
	],
	[
		"РОП",
		{
			value: "РОП",
			label: "РОП",
			source:
				"РОП (Российское общество психиатров. Клинические рекомендации. Биполярное аффективное расстройство. Год утверждения 2021)",
			items: [
				{
					condition: "маниакальный эпизод",
					range: { min: 0.8, max: 1.2, unit: "ммоль/л" },
				},
				{
					condition: "депрессивный эпизод",
					range: { min: 0.6, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "поддерживающая концентрация",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
				{
					condition: "токсическая доза",
					range: { min: 1.5, max: 1.5, unit: "ммоль/л" },
				},
			],
		},
	],
	[
		"CANMAT",
		{
			value: "CANMAT",
			label: "CANMAT",
			source:
				"CANMAT (Canadian Network for Mood and Anxiety Treatments and International Society for Bipolar Disorders (ISBD) 2018 guidelines for the management of patients with bipolar disorder)",
			items: [
				{
					condition: "депрессивный эпизод",
					range: { min: 0.8, max: 1.2, unit: "мЭкв/л" },
				},
				{
					condition: "поддерживающая концентрация",
					range: { min: 0.6, max: 1.0, unit: "мЭкв/л" },
				},
				{
					condition: "лицам пожилого возраста",
					range: { min: 0.4, max: 0.8, unit: "мЭкв/л" },
				},
			],
		},
	],
	[
		"RANZCP",
		{
			value: "RANZCP",
			label: "RANZCP",
			source:
				"RANZCP (The 2020 Royal Australian and New Zealand College of Psychiatrists clinical practice guidelines for mood disorders)",
			items: [
				{
					condition: "второй и третий триместры",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
			],
		},
	],
	[
		"NICE",
		{
			value: "NICE",
			label: "NICE",
			source:
				"NICE (National Institute for Health and Care Excellence. Bipolar disorder: assessment and management. Clinical guideline. Published: 24 September 2014. Last updated: 21 December 2023)",
			items: [
				{
					condition: "назначение лития впервые",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
				{
					condition: "при недостаточном эффекте",
					range: { min: 0.8, max: 1.0, unit: "ммоль/л" },
				},
			],
		},
	],
	[
		"WFSBP",
		{
			value: "WFSBP",
			label: "WFSBP",
			source:
				"WFSBP (The World Federation of Societies of Biological Psychiatry. Guidelines for the Biological Treatment of Bipolar Disorders. Update 2009 on the Treatment of Acute Mania Protocol. Update 2010 on the treatment of acute bipolar depression. Update 2012 on the long-term treatment of bipolar disorder. Acute and longterm treatment of mixed states in bipolar disorder 2017)",
			items: [
				{
					condition: "маниакальный эпизод",
					range: { min: 0.6, max: 1.3, unit: "ммоль/л" },
				},
				{
					condition: "депрессивный эпизод",
					range: { min: 0.8, max: 1.3, unit: "мЭкв/л" },
				},
				{
					condition: "профилактика маниакальных эпизодов",
					range: { min: 0.6, max: 1.5, unit: "ммоль/л" },
				},
				{
					condition: "профилактика депрессивных эпизодов",
					range: { min: 0.4, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "смешанный эпизод (острый и профилактика)",
					range: { min: 0.6, max: 1.2, unit: "ммоль/л" },
				},
			],
		},
	],
]);

const LitiumStandarts: FC = () => {
	const state = useSelectState({ initialValue: "CANMAT" });

	return (
		<Stack gap={0}>
			<InfoSection
				title={
					<Select
						{...state}
						w="100%"
						fw={400}
						comboboxProps={{
							transitionProps: { transition: "pop", duration: 200 },
						}}
						size="md"
						searchable={false}
						maxDropdownHeight={200}
						clearable={false}
						placeholder="Выберите источник нормы"
						nothingFoundMessage="Ничего не найдено"
						data={Array.from(data.values())}
					/>
				}
				color="indigo.5"
				variant="light"
				icon={<PiStandardDefinition size={24} />}
			>
				{state.value !== null && (
					<>
						<List
							component={Stack}
							styles={{
								itemIcon: {
									lineHeight: 1.8,
									marginInlineEnd: 4,
								},
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
							icon={<TbPoint />}
							c="dark.5"
							size="sm"
						>
							{data.get(state.value)?.items.map((item, index) => (
								<List.Item key={index}>
									<Group gap={4}>
										<Text size="md" fw={500}>
											{item.condition}:
										</Text>
										<Text size="md" c="dark.4">
											{item.range.min} - {item.range.max} {item.range.unit}
										</Text>
									</Group>
								</List.Item>
							))}
						</List>
						<Text c="dark.1" size="xs">
							Источник: {data.get(state.value)!.source}
						</Text>
					</>
				)}
			</InfoSection>
		</Stack>
	);
};

export default LitiumStandarts;
