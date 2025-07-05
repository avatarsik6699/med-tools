import { useSelectState } from "@/shared/hooks/use-select-state";
import { Box, em, List, rem, Select, Stack, Text } from "@mantine/core";
import { type FC } from "react";

import { PiStandardDefinition } from "react-icons/pi";
import InfoSection from "../info-section";

interface ValidationRange {
	min: number;
	max: number;
	unit: string;
}

interface ValidationItem {
	condition: string;
	range?: ValidationRange;
	children?: ValidationItem[];
}

interface StandardData {
	value: string;
	label: string;
	source: string;
	items: ValidationItem[];
}

const data = new Map<string, StandardData>([
	[
		"Stahl",
		{
			value: "Stahl",
			label: "Stahl's PRESCRIBER'S GUIDE",
			source:
				"Stahl's Essential Psychopharmacology PRESCRIBER'S GUIDE (8th edition, 2024)",
			items: [
				{
					condition: "Маниакальный эпизод",
					range: { min: 1.0, max: 1.5, unit: "ммоль/л" },
				},
				{
					condition: "Депрессивный эпизод",
					range: { min: 0.6, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "Поддерживающая концентрация",
					range: { min: 0.7, max: 1.0, unit: "ммоль/л" },
				},
			],
		},
	],
	[
		"MODSLI",
		{
			value: "MODSLI",
			label: "Прескрайбер Модсли",
			source:
				"The Maudsley Prescribing Guidelines in Psychiatry (15th edition, 2025)",
			items: [
				{
					condition: "Поддерживающая концентрация",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
				{
					condition: "Хороший ответ и/или плохая переносимость",
					range: { min: 0.4, max: 0.6, unit: "ммоль/л" },
				},
				{
					condition: "Плохой ответ и/или хорошая переносимость",
					range: { min: 0.8, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "Монополярная депрессия",
					range: { min: 0.6, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition:
						"Концентрация выше 0,75 ммоль/л - увеличение только противоманиакального эффекта",
				},
			],
		},
	],
	[
		"ROP",
		{
			value: "ROP",
			label: "РОП",
			source:
				"Российское общество психиатров. Клинические рекомендации. Биполярное аффективное расстройство. Год утверждения 2021",
			items: [
				{
					condition: "Маниакальный эпизод",
					range: { min: 0.8, max: 1.2, unit: "ммоль/л" },
				},
				{
					condition: "Депрессивный эпизод",
					range: { min: 0.6, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "Поддерживающая концентрация",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
				{
					condition: "Токсическая доза",
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
				"Canadian Network for Mood and Anxiety Treatments and International Society for Bipolar Disorders (ISBD) 2018 guidelines for the management of patients with bipolar disorder",
			items: [
				{
					condition: "Депрессивный эпизод",
					range: { min: 0.8, max: 1.2, unit: "мЭкв/л" },
				},
				{
					condition: "Поддерживающая концентрация",
					range: { min: 0.6, max: 1.0, unit: "мЭкв/л" },
				},
				{
					condition: "Лицам пожилого возраста",
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
				"The 2020 Royal Australian and New Zealand College of Psychiatrists clinical practice guidelines for mood disorders",
			items: [
				{
					condition: "При беременности",
					children: [
						{
							condition: "Второй и третий триместры",
							range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
						},
					],
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
				"National Institute for Health and Care Excellence. Bipolar disorder: assessment and management. Clinical guideline. Published: 24 September 2014. Last updated: 21 December 2023",
			items: [
				{
					condition: "Назначение лития впервые",
					range: { min: 0.6, max: 0.8, unit: "ммоль/л" },
				},
				{
					condition: "При недостаточном эффекте",
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
				"The World Federation of Societies of Biological Psychiatry. Guidelines for the Biological Treatment of Bipolar Disorders. Update 2009 on the Treatment of Acute Mania Protocol. Update 2010 on the treatment of acute bipolar depression. Update 2012 on the long-term treatment of bipolar disorder. Acute and longterm treatment of mixed states in bipolar disorder 2017",
			items: [
				{
					condition: "Маниакальный эпизод",
					range: { min: 0.6, max: 1.3, unit: "ммоль/л" },
				},
				{
					condition: "Депрессивный эпизод",
					range: { min: 0.8, max: 1.3, unit: "мЭкв/л" },
				},
				{
					condition: "Профилактика маниакальных эпизодов",
					range: { min: 0.6, max: 1.5, unit: "ммоль/л" },
				},
				{
					condition: "Профилактика депрессивных эпизодов",
					range: { min: 0.4, max: 1.0, unit: "ммоль/л" },
				},
				{
					condition: "Смешанный эпизод (острый и профилактика)",
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
				withScroll={false}
				color="indigo.5"
				variant="light"
				icon={<PiStandardDefinition size={24} />}
				title={
					<Select
						{...state}
						label="Терапевтические диапазоны по разным источникам"
						w="100%"
						fw={400}
						scrollAreaProps={{ type: "auto" }}
						maxDropdownHeight={320}
						size="md"
						searchable={false}
						clearable={false}
						placeholder="Выберите источник нормы"
						nothingFoundMessage="Ничего не найдено"
						data={Array.from(data.values())}
					/>
				}
			>
				{state.value !== null && (
					<>
						<List
							component={Stack}
							styles={{
								item: {
									listStyle: "none",
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
							c="dark.5"
							size="sm"
						>
							{data.get(state.value)?.items.map((item, index) => (
								<ValidationItem key={index} {...item} />
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

type ValidationItemProps = ValidationItem;
const ValidationItem: FC<ValidationItemProps> = (props) => (
	<List.Item>
		<Stack gap={4}>
			<Text size="sm" fw={500}>
				{props.condition}:
			</Text>
			{props.range && (
				<Text size="sm" c="dark.4">
					{props.range.min.toFixed(1).replace(".", ",")} -{" "}
					{props.range.max.toFixed(1).replace(".", ",")} {props.range.unit}
				</Text>
			)}
			{props.children && (
				<List
					styles={{
						item: {
							listStyle: "none",
						},
						itemWrapper: {
							display: "flex",
							alignItems: "flex-start",
						},
						root: {
							listStyle: "none",
							gap: rem(8),
							marginBottom: rem(8),
							marginLeft: rem(16),
						},
					}}
					component={Stack}
					c="dark.5"
					size="sm"
				>
					{props.children.map((item, index) => (
						<ValidationItem key={index} {...item} />
					))}
				</List>
			)}
		</Stack>
	</List.Item>
);

export default LitiumStandarts;
