import { Group, Text } from "@mantine/core";
import { type FC } from "react";
import { LiaMedrt } from "react-icons/lia";
import IconWrapper from "../../shared/ui/icon-wrapper";

const Title: FC = () => {
	return (
		<Group gap={0}>
			<IconWrapper color="dark.4">
				<LiaMedrt size={32} />
			</IconWrapper>

			<Text
				gradient={{ from: "dark.3", to: "dark.5", deg: 320 }}
				variant="gradient"
				component="h1"
				lts={-1}
				fw={900}
				fz="h4"
			>
				MedTools
			</Text>
		</Group>
	);
};

export default Title;
