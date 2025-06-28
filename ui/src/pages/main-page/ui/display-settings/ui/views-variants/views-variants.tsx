import { Center, SegmentedControl, Stack, Text } from "@mantine/core";
import React, { type FC } from "react";
import { GoRows } from "react-icons/go";
import { LuRows3 } from "react-icons/lu";
import cn from "./styles.module.css";
import { LuServer } from "react-icons/lu";

const ViewsVariants: FC = () => {
  return (
    <SegmentedControl
      defaultValue="cards"
      transitionDuration={0}
      withItemsBorders
      fullWidth
      classNames={{
        control: cn.item,
        root: cn.root,
        indicator: cn.indicator,
      }}
      data={[
        {
          value: "cards",
          label: (
            <Stack py={6} gap={4} justify="center" align="center" c="dark.4">
              <LuServer size={28} />
              <Text size="xs">Cards</Text>
            </Stack>
          ),
        },
        {
          value: "rows",
          label: (
            <Stack py={6} gap={4} justify="center" align="center" c="dark.4">
            <LuRows3 size={28} />
            <Text size="xs">Rows</Text>
          </Stack>
          ),
        },
      ]}
    />
  );
};

export default ViewsVariants;
