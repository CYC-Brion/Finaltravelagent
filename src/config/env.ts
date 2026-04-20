const readBoolean = (value: string | undefined, fallback: boolean) => {
  if (value == null) return fallback;
  return value === "true";
};

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:4000",
  assetBaseUrl: import.meta.env.VITE_ASSET_BASE_URL || "",
  useMockApi: readBoolean(import.meta.env.VITE_USE_MOCK_API, true),
  enableRealtime: readBoolean(import.meta.env.VITE_ENABLE_REALTIME, false),
};
