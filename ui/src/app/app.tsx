import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@/shared/styles/animations.css";

import { AppShell, Burger, MantineProvider } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "@tanstack/react-router";
import type { FC } from "react";
import Header from "./components/header";
import NavBar from "./components/nav-bar/nav-bar";
import { overrideTheme } from "./theme";

const App: FC = () => {
	const [isMobileOpen, { toggle: toggleMobile }] = useDisclosure();
	const [isDesktopOpen, { toggle: toggleDesktop }] = useDisclosure(true);

	return (
		<MantineProvider theme={overrideTheme}>
			<AppShell
				padding="md"
				header={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "xs",
					collapsed: { mobile: !isMobileOpen, desktop: !isDesktopOpen },
				}}
			>
				<Header
					Burger={
						<>
							<Burger
								lineSize={1.5}
								opened={isMobileOpen}
								onClick={toggleMobile}
								hiddenFrom="xs"
								size="md"
							/>
							<Burger
								lineSize={1.5}
								opened={isDesktopOpen}
								onClick={toggleDesktop}
								visibleFrom="xs"
								size="md"
							/>
						</>
					}
				/>

				<NavBar
					onItemClick={() => {
						if (isMobileOpen) {
							toggleMobile();
						} else {
							toggleDesktop();
						}
					}}
				/>

				<AppShell.Main>
					<Outlet />
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
};

export default App;
