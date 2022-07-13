import {
  Alert,
  Button,
  Paper,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";

import { useEvent, useEventEmbedCode } from "../providers/CompanyProvider";

const EmbedIframe = styled("iframe")(({ theme }) => ({
  flexGrow: 1,
  border: "none",
  margin: 0,
  padding: 0,
  borderRadius: theme.shape.borderRadius,
}));

export function Event() {
  const { eventId } = useParams();
  const {
    data: embedCode,
    isLoading: isLoadingCode,
    isError: isCodeError,
    refetch: refetchCode,
  } = useEventEmbedCode(eventId as string);

  const {
    data: event,
    isLoading: isLoadingEvent,
    refetch: refetchEvent,
  } = useEvent(eventId as string);

  return (
    <Stack sx={{ flex: 1, width: "100%" }} spacing={1}>
      {isLoadingEvent && (
        <Skeleton variant="text" sx={{ mb: 2 }}>
          <Typography variant="h4">Event Name Placeholder</Typography>
        </Skeleton>
      )}
      {event && (
        <Typography variant="h4" mb={2}>
          {event?.name ?? "Event Name Unavailable"}
        </Typography>
      )}
      {isCodeError && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                refetchCode();
                refetchEvent();
              }}
            >
              RETRY
            </Button>
          }
        >
          There was a problem loading the event, please try again
        </Alert>
      )}
      {isLoadingCode && (
        <Skeleton
          variant="rectangular"
          sx={{ flex: 1, minHeight: 500, maxHeight: 800 }}
        />
      )}
      {!!embedCode && (
        <Paper
          sx={{ display: "flex", flex: 1, minHeight: 500, maxHeight: 800 }}
        >
          <EmbedIframe
            title={event?.name ?? "Event"}
            src={embedCode}
            allow="camera *; microphone *; autoplay; display-capture *"
            allowFullScreen
          />
        </Paper>
      )}
    </Stack>
  );
}
