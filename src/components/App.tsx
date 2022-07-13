import React from "react";
import { Container } from "@mui/material";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { Nav } from "./Nav";
import { Events } from "../pages/Events";
import { Event } from "../pages/Event";
import { Login } from "../pages/Login";
import { useIsLoggedIn } from "../providers/AuthProvider";

function RequireAuth({ children }: React.PropsWithChildren): JSX.Element {
  const isLoggedIn = useIsLoggedIn();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children as JSX.Element;
}

function App() {
  return (
    <React.Fragment>
      <Nav />
      <Container sx={{ py: 2, flex: 1, display: "flex" }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/events"
            element={
              <RequireAuth>
                <Events />
              </RequireAuth>
            }
          />
          <Route
            path="/events/:eventId"
            element={
              <RequireAuth>
                <Event />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </Container>
    </React.Fragment>
  );
}

export default App;
