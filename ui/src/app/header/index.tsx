import { AppShell, Flex, Group, Text } from "@mantine/core";
import type { ReactNode } from "@tanstack/react-router";
import { type FC } from "react";
import { LiaMedrt } from "react-icons/lia";
import IconWrapper from "../../shared/ui/icon-wrapper";
import LoginButton from "./ui/login-button";

type Props = {
	Burger: ReactNode;
};

const Header: FC<Props> = (props) => {
	return (
		<AppShell.Header withBorder={true}>
			<Flex justify="space-between" w="100%" h="100%" py="sm" px="md">
				<Group gap={3}>
					{props.Burger}
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

				<LoginButton />
			</Flex>
		</AppShell.Header>
	);
};

export default Header;
