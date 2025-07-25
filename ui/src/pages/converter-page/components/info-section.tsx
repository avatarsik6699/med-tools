import { theme } from "@/app/theme";
import { Alert, ScrollArea, type AlertProps } from "@mantine/core";
import { type FC } from "react";

const CONTENT_HEIGHT = 150;

const styles: Required<AlertProps["styles"]> = {
	icon: {
		marginTop: 4,
	},
	title: {
		display: "block",
		fontSize: theme.fontSizes.md,
	},
};

type Props = Pick<
	AlertProps,
	"title" | "children" | "color" | "variant" | "icon"
> & {
	withScroll?: boolean;
};

const InfoSection: FC<Props> = ({ children, withScroll = false, ...props }) => {
	return (
		<Alert {...props} styles={styles}>
			{withScroll ? (
				<ScrollArea
					offsetScrollbars={true}
					h="100%"
					mah={CONTENT_HEIGHT}
					scrollHideDelay={500}
					type="hover"
					scrollbarSize={4}
				>
					{children}
				</ScrollArea>
			) : (
				children
			)}
		</Alert>
	);
};

export default InfoSection;
