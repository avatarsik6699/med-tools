import { AppShell, Container, Divider, Grid, Group, Text } from "@mantine/core";
import { type FC } from "react";
import { FaEye } from "react-icons/fa";
import IconWrapper from "../../shared/ui/icon-wrapper";
import LoginButton from "./ui/login-button";

const Header: FC = () => {
  return (
    <AppShell.Header withBorder={false}>
      <Container pt="md" size="xl">
        <Grid mb="xs" justify="space-between">
          <Grid.Col span={8}>
            <Group gap={3}>
              <IconWrapper color="dark.4">
                <FaEye size={32} />
              </IconWrapper>
              <Text c="dark.4" component="h1" ff="heading" lts={-1} fw={900} fz="h4">
                EyeLink
              </Text>
            </Group>
          </Grid.Col>
          <Grid.Col styles={{ col: { display: "flex", justifyContent: "flex-end" } }} span={4}>
            <LoginButton />
          </Grid.Col>
        </Grid>

        <Divider opacity={0.4} color="dark.0" />
      </Container>
    </AppShell.Header>
  );
};

export default Header;
