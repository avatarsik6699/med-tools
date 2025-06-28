import { Button, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo, useState, type FC } from "react";
import { BsSortAlphaDown, BsSortAlphaDownAlt } from "react-icons/bs";
import { LuArrowDownUp, LuChevronDown } from "react-icons/lu";
import cn from "./styles.module.css";
import { BsSortDown } from "react-icons/bs";

const Sorting: FC = () => {
  const [isMenuOpen, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState(0);

  const TargetSorting = useMemo(() => {
    if (selectedItem === 1) {
      return {
        Icon: <BsSortAlphaDownAlt size={18} />,
        value: "A-Z",
      };
    }
    if (selectedItem === 2) {
      return {
        Icon: <BsSortAlphaDownAlt size={18} />,
        value: "Z-A",
      };
    }
    if (selectedItem === 3) {
      return {
        Icon: <BsSortDown size={18} />,
        value: "по кликам",
      };
    }
    if (selectedItem === 4) {
      return {
        Icon: <BsSortDown size={18} />,
        value: "по дате создания",
      };
    }

    return {
      Icon: <LuArrowDownUp size={18} />,
      value: null,
    };
  }, [selectedItem]);

  return (
    <Menu
      keepMounted
      position="bottom"
      withArrow
      onOpen={open}
      onClose={close}
      withinPortal={false}
      closeOnClickOutside={false}
      classNames={{ item: cn.item }}
      transitionProps={{ transition: "rotate-right", duration: 150 }}>
      <Menu.Target>
        <Button
          fullWidth
          justify="flex-start"
          classNames={{
            section: cn.section,
          }}
          size="xs"
          leftSection={TargetSorting.Icon}
          variant="subtle"
          color="dark.4"
          rightSection={
            <LuChevronDown
              size={16}
              style={{
                transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                marginLeft: "auto",
                flexGrow: 1,
              }}
            />
          }>
          <Text fz="xs" truncate>Сортировка{TargetSorting.value != null ? `: ${TargetSorting.value}` : ""}</Text>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          onClick={() => setSelectedItem(1)}
          data-active={selectedItem == 1}
          color="dark.4"
          leftSection={<BsSortAlphaDown size={18} />}>
          A-Z
        </Menu.Item>
        <Menu.Item
          onClick={() => setSelectedItem(2)}
          data-active={selectedItem == 2}
          color="dark.4"
          leftSection={<BsSortAlphaDownAlt size={18} />}>
          Z-A
        </Menu.Item>
        <Menu.Item
          onClick={() => setSelectedItem(3)}
          data-active={selectedItem == 3}
          color="dark.4"
          leftSection={<BsSortDown size={18} />}>
          По кликам
        </Menu.Item>
        <Menu.Item
          onClick={() => setSelectedItem(4)}
          data-active={selectedItem == 4}
          color="dark.4"
          leftSection={<BsSortDown size={18} />}>
          По дате создания
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default Sorting;
