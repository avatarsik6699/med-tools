import {
	NavLink,
	type NavLinkProps,
	type PolymorphicComponentProps,
} from "@mantine/core";
import { type FC } from "react";
import cn from "./style.module.css";

type Props = PolymorphicComponentProps<"a", NavLinkProps>;

const Link: FC<Props> = (props) => {
	return (
		<NavLink
			{...props}
			fw={500}
			p={0}
			active
			classNames={{
				root: cn.root,
				body: cn.body,
				label: cn.label,
			}}
		/>
	);
};

export default Link;
