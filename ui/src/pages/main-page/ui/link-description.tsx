import { Text, type PolymorphicComponentProps, type TextProps } from "@mantine/core";
import { type FC } from "react";

type Props = Pick<PolymorphicComponentProps<"p", TextProps>, "children"> & {};

const LinkDescription: FC<Props> = ({ children, ...props }) => {
  return (
    <Text mb="xs" lineClamp={1} size="xs" c="dimmed">
      {children}
    </Text>
  );
};

export default LinkDescription;
