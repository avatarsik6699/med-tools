import { Button, rem } from "@mantine/core";
import type { FC } from "react";
import { IoIosAdd } from "react-icons/io";

const CreateLinkButton: FC = () => {
  return (
    <Button
      styles={{ section: { margin: rem(2) } }}
      leftSection={<IoIosAdd size={18} />}
      variant="subtle"
      color="cyan.5">
      Добавить ссылку
    </Button>
  );
};

export default CreateLinkButton;
