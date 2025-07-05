import { AppShell, Group } from "@mantine/core";
import type { ReactNode } from "@tanstack/react-router";
import { type FC } from "react";
import Title from "./title";

type Props = {
	Burger: ReactNode;
};

const Header: FC<Props> = (props) => {
	return (
		<AppShell.Header withBorder={true}>
			<Group w="100%" h="100%" py="sm" px="md" gap={3}>
				{props.Burger}
				<Title />
			</Group>
		</AppShell.Header>
	);
};

export default Header;
