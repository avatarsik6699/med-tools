import { ActionIcon } from "@mantine/core";
import { type FC } from "react";
import { LuLogIn, LuLogOut } from "react-icons/lu";

const isLogin = true;

const LoginButton: FC = () => {
  return (
    <ActionIcon color="dark.5" variant="subtle">
      {isLogin ? <LuLogOut size={18} /> : <LuLogIn size={18} />}
    </ActionIcon>
  );
};

export default LoginButton;
