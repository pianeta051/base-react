import { Container } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { TopBar } from "../TopBar/TopBar";
import { Wrapper } from "./UsersLayout.style";

export const UsersLayout: FC = () => (
  <Container>
    <TopBar />
    <Wrapper>
      <Outlet />
    </Wrapper>
  </Container>
);
