import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "./styles.css";
import App from "./components/App";
import { AuthProvider } from "./providers/AuthProvider";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: "#571BEA",
    },
    secondary: {
      main: "#ba0091",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', Arial, Helvetica, sans-serif",
  },
});

function Providers({ children }: React.PropsWithChildren) {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);
