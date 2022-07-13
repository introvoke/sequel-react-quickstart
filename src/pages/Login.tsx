import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Card,
  CardActions,
  CardContent,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useIsLoggedIn, useLogin } from "../providers/AuthProvider";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useIsLoggedIn();
  const from = (location.state as any)?.from?.pathname || "/events";
  const [form, setForm] = useState({
    clientId: "",
    clientSecret: "",
  });
  const { mutate, isLoading, isError } = useLogin();

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mutate(form);
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const disableSubmit = isLoading || !form.clientId || !form.clientSecret;

  if (isLoggedIn) return null;

  return (
    <Box
      display="flex"
      flex="1"
      justifyContent="center"
      alignItems="flex-start"
    >
      <Card sx={{ width: "100%", maxWidth: 600 }}>
        <CardContent>
          <Typography gutterBottom variant="h4">
            Sequel Quickstart App
          </Typography>
          <Typography mb={1}>
            Enter your Sequel API credentials below to login to the example
            application and see your events. You can obtain your Client ID and
            Client Secret from the Sequel Admin Dashboard.
          </Typography>
          <Typography mb={1}>
            Not currently signed up for Sequel?{" "}
            <Link
              href="https://www.sequel.io/solutions/developers"
              target="_blank"
              rel="noopener"
            >
              Create an account today!
            </Link>
          </Typography>
          <TextField
            autoFocus
            id="clientId"
            label="Client ID"
            type="text"
            fullWidth
            variant="standard"
            required
            value={form.clientId}
            onChange={({ target: { value } }) =>
              setForm((f) => ({ ...f, clientId: value }))
            }
          />
          <TextField
            id="clientSecret"
            label="Client Secret"
            type="text"
            fullWidth
            variant="standard"
            sx={{ mt: 1 }}
            value={form.clientSecret}
            required
            onChange={({ target: { value } }) =>
              setForm((f) => ({ ...f, clientSecret: value }))
            }
          />
          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Failed to login, please ensure your Client ID and Client Secret
              are correctly entered and try again.
            </Alert>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <LoadingButton
            onClick={handleSubmit}
            loading={isLoading}
            disabled={disableSubmit}
          >
            Login
          </LoadingButton>
        </CardActions>
      </Card>
    </Box>
  );
}
