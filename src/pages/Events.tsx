import React, { useCallback, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { orderBy } from "lodash";
import { useNavigate } from "react-router-dom";

import { useEvents, Event } from "../providers/CompanyProvider";
import { formatDateTime } from "../utils/date";

interface EventCardProps extends Event {
  isLoading?: boolean;
}

function EventCard({ isLoading, ...event }: EventCardProps) {
  const navigate = useNavigate();
  const formattedStartDate = useMemo(
    () =>
      formatDateTime(
        event.startDate,
        event.timezone,
        "MMM. d yyyy, h:mm a (zzz)"
      ),
    [event.startDate, event.timezone]
  );

  const handleClick = useCallback(() => {
    navigate(`/events/${event.uid}`);
  }, [event.uid, navigate]);

  return (
    <Card>
      {!isLoading && (
        <CardActionArea onClick={handleClick}>
          {event.picture && (
            <CardMedia
              component="img"
              height="140"
              sx={{
                backgroundColor: "#eee",
              }}
              alt={event.name}
              image={event.picture}
            />
          )}
          {!event.picture && (
            <Box
              sx={{
                display: "flex",
                backgroundColor: "#eee",
                flexDirection: "column",
                height: 140,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageNotSupportedIcon fontSize="large" />
              <Typography mt={1} variant="caption">
                Picture Unavailable
              </Typography>
            </Box>
          )}
          <CardContent>
            <Typography noWrap title={event.name}>
              <strong>{event.name}</strong>
            </Typography>
            <Typography variant="body2">{formattedStartDate}</Typography>
          </CardContent>
        </CardActionArea>
      )}
      {isLoading && (
        <Stack sx={{ flex: 1 }}>
          <Skeleton variant="rectangular" sx={{ height: 140 }} />
          <Box p={1}>
            <Skeleton variant="text" sx={{ maxWidth: "75%" }} />
            <Skeleton variant="text" />
          </Box>
        </Stack>
      )}
    </Card>
  );
}

export function Events() {
  const { data: events, isLoading, isError, refetch } = useEvents();

  const sortedEvents = useMemo(() => {
    const now = Date.now();
    return orderBy(
      events?.filter((event) => {
        const { startDate } = event;
        if (!startDate) return false;
        const start = new Date(startDate);
        return start.getTime() > now;
      }),
      "startDate",
      "asc"
    );
  }, [events]);

  return (
    <Stack sx={{ width: "100%" }}>
      <Typography variant="h4">Upcoming Events</Typography>
      <Typography mt={1} mb={2}>
        Welcome! Below you will see all upcoming events:
      </Typography>
      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              RETRY
            </Button>
          }
        >
          There was a problem loading the events, please try again
        </Alert>
      )}
      {!isLoading && !sortedEvents?.length && !isError && (
        <Typography>
          Looks like there are no scheduled upcoming events, be sure to check
          back later!
        </Typography>
      )}
      {(isLoading || !!sortedEvents?.length) && (
        <Grid container spacing={2}>
          {isLoading && (
            <React.Fragment>
              <Grid item xs={3}>
                {/* @ts-ignore */}
                <EventCard isLoading />
              </Grid>
              <Grid item xs={3}>
                {/* @ts-ignore */}
                <EventCard isLoading />
              </Grid>
              <Grid item xs={3}>
                {/* @ts-ignore */}
                <EventCard isLoading />
              </Grid>
            </React.Fragment>
          )}
          {!isLoading &&
            sortedEvents?.map((event) => (
              <Grid item xs={6} sm={4} md={3} key={event.uid}>
                <EventCard {...event} />
              </Grid>
            ))}
        </Grid>
      )}
    </Stack>
  );
}
