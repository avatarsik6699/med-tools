import RouterLink from "@/shared/ui/router-link";
import { AppShell, Divider, Group, ScrollArea } from "@mantine/core";
import { type FC } from "react";
import { TbTransform } from "react-icons/tb";
import cn from "./styles.module.css";
import SearchByTools from "./ui/search-by-tools";

const NavBar: FC = () => {
  return (
    <AppShell.Navbar p="md">
      <AppShell.Section mb="xs">
        <SearchByTools />
      </AppShell.Section>
      <AppShell.Section grow component={ScrollArea}>
        <Group>
          <RouterLink className={cn.navbar_link} to="/">
            <TbTransform size={16} /> Конвертер
          </RouterLink>
        </Group>
      </AppShell.Section>
      <AppShell.Section>
        <Divider />
      </AppShell.Section>
    </AppShell.Navbar>
  );
};

export default NavBar;
