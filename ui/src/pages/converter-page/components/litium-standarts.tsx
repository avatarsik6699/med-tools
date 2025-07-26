import { Flex, List, NativeSelect, rem, Stack, Text } from "@mantine/core";
import { type FC } from "react";

import { PiStandardDefinition } from "react-icons/pi";

import { observer } from "mobx-react-lite";
import { IoAlert, IoCheckmark } from "react-icons/io5";
import IconWrapper from "../../../shared/ui/icon-wrapper";
import { useConverterPageContext } from "../converter-page.context";
import type { ValidationItem } from "../model/substances.model";
import InfoSection from "./info-section";

const LitiumStandarts: React.FC = observer(() => {
	const { $store } = useConverterPageContext();

	return (
		<Stack gap={0}>
			<InfoSection
				withScroll={false}
				color="indigo.5"
				variant="light"
				icon={<PiStandardDefinition size={24} />}
				title={
					<NativeSelect
						autoComplete="off"
						autoCorrect="off"
						value={$store.selectedStandardKey}
						data={$store.standardsList}
						onChange={(value) => {
							if (value.target.value) {
								$store.setSelectedStandardKey(value.target.value);
							}
						}}
						label="Терапевтические диапазоны по разным источникам"
						w="100%"
						fw={400}
						size="md"
					/>
				}
			>
				{$store.selectedStandard && (
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
							{$store.selectedStandard.items.map((item, index) => (
								<Row key={index} {...item} />
							))}
						</List>
						{$store.standardSource && (
							<Text c="dark.1" size="xs">
								Источник: {$store.standardSource}
							</Text>
						)}
					</>
				)}
			</InfoSection>
		</Stack>
	);
});

// --- Extracted utility: renders the range string in a clear, isolated way ---
const RangeText: React.FC<{ range: ValidationItem["range"] }> = ({ range }) => {
	if (!range) return null;
	if ("min" in range && "max" in range) {
		if (range.min === range.max) {
			return (
				<>
					{range.min.toFixed(1).replace(".", ",")} {range.unit}
				</>
			);
		}
		return (
			<>
				{range.min.toFixed(1).replace(".", ",")} -{" "}
				{range.max.toFixed(1).replace(".", ",")} {range.unit}
			</>
		);
	} else if ("value" in range) {
		return (
			<>
				≥ {range.value.toFixed(1).replace(".", ",")} {range.unit}
			</>
		);
	}
	return null;
};

// --- Extracted: status icon logic ---
const StatusIcon: React.FC<{ status: "ok" | "error" | "neutral" }> = ({
	status,
}) => {
	if (status === "error") {
		return (
			<IconWrapper color="red.7">
				<IoAlert size={21} />
			</IconWrapper>
		);
	}
	if (status === "ok") {
		return (
			<IconWrapper color="green.7">
				<IoCheckmark size={21} />
			</IconWrapper>
		);
	}
	return null;
};

// --- Extracted: children rendering for nested standards ---
const ChildrenList: React.FC<{ children: ValidationItem[] }> = ({
	children,
}) => (
	<List
		styles={{
			item: { listStyle: "none" },
			itemWrapper: { display: "flex", alignItems: "flex-start" },
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
		{children.map((item, index) => (
			<Row key={index} {...item} />
		))}
	</List>
);

// --- Main Row component, now much simpler and more declarative ---
const Row: FC<ValidationItem> = observer((props) => {
	const { $store } = useConverterPageContext();

	const { status } = $store.validateValueAgainstStandardItem(
		typeof $store.fromValue === "number" ? $store.fromValue : NaN,
		$store.fromUnit,
		props,
	);

	return (
		<List.Item>
			<Stack gap={4}>
				<Text size="md" fw={500}>
					{props.condition} {props.range ? ":" : ""}
				</Text>
				{props.range && (
					<Flex align="center">
						<StatusIcon status={status} />
						<Text
							size="md"
							c={
								status === "ok"
									? "green.7"
									: status === "error"
										? "red.7"
										: "dark.4"
							}
						>
							<RangeText range={props.range} />
						</Text>
					</Flex>
				)}
				{props.children && <ChildrenList children={props.children} />}
			</Stack>
		</List.Item>
	);
});

export default LitiumStandarts;
