import { Popover, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { FC } from "react";
import { LuCalendarArrowUp } from "react-icons/lu";
import IconWrapper from "../../../shared/ui/icon-wrapper";

type Props = {
  createdAt: string;
  updatedAt: string;
};

const LinkDatesDetails: FC<Props> = (props) => {
  const [isOpen, { close, open }] = useDisclosure(false);

  return (
    <>
      <Popover width="fit-content" position="bottom" withArrow shadow="md" opened={isOpen}>
        <Popover.Target>
          <IconWrapper onMouseEnter={open} onMouseLeave={close} color="dark.1">
            <LuCalendarArrowUp size={14} />
          </IconWrapper>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }}>
          <Text c="dark.5" size="xs">
            created_at: {props.createdAt}
          </Text>
          <Text c="dark.5" size="xs">
            updated_at: {props.updatedAt}
          </Text>
        </Popover.Dropdown>
      </Popover>

      <Text c="dark.5" size="xs">
        {props.createdAt}
      </Text>
    </>
  );
};

export default LinkDatesDetails;
