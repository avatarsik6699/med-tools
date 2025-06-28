import { Button, Group, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type FC } from "react";
import { LuChevronDown } from "react-icons/lu";
import { RiListSettingsLine } from "react-icons/ri";
import cn from "./styles.module.css";
import Properties from "./ui/properties";
import Sorting from "./ui/sorting/sorting";
import ViewsVariants from "./ui/views-variants/views-variants";

const DisplaySettings: FC = () => {
  const [isMenuOpen, { open, close }] = useDisclosure(false);

  return (
    <Menu
      classNames={{
        dropdown: cn.dropdown,
        item: cn.menu_item,
      }}
      keepMounted
      withArrow
      closeOnItemClick={false}
      onOpen={open}
      onClose={close}
      transitionProps={{ transition: "rotate-right", duration: 150 }}>
      <Menu.Target>
        <Button
          variant="subtle"
          color="dark.4"
          rightSection={
            <LuChevronDown
              size={16}
              style={{
                transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          }
          leftSection={<RiListSettingsLine size={18} />}>
          Вид
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item w="100%" component="section">
          <ViewsVariants />
        </Menu.Item>

        <Menu.Divider />

        <Sorting />

        <Menu.Divider />

        <Menu.Item component="section">
          <Properties />
        </Menu.Item>

        <Menu.Divider />

        <Group justify="flex-end" gap={4}>
          <Button variant="subtle" color="dark.4" size="xs">
            Сбросить
          </Button>
          <Button variant="filled" color="dark.4" size="xs">
            Применить
          </Button>
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
};

export default DisplaySettings;
