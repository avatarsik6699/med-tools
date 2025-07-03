import RouterLink from "@/shared/ui/router-link";
import { AppShell, Divider, Group, ScrollArea } from "@mantine/core";
import { type FC } from "react";
import { TbTransform } from "react-icons/tb";
import cn from "./styles.module.css";
import SearchByTools from "./ui/search-by-tools";
import { PiPath } from "react-icons/pi";

type Props = {
	onItemClick: () => void;
};

const NavBar: FC<Props> = (props) => {
	const onItemClick = () => {
		props.onItemClick();
	};

	return (
		<AppShell.Navbar p="md">
			<AppShell.Section mb="xs">
				<SearchByTools />
			</AppShell.Section>
			<AppShell.Section grow component={ScrollArea}>
				<Group>
					<RouterLink onClick={onItemClick} className={cn.navbar_link} to="/">
						<TbTransform size={16} /> Конвертер
					</RouterLink>
					<RouterLink
						onClick={onItemClick}
						className={cn.navbar_link}
						to="/path-ways"
					>
						<PiPath size={16} /> Схемы
					</RouterLink>
				</Group>
			</AppShell.Section>
			<AppShell.Section>
				<Divider />
			</AppShell.Section>
		</AppShell.Navbar>
	);
};

export default NavBar;
