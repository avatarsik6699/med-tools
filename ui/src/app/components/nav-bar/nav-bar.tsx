import RouterLink from "@/shared/ui/router-link";
import { AppShell, ScrollArea, Stack } from "@mantine/core";
import { type FC } from "react";
import { TbTransform } from "react-icons/tb";
import SearchByTools from "./components/search-by-tools";
import cn from "./styles.module.css";

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

			<AppShell.Section component={ScrollArea} grow>
				<Stack gap="xs">
					<RouterLink onClick={onItemClick} className={cn.navbar_link} to="/">
						<TbTransform size={16} /> Конвертер
					</RouterLink>
					{/* TODO: временно отклбючено */}
					{/* <RouterLink
						disabled
						onClick={onItemClick}
						className={cn.navbar_link}
						to="/path-ways"
					>
						<PiPath size={16} /> Схемы
					</RouterLink> */}
				</Stack>
			</AppShell.Section>
		</AppShell.Navbar>
	);
};

export default NavBar;
