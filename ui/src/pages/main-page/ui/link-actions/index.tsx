import {
	ActionIcon,
	Menu,
	Tooltip,
	type MenuItemProps,
	type PolymorphicComponentProps,
} from "@mantine/core";
import type { FC } from "react";
import { GiSettingsKnobs } from "react-icons/gi";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";

type Props = {
	onEdit: () => void;
	onRemove: () => void;
};

const LinkActions: FC<Props> = (props) => {
	return (
		<Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
			<Menu.Target>
				<Tooltip
					bg="dark.5"
					label="Действия"
					withArrow
					position="right"
					transitionProps={{ transition: "fade-right", duration: 300 }}
				>
					<ActionIcon
						color="dark.5"
						variant="transparent"
						aria-label="Settings"
					>
						<GiSettingsKnobs size={16} />
					</ActionIcon>
				</Tooltip>
			</Menu.Target>

			<Menu.Dropdown>
				<ActionItem
					onClick={props.onEdit}
					color="dark.5"
					leftSection={<MdOutlineEdit size={14} />}
				>
					Редактировать
				</ActionItem>
				<ActionItem
					onClick={props.onRemove}
					color="red.5"
					leftSection={<MdOutlineDelete size={14} />}
				>
					Удалить
				</ActionItem>
			</Menu.Dropdown>
		</Menu>
	);
};

const ActionItem: FC<
	Pick<
		PolymorphicComponentProps<"button", MenuItemProps>,
		"leftSection" | "color" | "children" | "onClick"
	>
> = ({ children, ...props }) => {
	return (
		<Menu.Item
			styles={{
				itemSection: {
					margin: 4,
				},
			}}
			fz="xs"
			p={0}
			pr={10}
			{...props}
		>
			{children}
		</Menu.Item>
	);
};

export default LinkActions;
