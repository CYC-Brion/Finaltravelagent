const buildKey = (tripId: string) => `ai_session_${tripId}`;

export function getTripAiSessionId(tripId?: string): string | undefined {
  if (!tripId || typeof window === "undefined") {
    return undefined;
  }

  return window.localStorage.getItem(buildKey(tripId)) || undefined;
}

export function setTripAiSessionId(tripId: string | undefined, sessionId: string): void {
  if (!tripId || !sessionId || typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(buildKey(tripId), sessionId);
}

export function clearTripAiSessionId(tripId?: string): void {
  if (!tripId || typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(buildKey(tripId));
}
