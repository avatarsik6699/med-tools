import { Box, Button, Combobox, Flex, Group, Kbd, rem, Text, useCombobox } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useMemo, type FC } from "react";
import { LuChevronRight, LuListFilter, LuSearch } from "react-icons/lu";
import { useSearchState } from "../../../../shared/hooks/use-search-state";
import { useAnimation } from "../../../../shared/hooks/useAnimation";
import { useStack } from "../../../../shared/hooks/useSack";
import Chevrone from "../../../../shared/ui/enhanced-icons/chevron";
import { useKeyboard } from "./model/useKeyboard";
import { useSearchParams } from "./model/useSearchParams";
import cn from "./styles.module.css";
import type { FiltersTypes } from "./types";

declare module "@mantine/core" {
  interface ComboboxOptionProps {
    metadata: {
      label: string;
      id: string;
      children?: FiltersTypes.Filter[];
    };
  }
}
/*
  Реализация многостраничных фильтров.
  - Изначально есть базовый список разделов фильтрации (по автору, по тегам, по статусам)
  - Стек страниц пуст. Рендерим первоначальный список пришедший через пропсы.
  - Каждая страница самостоятельно реализует свой ui.
  - По контракту страница принимает

    -> Кликаю на какой-либо раздел
      -> В стек страниц добавляется новая страница.
      -> В строке поиска появляется префикс соотв. стеку страниц.

    -> Возврат назад
      -> клик backspace - делаем pop последней страницы.
      -> кликаем на хлебную крошку в поиске - pop до этой страницы.

    -> Выбираю какой-либо фильтр
      -> Выбранный фильтр добавляется к текущим выбранным фильтрам по данном странице


*/

type Props = {
  items: FiltersTypes.Filter[];
};

const Filters: FC<Props> = (props) => {
  const pages = useStack<FiltersTypes.Page>();
  const scaleAnimation = useAnimation();
  const search = useSearchState();
  const sp = useSearchParams();

  const combobox = useCombobox({
    loop: true,
    onDropdownClose: () => {
      combobox.focusTarget();
      pages.reset();
      search.reset();
    },

    onDropdownOpen: () => {
      combobox.focusSearchInput();
    },
  });

  const { ref, width, height } = useElementSize();

  const keyboard = useKeyboard({
    onBackspace: (e) => {
      console.log(pages.items, pages.isInitialPage, !search.isEmpty);
      if (pages.isInitialPage || !search.isEmpty) {
        return;
      }
      e.preventDefault();

      scaleAnimation.start();
      pages.pop();
    },
  });
  console.log(sp.state);
  const JSXOptions = useMemo(() => {
    const items = pages.isInitialPage ? props.items : pages.last().children;

    return items
      .filter((item) => item.label.toLowerCase().includes(search.value))
      .map((item) => {
        let isSelected = false;
        let selectedCount = 0;
        console.log(sp);
        if (pages.isInitialPage) {
          if (item.id in sp.state) {
            if (item.children) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              selectedCount = (sp.state[item.id as keyof FiltersTypes.State] as string[]).length;
            } else {
              isSelected = true;
            }
          }
        } else {
          const parent = pages.last();
          console.log(sp.state, item.value);
          if (parent.id in sp.state) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            isSelected = (sp.state[parent.id as keyof FiltersTypes.State] as string[]).includes(item.value);
          }
        }

        return (
          <Combobox.Option
            metadata={{ label: item.label, children: item.children, id: item.id }}
            selected={isSelected}
            value={item.value}
            key={item.id}>
            <Group align="center" justify="space-between">
              {item.label}
              <Group>
                {selectedCount}
                {item.children && <LuChevronRight size={16} />}
              </Group>
            </Group>
          </Combobox.Option>
        );
      });
  }, [pages, props.items, search.value, sp]);

  return (
    <Combobox
      width="auto"
      withArrow
      transitionProps={{ transition: "scale" }}
      store={combobox}
      onOptionSubmit={(value, { metadata }) => {
        const { children, label, id } = metadata;
        console.log(value);
        if (children) {
          pages.append({ children, label, id });
        } else {
          if (!pages.isInitialPage) {
            // TODO: пока что эта логика подходит только для 1 уровня вложенности.
            sp.set(pages.last().id, value);
          } else {
            sp.set(id, Boolean(value));
          }
          // Если попал на простой фильтр
          // То добавляю его в {[key]: [value]}

          // Если попал на вложенный фильтр (как проверить?)
          // Если !pages.isInitialPage
          // Тгда {[parent]: [value]}

          // TODO: append to URL
          // setSelectedItem(value);
          // combobox.closeDropdown();
        }
      }}>
      <Combobox.Target>
        <Button
          rightSection={<Chevrone size={18} isRotate={combobox.dropdownOpened} />}
          color="dark.5"
          leftSection={<LuListFilter size={18} />}
          variant="subtle"
          onClick={() => combobox.toggleDropdown()}>
          Filters
        </Button>
      </Combobox.Target>

      <Combobox.Dropdown
        className={scaleAnimation.isRunning ? "scale" : ""}
        w={width === 0 ? "auto" : rem(width + 8)}
        h={height === 0 ? "auto" : rem(height + 8)}
        classNames={{ dropdown: cn.dropdown }}
        styles={{
          dropdown: {
            overflow: "hidden",
          },
        }}>
        <Box w="max-content" ref={ref}>
          <Combobox.Search
            pr="xs"
            rightSectionWidth={rem(60)}
            leftSectionWidth={pages.isInitialPage ? rem(35) : rem(90)}
            rightSection={!pages.isInitialPage && <Kbd size="xs">Backspace</Kbd>}
            leftSection={
              <Group w="100%" wrap="nowrap" gap={4}>
                <LuSearch size={18} />

                {!pages.isInitialPage && (
                  <>
                    <Text w="content" maw="80%" truncate component="span" c="dark.4" size="sm">
                      {pages.last().label}
                    </Text>
                    <Text component="span" c="dark.4" size="sm">
                      /
                    </Text>
                  </>
                )}
              </Group>
            }
            value={search.value}
            onChange={(e) => search.set(e.currentTarget.value)}
            placeholder={pages.isInitialPage ? "Что ищем?" : `${pages.last().label}...`}
            onKeyDown={keyboard}
          />
          <Combobox.Options
            styles={{
              options: {
                flexDirection: "column",
                gap: rem(4),
              },
            }}
            component={Flex}>
            {JSXOptions.length > 0 && JSXOptions}
            {JSXOptions.length === 0 && <Combobox.Empty>Nothing found</Combobox.Empty>}
          </Combobox.Options>
        </Box>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default Filters;
export type { Props as FiltersProps };
