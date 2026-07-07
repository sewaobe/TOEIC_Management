import axios from "axios";
import { io, Socket } from "socket.io-client";
import { triggerLogout } from "./axiosClient";

type SessionRecoveryResult = "RECOVERED" | "SESSION_INVALID" | "TRANSIENT_FAILURE";

let socket: Socket | null = null;
let manualDisconnect = false;
let authRecoveryPromise: Promise<void> | null = null;

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosRefresh = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const resolveSocketUrl = () => {
  const explicitSocketUrl = import.meta.env.VITE_SOCKET_URL?.trim();
  if (explicitSocketUrl) return explicitSocketUrl;

  try {
    const url = new URL(API_BASE_URL);
    url.pathname = url.pathname.replace(/\/api\/?$/, "");
    return url.toString().replace(/\/$/, "");
  } catch {
    return API_BASE_URL.replace(/\/api\/?$/, "");
  }
};

function isAuthRequiredSocketError(err: Error & { data?: { errorType?: string } }) {
  return err.message === "AUTH_REQUIRED" || err.data?.errorType === "AUTH_REQUIRED";
}

function isSessionInvalidRefreshError(err: unknown) {
  const status = (err as { response?: { status?: number } })?.response?.status;
  return status === 401 || status === 403;
}

async function recoverSession(): Promise<SessionRecoveryResult> {
  try {
    await axiosRefresh.get("/auth/refresh-token");
    return "RECOVERED";
  } catch (err) {
    if (isSessionInvalidRefreshError(err)) {
      triggerLogout();
      return "SESSION_INVALID";
    }

    console.warn("Socket session refresh failed transiently:", err);
    return "TRANSIENT_FAILURE";
  }
}

function recoverSocketAuth() {
  if (!authRecoveryPromise) {
    authRecoveryPromise = recoverSession()
      .then((result) => {
        if (result === "RECOVERED" && socket && !manualDisconnect) {
          socket.connect();
          return;
        }

        if (result === "SESSION_INVALID") {
          manualDisconnect = true;
          socket?.disconnect();
          socket = null;
        }
      })
      .finally(() => {
        authRecoveryPromise = null;
      });
  }

  return authRecoveryPromise;
}

export const initSocket = () => {
  if (socket) {
    if (!socket.connected && !manualDisconnect) {
      socket.connect();
    }
    return socket;
  }

  manualDisconnect = false;
  socket = io(resolveSocketUrl(), {
    withCredentials: true,
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    const error = err as Error & { data?: { errorType?: string } };
    if (isAuthRequiredSocketError(error)) {
      void recoverSocketAuth();
      return;
    }

    console.error("Socket connect error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    manualDisconnect = true;
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected manually");
  }
};

export const getSocket = () => socket;
