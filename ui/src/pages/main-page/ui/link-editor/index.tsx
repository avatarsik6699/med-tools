import { Drawer, type DrawerProps } from "@mantine/core";
import type { FC } from "react";
import EditorForm from "./ui/editor-form";

type Props = Pick<DrawerProps, "opened" | "onClose"> & {};

const LinkEditor: FC<Props> = (props) => {
  return (
    <Drawer
      {...props}
      title="Редактирование ссылки"
      offset={8}
      radius="md"
      position="right"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
      <EditorForm />
    </Drawer>
  );
};

export default LinkEditor;
