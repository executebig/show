import { CookiesProvider } from "react-cookie";

import "../styles/globals.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4772FF",
      dark: "#22223B",
      contrastText: "#fff",
    },
  },
});

function Show({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default Show;
