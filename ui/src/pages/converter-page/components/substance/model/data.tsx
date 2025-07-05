import { List, rem, Stack, Text } from "@mantine/core";
import { MdTimeline } from "react-icons/md";
import { TfiHandPointRight } from "react-icons/tfi";
import type { ConverterPageTypes } from "../../../types";
import InfoSection from "../ui/info-section";
import LitiumStandarts from "../ui/litium/litium-standarts";

export const Substances = new Map<string, ConverterPageTypes.Substance>([
	[
		"litium",
		{
			value: "6.94",
			label: "Литий (Li)",
			NormativeValues: <LitiumStandarts />,
			InfoSections: [
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
				</InfoSection>,
			],
		},
	],
]);
