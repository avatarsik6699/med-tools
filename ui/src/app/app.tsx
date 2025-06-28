import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "../shared/styles/animations.css";

import { AppShell, MantineProvider, rem } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "./header/header";
import { overrideTheme } from "./theme";

const App = () => {
  return (
    <MantineProvider theme={overrideTheme}>
      <AppShell>
        <Header />

        <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-xl))`}>
          <Outlet />
          <TanStackRouterDevtools />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
