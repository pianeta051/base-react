import { FC } from "react";
import { Outlet } from "react-router-dom";

export const UsersLayout: FC = () => (
  <p>
    <Outlet />
  </p>
);
