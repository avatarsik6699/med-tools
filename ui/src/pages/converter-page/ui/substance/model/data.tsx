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
							1 раз в неделю до тех пор, пока желаемая концентрация не будет
							достигнута
						</List.Item>
						<List.Item>Затем 1 раз в 3 месяца - первые полгода</List.Item>
						<List.Item>
							Затем 1 раз в год на протяжении всего времени приема лития
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
