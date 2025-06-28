import { Avatar, Card, Divider, Group, noop, Stack, Text } from "@mantine/core";
import type { FC } from "react";
import { CiImageOff } from "react-icons/ci";
import { HiArrowTurnDownRight } from "react-icons/hi2";
import IconWrapper from "../../../../shared/ui/icon-wrapper";
import Link from "../../../../shared/ui/link/link";
import CopyToBuffer from "../copy-to-buffer";
import LinkActions from "../link-actions";
import LinkCreatorDetails from "../link-creator-details";
import LinkDatesDetails from "../link-dates-details";
import LinkDescription from "../link-description";

type Props = {
  onOpenLinkeEditor: () => void;
};

const LinkCard: FC<Props> = (props) => {
  return (
    <>
      <Card withBorder={false} shadow="md">
        <Group align="start" justify="space-between" mb="xs">
          <Group gap="xs" align="start">
            <Avatar>
              <CiImageOff size={20} />
            </Avatar>

            <Stack gap={0}>
              <Group gap={0}>
                <Link href="/" label="sink.cool/0" />
                <CopyToBuffer valueToCopy="sink.cool/0" />
              </Group>
              <Group gap={0}>
                <IconWrapper color="dark.1">
                  <HiArrowTurnDownRight size={14} />
                </IconWrapper>

                <Text c="dark.1" pt={2} fz="xs">
                  https://www.404s.design/
                </Text>
              </Group>
            </Stack>
          </Group>

          <LinkActions onRemove={noop} onEdit={props.onOpenLinkeEditor} />
        </Group>

        <LinkDescription>
          With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around
          the fjords of Norway
        </LinkDescription>

        <Group gap={5}>
          <Group align="start" gap={2}>
            <LinkDatesDetails createdAt="15.05.2024" updatedAt="15.05.2024" />
          </Group>

          <Divider
            color="dark.0"
            opacity={0.75}
            h={15}
            size={1}
            orientation="vertical"
            styles={{
              root: {
                alignSelf: "center",
              },
            }}
          />

          <LinkCreatorDetails>v.godlevskiy</LinkCreatorDetails>
        </Group>
      </Card>
    </>
  );
};

export default LinkCard;
