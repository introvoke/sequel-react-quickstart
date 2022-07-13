import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { v4 } from "uuid";

import { API_BASE_URL } from "../utils/api";

interface GetAccessTokenResponse {
  access_token: string;
  expires: number;
}

const AUTH_COOKIE_KEY = "sequel-example-access-token";

interface Auth {
  userId: string;
  accessToken: string;
  companyId: string;
}

const AuthContext = createContext<
  Auth & {
    setAuth: (auth: Auth) => void;
  }
>({
  userId: "",
  accessToken: "",
  companyId: "",
  setAuth: (auth: Auth) => undefined,
});

function getCookieData(): {
  userId: string;
  accessToken: string;
  companyId: string;
} | null {
  const cookie = Cookies.get(AUTH_COOKIE_KEY);
  if (!cookie) return null;
  try {
    return JSON.parse(cookie);
  } catch (e) {
    // ignore
  }
  return null;
}

/**
 * Provides authentication state to the application.
 *
 * Internally saves the `accessToken` which is used to access the Sequel API,
 * and provides the token to the consumers of the `AuthProvider` context.
 */
export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState(
    getCookieData() ?? {
      accessToken: "",
      companyId: "",
      userId: v4(),
    }
  );

  return (
    <AuthContext.Provider
      value={{
        ...auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Error hook must be wrapped by `AuthProvider`");
  return context;
}

/**
 * Returns the current access token used for accessing the Sequel API
 */
export function useAccessToken() {
  const { accessToken } = useAuthContext();
  return accessToken;
}

/**
 * Returns the current ID of the company (client ID)
 */
export function useCompanyId() {
  const { companyId } = useAuthContext();
  return companyId;
}

/**
 * Returns the current ID of the user
 */
export function useUserId() {
  const { userId } = useAuthContext();
  return userId;
}

/**
 * Returns `true` if currently logged in and able to access the Sequel API
 */
export function useIsLoggedIn() {
  const token = useAccessToken();
  return !!token;
}

/**
 * Hook used for logging in to the application.
 *
 * Internally calls the `/oauth/token` route on the Sequel API to
 * generate an access token from the provided credentials.
 *
 * For more information see: https://docs.introvoke.com/docs/getting-started
 */
export function useLogin() {
  const { setAuth, userId } = useAuthContext();
  return useMutation(
    ["GetAccessToken"],
    async ({
      clientId,
      clientSecret,
    }: {
      clientId: string;
      clientSecret: string;
    }) => {
      const result = await axios.post<GetAccessTokenResponse>(
        `${API_BASE_URL}/oauth/token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          audience: "https://www.introvoke.com/api",
          grant_type: "client_credentials",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!result.data?.access_token) {
        throw new Error("Access token missing in response!");
      }

      return result.data?.access_token;
    },
    {
      onSuccess: (data: string, variables) => {
        setAuth({
          accessToken: data,
          companyId: variables.clientId,
          userId,
        });
        // Set the cookie for auth
        Cookies.set(
          AUTH_COOKIE_KEY,
          JSON.stringify({
            userId,
            accessToken: data,
            companyId: variables.clientId,
          }),
          {
            sameSite: "strict",
            secure: true,
            expires: 1,
          }
        );
      },
      onError: () => {
        setAuth({
          accessToken: "",
          companyId: "",
          userId,
        });
        Cookies.remove(AUTH_COOKIE_KEY);
      },
    }
  );
}

/**
 * Returns a function that can be used to logout of the current session
 */
export function useLogout() {
  const { setAuth, userId } = useAuthContext();
  const queryClient = useQueryClient();
  return useCallback(() => {
    setAuth({
      accessToken: "",
      companyId: "",
      userId,
    });
    queryClient.invalidateQueries();
    Cookies.remove(AUTH_COOKIE_KEY);
  }, [setAuth, userId, queryClient]);
}
