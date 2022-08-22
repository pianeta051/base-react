import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { theme } from "./theme/theme";

export const App: FC = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter></BrowserRouter>
  </ThemeProvider>
);
