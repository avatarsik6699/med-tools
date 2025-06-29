import { theme } from "@/app/theme";
import { Alert, rem, ScrollArea, type AlertProps } from "@mantine/core";
import { type FC } from "react";
import { TbInfoCircle } from "react-icons/tb";

const CONTENT_HEIGHT = 250;

const styles: Required<AlertProps["styles"]> = {
  icon: {
    color: theme.colors.blue[5],
    marginTop: 4,
  },
  title: {
    fontSize: theme.fontSizes.md,
  },
};

type Props = Pick<AlertProps, "title" | "children">;

const SubstanceDescription: FC<Props> = ({ children, ...props }) => {
  return (
    <Alert
      {...props}
      styles={styles}
      variant="light"
      color="dark.5"
      icon={<TbInfoCircle size={32} />}
    >
      <ScrollArea
        offsetScrollbars={true}
        h={CONTENT_HEIGHT}
        scrollHideDelay={500}
        type="auto"
        scrollbarSize={4}
      >
        {children}
      </ScrollArea>
    </Alert>
  );
};

export default SubstanceDescription;
