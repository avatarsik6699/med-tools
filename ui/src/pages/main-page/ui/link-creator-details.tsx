import {
	Text,
	type PolymorphicComponentProps,
	type TextProps,
} from "@mantine/core";
import { type FC } from "react";

type Props = Pick<PolymorphicComponentProps<"p", TextProps>, "children">;

const LinkCreatorDetails: FC<Props> = ({ children }) => {
	{
		/* todo: поповер с инфой */
	}
	return (
		<Text c="dark.5" size="xs">
			{children}
		</Text>
	);
};

export default LinkCreatorDetails;
