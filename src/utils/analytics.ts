// Client-side Learning Telemetry Logger
export interface AnalyticsEvent {
  eventType:
    | "lesson_start"
    | "activity_attempt"
    | "quiz_attempt"
    | "quiz_completed"
    | "diagnostic_completed"
    | "story_read"
    | "free_trial_start";
  subject?: "english" | "mathematics" | "isizulu" | string;
  stepId?: string;
  targetId?: string;
  title?: string;
  isCorrect?: boolean;
  score?: number;
  chosenOption?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sid = sessionStorage.getItem("xolo_learner_session");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    sessionStorage.setItem("xolo_learner_session", sid);
  }
  return sid;
}

export function trackLearningEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...event,
    sessionId: getSessionId(),
    timestamp: event.timestamp || new Date().toISOString(),
  };

  // Use sendBeacon if available, otherwise fetch with keepalive
  try {
    const dataStr = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([dataStr], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataStr,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently so learner UX is never interrupted
  }
}
