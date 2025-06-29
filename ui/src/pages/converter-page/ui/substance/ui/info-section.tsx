import { theme } from "@/app/theme";
import { Alert, ScrollArea, type AlertProps } from "@mantine/core";
import { type FC } from "react";

const CONTENT_HEIGHT = 200;

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
>;

const InfoSection: FC<Props> = ({ children, ...props }) => {
  return (
    <Alert {...props} styles={styles}>
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
    </Alert>
  );
};

export default InfoSection;
