// Sir Xolo Academy - Learner Progress Manager (Save & Resume)
import { getLearnerIdentity } from "./analytics";

export interface StepProgress {
  subjectId: string;
  stepId: string;
  activityIndex: number;
  totalActivities: number;
  isMastered: boolean;
  quizScore: number | null;
  storyPage: number;
  lastUpdated: string;
}

export type LearnerProgressMap = Record<string, StepProgress>;

function getStorageKey(studentName?: string): string {
  const activeName = (studentName || getLearnerIdentity().studentName || "guest")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
  return `xolo_progress_${activeName || "guest"}`;
}

// Retrieve all saved progress for a learner
export function getLearnerProgress(studentName?: string): LearnerProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const key = getStorageKey(studentName);
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (err) {
    console.warn("Could not load learner progress:", err);
    return {};
  }
}

// Retrieve progress for a specific step
export function getStepProgress(
  subjectId: string,
  stepId: string,
  studentName?: string
): StepProgress | null {
  const all = getLearnerProgress(studentName);
  return all[stepId] || null;
}

// Save progress automatically as child plays
export function saveStepProgress(
  update: Partial<StepProgress> & { subjectId: string; stepId: string },
  studentName?: string
): StepProgress {
  if (typeof window === "undefined") {
    return {
      subjectId: update.subjectId,
      stepId: update.stepId,
      activityIndex: update.activityIndex || 0,
      totalActivities: update.totalActivities || 1,
      isMastered: Boolean(update.isMastered),
      quizScore: update.quizScore !== undefined ? update.quizScore : null,
      storyPage: update.storyPage || 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  try {
    const key = getStorageKey(studentName);
    const all = getLearnerProgress(studentName);
    const existing = all[update.stepId] || {
      subjectId: update.subjectId,
      stepId: update.stepId,
      activityIndex: 0,
      totalActivities: update.totalActivities || 1,
      isMastered: false,
      quizScore: null,
      storyPage: 0,
      lastUpdated: new Date().toISOString(),
    };

    const merged: StepProgress = {
      ...existing,
      ...update,
      lastUpdated: new Date().toISOString(),
    };

    all[update.stepId] = merged;
    localStorage.setItem(key, JSON.stringify(all));

    return merged;
  } catch (err) {
    console.warn("Could not save progress:", err);
    return {
      subjectId: update.subjectId,
      stepId: update.stepId,
      activityIndex: update.activityIndex || 0,
      totalActivities: update.totalActivities || 1,
      isMastered: Boolean(update.isMastered),
      quizScore: null,
      storyPage: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Reset progress for a step if child wants to replay fresh
export function resetStepProgress(stepId: string, studentName?: string) {
  if (typeof window === "undefined") return;
  try {
    const key = getStorageKey(studentName);
    const all = getLearnerProgress(studentName);
    delete all[stepId];
    localStorage.setItem(key, JSON.stringify(all));
  } catch (err) {
    console.warn("Could not reset progress:", err);
  }
}
