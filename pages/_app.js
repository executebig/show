import { CookiesProvider } from "react-cookie";

import "../styles/globals.css";

function Show({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

export default Show;
