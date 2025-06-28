import { type FC } from "react";
import type { IconBaseProps } from "react-icons/lib";
import { LuChevronDown } from "react-icons/lu";

type Props = Pick<IconBaseProps, "size"> & {
  isRotate: boolean;
};

const Chevrone: FC<Props> = ({ isRotate, ...props }) => {
  return (
    <LuChevronDown
      {...props}
      style={{
        transform: isRotate ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.3s ease",
      }}
    />
  );
};

export default Chevrone;
