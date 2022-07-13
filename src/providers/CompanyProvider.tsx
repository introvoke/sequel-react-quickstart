import { useQuery } from "react-query";
import axios from "axios";

import { API_BASE_URL } from "../utils/api";
import { useAccessToken, useCompanyId, useUserId } from "./AuthProvider";

export interface Company {
  uid: string;
  name: string;
  logo: string | null;
  parentCompanyId: string | null;
  eventIds: string[];
}

export interface Event {
  uid: string;
  companyUid: string;
  creatorUid: string;
  name: string;
  picture: string | null;
  startDate: Date;
  endDate: Date;
  timezone: string;
}

function useRequestHeaders() {
  const accessToken = useAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * Returns the current company from the Sequel API.
 *
 * Please see: https://docs.introvoke.com/reference/getcompanybyid
 */
export function useCompany() {
  const companyId = useCompanyId();
  const headers = useRequestHeaders();
  return useQuery<Company>(
    ["Company", companyId],
    async () => {
      const result = await axios.get<Company>(
        `${API_BASE_URL}/v1/company/${companyId}`,
        {
          headers,
        }
      );
      if (!result.data?.uid) {
        throw new Error("Invalid response");
      }
      return result.data;
    },
    {
      enabled: !!companyId,
    }
  );
}

/**
 * Returns the events for the current company from the Sequel API.
 *
 * Please see: https://docs.introvoke.com/reference/listcompanyevents
 */
export function useEvents() {
  const companyId = useCompanyId();
  const headers = useRequestHeaders();
  return useQuery<Event[]>(
    ["Events", companyId],
    async () => {
      const result = await axios.get<Event[]>(
        `${API_BASE_URL}/v1/company/${companyId}/events`,
        {
          headers,
        }
      );
      if (!Array.isArray(result.data)) {
        throw new Error("Invalid response");
      }
      return result.data;
    },
    {
      enabled: !!companyId,
    }
  );
}

/**
 * Returns the event information for the given `eventId` from the Sequel API.
 *
 * Please see: https://docs.introvoke.com/reference/geteventbyid
 */
export function useEvent(eventId: string) {
  const headers = useRequestHeaders();
  return useQuery<Event>(
    ["Event", eventId],
    async () => {
      const result = await axios.get<Event>(
        `${API_BASE_URL}/v1/event/${eventId}`,
        {
          headers,
        }
      );
      if (!result.data?.uid) {
        throw new Error("Invalid response");
      }
      return result.data;
    },
    {
      enabled: !!eventId,
    }
  );
}

/**
 * Returns the event embed code for the given `eventId` from the Sequel API.
 *
 * Please see: https://docs.introvoke.com/reference/getembedeventbyid
 */
export function useEventEmbedCode(eventId: string) {
  const headers = useRequestHeaders();
  const userId = useUserId();
  return useQuery<string>(
    ["EmbeddedEvent", eventId],
    async () => {
      const result = await axios.post<string>(
        `${API_BASE_URL}/v1/event/${eventId}/embedCode`,
        // Here you would supply the correct values for your user when generating the embed code
        {
          userId,
          userDisplayName: "Quickstart User",
          userEmail: "sequel-quickstart-user@sequel.io",
          userAvatar:
            "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=Quickstart+User",
        },
        {
          headers,
        }
      );
      if (!result.data) {
        throw new Error("Invalid response");
      }
      return result.data;
    },
    {
      enabled: !!eventId,
      refetchOnWindowFocus: false,
    }
  );
}
