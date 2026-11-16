import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const analyticsFilePath = path.join(dataDir, "learning_analytics.json");

export interface StoredEvent {
  id: string;
  eventType: string;
  subject?: string;
  stepId?: string;
  targetId?: string;
  title?: string;
  isCorrect?: boolean;
  score?: number;
  chosenOption?: string;
  studentName?: string;
  parentName?: string;
  details?: Record<string, unknown>;
  sessionId?: string;
  timestamp: string;
}

function ensureAnalyticsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(analyticsFilePath)) {
    // 100% Pure live data - initialized with an empty array
    fs.writeFileSync(analyticsFilePath, JSON.stringify([], null, 2), "utf-8");
  }
}

// POST: Record real-time learning event telemetry with Student & Parent identity
export async function POST(req: Request) {
  try {
    ensureAnalyticsFile();
    const body = await req.json();

    const newEvent: StoredEvent = {
      id: "ev_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      eventType: String(body.eventType || "unknown"),
      subject: body.subject ? String(body.subject).toLowerCase() : undefined,
      stepId: body.stepId ? String(body.stepId) : undefined,
      targetId: body.targetId ? String(body.targetId) : undefined,
      title: body.title ? String(body.title) : undefined,
      isCorrect: typeof body.isCorrect === "boolean" ? body.isCorrect : undefined,
      score: typeof body.score === "number" ? body.score : undefined,
      chosenOption: body.chosenOption ? String(body.chosenOption) : undefined,
      studentName: body.studentName ? String(body.studentName).trim() : "Guest Learner",
      parentName: body.parentName ? String(body.parentName).trim() : undefined,
      details: body.details && typeof body.details === "object" ? body.details : undefined,
      sessionId: body.sessionId ? String(body.sessionId) : undefined,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const raw = fs.readFileSync(analyticsFilePath, "utf-8");
    const events: StoredEvent[] = JSON.parse(raw);
    events.unshift(newEvent);

    // Keep last 3,000 real events
    if (events.length > 3000) {
      events.length = 3000;
    }

    fs.writeFileSync(analyticsFilePath, JSON.stringify(events, null, 2), "utf-8");

    return NextResponse.json({ success: true, eventId: newEvent.id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// GET: Aggregate and analyze pure live learning data, student friction & stuck points
export async function GET() {
  try {
    ensureAnalyticsFile();
    const raw = fs.readFileSync(analyticsFilePath, "utf-8");
    const events: StoredEvent[] = JSON.parse(raw);

    // 1. Overall KPIs
    const sessions = new Set<string>();
    const uniqueStudents = new Set<string>();
    let totalAttempts = 0;
    let correctAttempts = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;

    // 2. Subject counts
    const subjectCounts: Record<string, number> = {
      english: 0,
      mathematics: 0,
      isizulu: 0,
    };

    // 3. Daily activity (Last 7 days)
    const dailyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = 0;
    }

    // 4. Stuck Points Analysis with Student-Level Tracking
    interface StuckRecord {
      targetId: string;
      title: string;
      subject: string;
      stepId: string;
      totalAttempts: number;
      correctCount: number;
      failCount: number;
      accuracy: number;
      friction: "high" | "moderate" | "low";
      commonMistakes: Record<string, number>;
      strugglingStudents: string[];
      successfulStudents: string[];
      recommendation: string;
    }
    const stuckMap: Record<string, StuckRecord> = {};

    // 5. Diagnostic placements
    const diagnosticPlacements: Record<string, number> = {
      "Grade R": 0,
      "Grade 1": 0,
      "Grade 2": 0,
      "Grade 3": 0,
    };

    for (const ev of events) {
      if (ev.sessionId) sessions.add(ev.sessionId);
      if (ev.studentName && ev.studentName !== "Guest Learner") {
        uniqueStudents.add(ev.studentName);
      }

      // Subject tracking
      if (ev.subject && subjectCounts[ev.subject] !== undefined) {
        subjectCounts[ev.subject]++;
      }

      // Daily trend
      const dateKey = ev.timestamp?.split("T")[0];
      if (dateKey && dailyMap[dateKey] !== undefined) {
        dailyMap[dateKey]++;
      }

      // Quiz tracking
      if (ev.eventType === "quiz_completed") {
        totalQuizzes++;
        if (typeof ev.score === "number" && ev.score >= 80) {
          passedQuizzes++;
        }
      }

      // Activity / question accuracy
      if (typeof ev.isCorrect === "boolean") {
        totalAttempts++;
        if (ev.isCorrect) correctAttempts++;

        const targetKey = ev.targetId || ev.title || "general_task";
        if (!stuckMap[targetKey]) {
          stuckMap[targetKey] = {
            targetId: targetKey,
            title: ev.title || targetKey,
            subject: ev.subject || "general",
            stepId: ev.stepId || "",
            totalAttempts: 0,
            correctCount: 0,
            failCount: 0,
            accuracy: 100,
            friction: "low",
            commonMistakes: {},
            strugglingStudents: [],
            successfulStudents: [],
            recommendation: "",
          };
        }

        const item = stuckMap[targetKey];
        item.totalAttempts++;
        const studentLabel = ev.studentName
          ? ev.parentName
            ? `${ev.studentName} (Parent: ${ev.parentName})`
            : ev.studentName
          : "Learner";

        if (ev.isCorrect) {
          item.correctCount++;
          if (!item.successfulStudents.includes(studentLabel)) {
            item.successfulStudents.push(studentLabel);
          }
        } else {
          item.failCount++;
          if (ev.chosenOption) {
            item.commonMistakes[ev.chosenOption] = (item.commonMistakes[ev.chosenOption] || 0) + 1;
          }
          if (!item.strugglingStudents.includes(studentLabel)) {
            item.strugglingStudents.push(studentLabel);
          }
        }
      }

      // Diagnostic placements
      if (ev.eventType === "diagnostic_completed" && ev.details?.grade) {
        const gradeKey = String(ev.details.grade);
        if (diagnosticPlacements[gradeKey] !== undefined) {
          diagnosticPlacements[gradeKey]++;
        } else {
          diagnosticPlacements[gradeKey] = 1;
        }
      }
    }

    // Build Pedagogical Recommendations for Stuck Points
    const stuckPoints = Object.values(stuckMap)
      .map((item) => {
        const accuracy = item.totalAttempts > 0 ? Math.round((item.correctCount / item.totalAttempts) * 100) : 100;
        let friction: "high" | "moderate" | "low" = "low";
        let recommendation = "Learners are grasping this concept smoothly.";

        if (accuracy < 70) {
          friction = "high";
          if (item.targetId.includes("ten-frame")) {
            recommendation = "Learners are struggling with ten-frame placement. Provide a verbal hint reminding them to count empty boxes.";
          } else if (item.targetId.includes("cvc") || item.targetId.includes("blend") || item.targetId === "eng-act-2") {
            recommendation = "Sound blending is a primary friction point. Have students tap individual letter sound tiles before blending.";
          } else if (item.targetId.includes("trace")) {
            recommendation = "Fine motor rail control challenges detected. Guide children to slow down their touch strokes.";
          } else {
            recommendation = "High failure rate detected. Consider offering a spoken hint before the second attempt.";
          }
        } else if (accuracy < 85) {
          friction = "moderate";
          recommendation = "Moderate friction: Most learners pass on the 2nd attempt after listening to the sound button.";
        }

        return {
          ...item,
          accuracy,
          friction,
          recommendation,
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy); // Biggest bottlenecks first

    const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
    const quizPassRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 100;

    return NextResponse.json({
      success: true,
      isLiveOnly: true,
      hasLiveEvents: events.length > 0,
      metrics: {
        totalLearners: uniqueStudents.size || sessions.size || 0,
        totalEvents: events.length,
        totalAttempts,
        overallAccuracy,
        totalQuizzes,
        quizPassRate,
      },
      subjectCounts,
      dailyTrend: Object.entries(dailyMap).map(([date, count]) => ({ date, count })),
      stuckPoints,
      diagnosticPlacements,
      recentFeed: events.slice(0, 50),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
