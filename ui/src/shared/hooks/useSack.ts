import { useListState } from "@mantine/hooks";

export const useStack = <Item>(initial: Item[] = []) => {
  const [items, handlers] = useListState<Item>(initial);

  return {
    items, ...handlers,
    isInitialPage: items.length === 0,
    last: () => {
      const lastItemIndex = items.length - 1;

      return items[lastItemIndex];
    },
    pop: () => {
      const lastItemIndex = items.length - 1;

      const last = items[lastItemIndex];

      handlers.remove(lastItemIndex);

      return last;
    },
    reset: () => {
      handlers.setState(initial);
    }
  };
};