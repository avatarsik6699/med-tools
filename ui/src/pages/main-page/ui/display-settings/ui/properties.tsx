import { Chip, Group, Stack, Text } from "@mantine/core";
import { type FC } from "react";

const Properties: FC = () => {
	return (
		<Stack>
			<Text size="xs" c="dark.2">
				Display properties
			</Text>
			<Chip.Group multiple>
				<Group gap="xs" wrap="wrap" align="center">
					<Chip size="xs" value="1">
						Original URL
					</Chip>
					<Chip size="xs" value="2">
						Slug
					</Chip>
					<Chip size="xs" value="3">
						CreatedAt
					</Chip>
					<Chip size="xs" value="4">
						Creator
					</Chip>
					<Chip size="xs" value="5">
						Icon
					</Chip>
					<Chip size="xs" value="6">
						Description
					</Chip>
				</Group>
			</Chip.Group>
		</Stack>
	);
};

export default Properties;
