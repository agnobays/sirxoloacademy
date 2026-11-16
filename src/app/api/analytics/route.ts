import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const analyticsFilePath = path.join(dataDir, "learning_analytics.json");

interface StoredEvent {
  id: string;
  eventType: string;
  subject?: string;
  stepId?: string;
  targetId?: string;
  title?: string;
  isCorrect?: boolean;
  score?: number;
  chosenOption?: string;
  details?: Record<string, unknown>;
  sessionId?: string;
  timestamp: string;
}

// Generate rich initial baseline data so the dashboard charts & stuck point analyses are immediately visible
function getInitialBaselineEvents(): StoredEvent[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const sampleEvents: StoredEvent[] = [
    // Mathematics: Subitizing 3 Apples (Smooth)
    {
      id: "ev_1",
      eventType: "activity_attempt",
      subject: "mathematics",
      stepId: "math-step-1",
      targetId: "math-act-1",
      title: "Subitizing 3 Apples in Basket",
      isCorrect: true,
      chosenOption: "3 Apples",
      sessionId: "sess_cohort_1",
      timestamp: new Date(now - day * 2.5).toISOString(),
    },
    {
      id: "ev_2",
      eventType: "activity_attempt",
      subject: "mathematics",
      stepId: "math-step-1",
      targetId: "math-act-1",
      title: "Subitizing 3 Apples in Basket",
      isCorrect: true,
      chosenOption: "3 Apples",
      sessionId: "sess_cohort_2",
      timestamp: new Date(now - day * 2.1).toISOString(),
    },
    // Mathematics: Ten Frame Counter (HIGH FRICTION / STUCK POINT)
    {
      id: "ev_3",
      eventType: "activity_attempt",
      subject: "mathematics",
      stepId: "math-step-1",
      targetId: "math-act-ten-frame",
      title: "Ten-Frame: Place 4 Counters",
      isCorrect: false,
      chosenOption: "Placed 3 counters",
      sessionId: "sess_cohort_3",
      timestamp: new Date(now - day * 1.8).toISOString(),
    },
    {
      id: "ev_4",
      eventType: "activity_attempt",
      subject: "mathematics",
      stepId: "math-step-1",
      targetId: "math-act-ten-frame",
      title: "Ten-Frame: Place 4 Counters",
      isCorrect: false,
      chosenOption: "Placed 5 counters",
      sessionId: "sess_cohort_4",
      timestamp: new Date(now - day * 1.5).toISOString(),
    },
    {
      id: "ev_5",
      eventType: "activity_attempt",
      subject: "mathematics",
      stepId: "math-step-1",
      targetId: "math-act-ten-frame",
      title: "Ten-Frame: Place 4 Counters",
      isCorrect: true,
      chosenOption: "Placed 4 counters",
      sessionId: "sess_cohort_5",
      timestamp: new Date(now - day * 1.2).toISOString(),
    },
    // English: Blending /s/ + /a/ + /t/ into SAT (MODERATE FRICTION)
    {
      id: "ev_6",
      eventType: "activity_attempt",
      subject: "english",
      stepId: "eng-step-1",
      targetId: "eng-act-2",
      title: "Sound Blending: /s/ + /a/ + /t/ = SAT",
      isCorrect: false,
      chosenOption: "TAP",
      sessionId: "sess_cohort_6",
      timestamp: new Date(now - day * 2.8).toISOString(),
    },
    {
      id: "ev_7",
      eventType: "activity_attempt",
      subject: "english",
      stepId: "eng-step-1",
      targetId: "eng-act-2",
      title: "Sound Blending: /s/ + /a/ + /t/ = SAT",
      isCorrect: true,
      chosenOption: "SAT",
      sessionId: "sess_cohort_7",
      timestamp: new Date(now - day * 2.0).toISOString(),
    },
    {
      id: "ev_8",
      eventType: "activity_attempt",
      subject: "english",
      stepId: "eng-step-1",
      targetId: "eng-act-2",
      title: "Sound Blending: /s/ + /a/ + /t/ = SAT",
      isCorrect: true,
      chosenOption: "SAT",
      sessionId: "sess_cohort_8",
      timestamp: new Date(now - day * 0.9).toISOString(),
    },
    // English: Letter S Sound Matching (Smooth)
    {
      id: "ev_9",
      eventType: "activity_attempt",
      subject: "english",
      stepId: "eng-step-1",
      targetId: "eng-act-1",
      title: "Phoneme Recognition: /s/ sound",
      isCorrect: true,
      chosenOption: "s (snake)",
      sessionId: "sess_cohort_9",
      timestamp: new Date(now - day * 3.0).toISOString(),
    },
    // isiZulu: Onkamisa /a/ Matching (Smooth)
    {
      id: "ev_10",
      eventType: "activity_attempt",
      subject: "isizulu",
      stepId: "zulu-step-1",
      targetId: "zulu-act-1",
      title: "isiZulu: Inhlamvu /a/ (Amaqanda)",
      isCorrect: true,
      chosenOption: "A",
      sessionId: "sess_cohort_10",
      timestamp: new Date(now - day * 1.9).toISOString(),
    },
    // isiZulu: Tracing 'A' (MODERATE FRICTION on curves)
    {
      id: "ev_11",
      eventType: "activity_attempt",
      subject: "isizulu",
      stepId: "zulu-step-1",
      targetId: "zulu-act-trace-a",
      title: "isiZulu: Tracing Onkamisa 'A'",
      isCorrect: false,
      chosenOption: "Strayed off diagonal rail",
      sessionId: "sess_cohort_11",
      timestamp: new Date(now - day * 1.4).toISOString(),
    },
    {
      id: "ev_12",
      eventType: "activity_attempt",
      subject: "isizulu",
      stepId: "zulu-step-1",
      targetId: "zulu-act-trace-a",
      title: "isiZulu: Tracing Onkamisa 'A'",
      isCorrect: true,
      chosenOption: "Completed trace",
      sessionId: "sess_cohort_12",
      timestamp: new Date(now - day * 0.8).toISOString(),
    },
    // Quizzes Completed
    {
      id: "ev_13",
      eventType: "quiz_completed",
      subject: "english",
      stepId: "eng-step-1",
      title: "English Step 1 Quiz",
      score: 100,
      sessionId: "sess_cohort_13",
      timestamp: new Date(now - day * 0.5).toISOString(),
    },
    {
      id: "ev_14",
      eventType: "quiz_completed",
      subject: "mathematics",
      stepId: "math-step-1",
      title: "Math Step 1 Quiz",
      score: 80,
      sessionId: "sess_cohort_14",
      timestamp: new Date(now - day * 0.3).toISOString(),
    },
    {
      id: "ev_15",
      eventType: "quiz_completed",
      subject: "isizulu",
      stepId: "zulu-step-1",
      title: "isiZulu Step 1 Quiz",
      score: 100,
      sessionId: "sess_cohort_15",
      timestamp: new Date(now - day * 0.1).toISOString(),
    },
    // Diagnostic Placements
    {
      id: "ev_16",
      eventType: "diagnostic_completed",
      title: "Diagnostic Placement Check",
      details: { grade: "Grade R", recommendedStep: "Step 1" },
      sessionId: "sess_cohort_16",
      timestamp: new Date(now - day * 2.2).toISOString(),
    },
    {
      id: "ev_17",
      eventType: "diagnostic_completed",
      title: "Diagnostic Placement Check",
      details: { grade: "Grade 1", recommendedStep: "Step 2" },
      sessionId: "sess_cohort_17",
      timestamp: new Date(now - day * 1.1).toISOString(),
    },
  ];

  return sampleEvents;
}

function ensureAnalyticsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(analyticsFilePath)) {
    const initialEvents = getInitialBaselineEvents();
    fs.writeFileSync(analyticsFilePath, JSON.stringify(initialEvents, null, 2), "utf-8");
  }
}

// POST: Record learning event telemetry
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
      details: body.details && typeof body.details === "object" ? body.details : undefined,
      sessionId: body.sessionId ? String(body.sessionId) : undefined,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const raw = fs.readFileSync(analyticsFilePath, "utf-8");
    const events: StoredEvent[] = JSON.parse(raw);
    events.unshift(newEvent);

    // Keep last 3,000 events to prevent file bloat while maintaining deep history
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

// GET: Aggregate and analyze learning analytics, stuck points, and trends
export async function GET() {
  try {
    ensureAnalyticsFile();
    const raw = fs.readFileSync(analyticsFilePath, "utf-8");
    const events: StoredEvent[] = JSON.parse(raw);

    // 1. Overall KPIs
    const sessions = new Set<string>();
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

    // 4. Stuck Points Analysis (Friction by Target Activity / Question)
    interface StuckRecord {
      targetId: string;
      title: string;
      subject: string;
      stepId: string;
      totalAttempts: number;
      correctCount: number;
      failCount: number;
      commonMistakes: Record<string, number>;
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
            commonMistakes: {},
            recommendation: "",
          };
        }

        const item = stuckMap[targetKey];
        item.totalAttempts++;
        if (ev.isCorrect) {
          item.correctCount++;
        } else {
          item.failCount++;
          if (ev.chosenOption) {
            item.commonMistakes[ev.chosenOption] = (item.commonMistakes[ev.chosenOption] || 0) + 1;
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
            recommendation = "Children are struggling with ten-frame counting. Recommend adding an extra visual prompt showing the 6 empty boxes.";
          } else if (item.targetId.includes("cvc") || item.targetId.includes("blend") || item.targetId === "eng-act-2") {
            recommendation = "Sound blending is a primary hurdle. Encourage learners to press individual letter tiles slowly before blending.";
          } else if (item.targetId.includes("trace")) {
            recommendation = "Motor control on touch screens is challenging for small fingers. Increase vector rail tolerance.";
          } else {
            recommendation = "High failure rate detected. Consider offering a spoken teacher hint before the second attempt.";
          }
        } else if (accuracy < 85) {
          friction = "moderate";
          recommendation = "Moderate friction: Most learners pass on the 2nd attempt after listening to the audio cue.";
        }

        return {
          ...item,
          accuracy,
          friction,
          recommendation,
        };
      })
      .sort((a, b) => a.accuracy - b.accuracy); // Lowest accuracy (biggest bottleneck) first!

    const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;
    const quizPassRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 100;

    return NextResponse.json({
      success: true,
      metrics: {
        totalLearners: sessions.size || 1,
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
      recentFeed: events.slice(0, 15),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
