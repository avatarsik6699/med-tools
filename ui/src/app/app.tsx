import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../shared/styles/animations.css";

import { AppShell, Burger, MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "@tanstack/react-router";
import type { FC } from "react";
import Header from "./header";
import NavBar from "./nav-bar";
import { overrideTheme } from "./theme";

const App: FC = () => {
  const [isMobile, { toggle: toggleMobile }] = useDisclosure();
  const [isDesktop, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <MantineProvider theme={overrideTheme}>
      <AppShell
        padding="md"
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !isMobile, desktop: !isDesktop },
        }}
      >
        <Header
          Burger={
            <>
              <Burger
                lineSize={0.5}
                opened={isMobile}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />
              <Burger
                lineSize={0.5}
                opened={isDesktop}
                onClick={toggleDesktop}
                visibleFrom="sm"
                size="sm"
              />
            </>
          }
        />

        <NavBar
          onItemClick={() => {
            if (isMobile) {
              toggleMobile();
            } else {
              toggleDesktop();
            }
          }}
        />

        <AppShell.Main>
          <Outlet />
          {/* <TanStackRouterDevtools /> */}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
