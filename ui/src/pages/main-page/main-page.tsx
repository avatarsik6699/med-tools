import { Container, Divider, Grid, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { FC } from "react";
import CreateLinkButton from "./ui/create-link-button";
import DisplaySettings from "./ui/display-settings/display-settings";
import Filters, { type FiltersProps } from "./ui/filters";
import LinkCard from "./ui/link-card";
import LinkEditor from "./ui/link-editor";
import SearchBySlug from "./ui/search-by-slug";

const links = Array.from({ length: 10 }).map(() => {
  return {};
});

const filters: FiltersProps["items"] = [
  {
    id: "authors",
    value: "authors",
    label: "Авторы",
    children: [
      {
        id: "11",
        value: "john-doe",
        label: "John Doe",
      },
      {
        id: "12",
        value: "jane-smith",
        label: "Jane Smith",
      },
    ],
  },
  {
    id: "tags",
    value: "tags",
    label: "Теги",
    children: [
      {
        id: "21",
        value: "react",
        label: "React",
      },
      {
        id: "22",
        value: "typescript",
        label: "TypeScript",
      },
    ],
  },
  {
    id: "statuses",
    value: "statuses",
    label: "Статусы",
    children: [
      {
        id: "31",
        value: "active",
        label: "Активные",
      },
      {
        id: "32",
        value: "inactive",
        label: "Неактивные",
      },
    ],
  },
  {
    id: "4",
    value: "simple1",
    label: "Просто значение 1",
  },
  {
    id: "5",
    value: "simple2",
    label: "Просто значение 2",
  },
  {
    id: "6",
    value: "simple3",
    label: "Просто значение 1",
  },
];

const MainPage: FC = () => {
  const [isLinkEdtiorOpened, { open: onOpenLinkEditor, close: onCloseLinkEditor }] = useDisclosure(false);

  return (
    <>
      <Container size="xl">
        <Group justify="space-between">
          <Group>
            <DisplaySettings />
            <Divider
              color="dark.0"
              opacity={0.75}
              h={24}
              size={1}
              orientation="vertical"
              styles={{
                root: {
                  alignSelf: "center",
                },
              }}
            />
            <Filters items={filters} />
          </Group>
          <Group>
            <CreateLinkButton />
            <SearchBySlug />
          </Group>
        </Group>

        <Grid>
          {links.map(() => (
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <LinkCard onOpenLinkeEditor={onOpenLinkEditor} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      <LinkEditor opened={isLinkEdtiorOpened} onClose={onCloseLinkEditor} />
    </>
  );
};

export default MainPage;
