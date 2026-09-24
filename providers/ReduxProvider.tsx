"use client";

import { ReactNode, useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { clearAuthTokenCookies, setAuthTokenCookie } from "@/lib/authCookies";
import { isTokenExpired, normalizeToken } from "@/lib/authToken";
import { persistor, store } from "@/store";
import type { AppDispatch, RootState } from "@/store";
import { clearAuth } from "@/store/slices/auth/authSlice";
import { clearTokens, setAccessToken } from "@/store/slices/auth/tokenSlice";

function AuthTokenSync() {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.tokens);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!accessToken) {
      clearAuthTokenCookies();

      if (isAuthenticated) {
        dispatch(clearAuth());
      }

      return;
    }

    const normalizedToken = normalizeToken(accessToken);

    if (isTokenExpired(normalizedToken)) {
      dispatch(clearTokens());

      if (isAuthenticated) {
        dispatch(clearAuth());
      }

      clearAuthTokenCookies();
      return;
    }

    if (normalizedToken !== accessToken) {
      dispatch(setAccessToken(normalizedToken));
    }

    setAuthTokenCookie(normalizedToken);
  }, [accessToken, dispatch, isAuthenticated]);

  return null;
}

export function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthTokenSync />
        {children}
      </PersistGate>
    </Provider>
  );
}
