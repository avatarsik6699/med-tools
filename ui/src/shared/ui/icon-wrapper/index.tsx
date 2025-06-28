import { ThemeIcon, type ThemeIconProps } from "@mantine/core";
import type { FC } from "react";

type Props = Pick<ThemeIconProps, "color" | "children" | "onMouseEnter" | "onMouseLeave" | "styles"> & {};

const IconWrapper: FC<Props> = ({ children, ...props }) => {
  return (
    <ThemeIcon mih="auto" h="auto" miw="auto" w="auto" variant="transparent" {...props}>
      {children}
    </ThemeIcon>
  );
};

export default IconWrapper;
