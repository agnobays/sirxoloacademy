"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Award,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  BarChart3,
  HelpCircle,
  Lightbulb,
  User,
  Search,
} from "lucide-react";

interface MetricSummary {
  totalLearners: number;
  totalEvents: number;
  totalAttempts: number;
  overallAccuracy: number;
  totalQuizzes: number;
  quizPassRate: number;
}

interface StuckPoint {
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
  strugglingStudents?: string[];
  successfulStudents?: string[];
  recommendation: string;
}

interface AnalyticsData {
  success: boolean;
  isLiveOnly: boolean;
  hasLiveEvents: boolean;
  metrics: MetricSummary;
  subjectCounts: Record<string, number>;
  dailyTrend: Array<{ date: string; count: number }>;
  stuckPoints: StuckPoint[];
  diagnosticPlacements: Record<string, number>;
  recentFeed: Array<{
    id: string;
    eventType: string;
    subject?: string;
    title?: string;
    isCorrect?: boolean;
    score?: number;
    chosenOption?: string;
    studentName?: string;
    parentName?: string;
    timestamp: string;
  }>;
}

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [studentSearch, setStudentSearch] = useState<string>("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn("Could not fetch learning analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-600">Loading learning telemetry & diagnostics...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalLearners: 0,
    totalEvents: 0,
    totalAttempts: 0,
    overallAccuracy: 0,
    totalQuizzes: 0,
    quizPassRate: 0,
  };

  const filteredStuckPoints = (data?.stuckPoints || []).filter((item) => {
    if (subjectFilter === "all") return true;
    return item.subject.toLowerCase() === subjectFilter.toLowerCase();
  });

  const highFrictionCount = (data?.stuckPoints || []).filter((s) => s.friction === "high").length;

  return (
    <div className="space-y-8">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-black uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Real-time Learning Diagnostics & Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Learner Mastery & Stuck Points
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
            Track student interactions, identify where children are lacking or failing quizzes, and take targeted pedagogical action!
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="self-start sm:self-auto px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border border-white/20"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Learners */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Active Learners</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">{metrics.totalLearners}</div>
          <span className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Engaged across 3 subjects</span>
          </span>
        </div>

        {/* Learning Attempts */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Skill Interactions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">{metrics.totalAttempts}</div>
          <span className="text-[11px] font-bold text-slate-500 mt-2">
            Questions, blends & tracing
          </span>
        </div>

        {/* Overall Accuracy */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Overall Accuracy</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-slate-900">{metrics.overallAccuracy}%</div>
          <span className="text-[11px] font-bold text-slate-500 mt-2">
            First-attempt success rate
          </span>
        </div>

        {/* High Friction / Stuck Alerts */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Stuck Alerts</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-amber-600">{highFrictionCount}</div>
          <span className="text-[11px] font-bold text-amber-700 mt-2">
            Skills with &lt;70% pass rate
          </span>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Activity Bar Chart */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900">7-Day Learner Activity Trend</h3>
              <p className="text-xs text-slate-500">Daily learning actions & challenges tackled</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Live Feed
            </span>
          </div>

          {/* Simple Visual SVG Bar Chart */}
          <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-4 pb-2 px-2 border-b border-slate-200">
            {(data?.dailyTrend || []).map((day, idx) => {
              const maxVal = Math.max(...(data?.dailyTrend || []).map((d) => d.count), 5);
              const heightPercent = Math.max(12, Math.round((day.count / maxVal) * 100));
              const dateLabel = day.date.slice(5); // e.g. "11-16"

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-indigo-950 opacity-0 group-hover:opacity-100 transition-opacity">
                    {day.count}
                  </span>
                  <div
                    className="w-full max-w-[42px] bg-indigo-500 group-hover:bg-indigo-600 rounded-t-xl transition-all duration-300 shadow-xs"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] font-bold text-slate-500 tracking-tighter truncate">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Breakdown Donut / Stats */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900">Subject Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Interactions by curriculum stream</p>

            <div className="space-y-4">
              {/* English */}
              <div>
                <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    English Literacy
                  </span>
                  <span>{data?.subjectCounts?.english || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(((data?.subjectCounts?.english || 0) / Math.max(1, metrics.totalEvents)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Mathematics */}
              <div>
                <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    Mathematics
                  </span>
                  <span>{data?.subjectCounts?.mathematics || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(((data?.subjectCounts?.mathematics || 0) / Math.max(1, metrics.totalEvents)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* isiZulu */}
              <div>
                <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    isiZulu Ulwimi
                  </span>
                  <span>{data?.subjectCounts?.isizulu || 0}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round(((data?.subjectCounts?.isizulu || 0) / Math.max(1, metrics.totalEvents)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Placement Badges */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase text-slate-400 block mb-2">
              Diagnostic Placement Inflow
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(data?.diagnosticPlacements || {}).map(([grade, cnt]) => (
                <span
                  key={grade}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                >
                  {grade}: <span className="text-indigo-600 font-black">{cnt}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: STUCK POINTS & BOTTLENECK DETECTOR */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-black uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Skill Bottleneck Detector</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Where Kids Are Getting Stuck
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Skills and questions with the lowest first-time pass rates. Use the teacher recommendations below to provide extra guidance.
            </p>
          </div>

        {/* Filter by Subject & Student */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              placeholder="Filter by child or parent..."
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-600 bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
            {[
              { id: "all", label: "All Subjects" },
              { id: "english", label: "English" },
              { id: "mathematics", label: "Math" },
              { id: "isizulu", label: "isiZulu" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSubjectFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  subjectFilter === f.id
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stuck Points List */}
      {filteredStuckPoints.length === 0 ? (
        <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-bold text-sm">
            {metrics.totalEvents === 0
              ? "Awaiting live student sessions. Real learner stuck points will appear here automatically."
              : "No bottleneck friction detected! All attempted concepts are passing smoothly."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStuckPoints.map((item, idx) => {
            const isHigh = item.friction === "high";
            const isMod = item.friction === "moderate";

            return (
              <div
                key={idx}
                className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
                  isHigh
                    ? "bg-rose-50/50 border-rose-300"
                    : isMod
                    ? "bg-amber-50/40 border-amber-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-slate-900">{item.title}</span>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                          isHigh
                            ? "bg-rose-600 text-white"
                            : isMod
                            ? "bg-amber-500 text-white"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {isHigh ? "⚠️ High Friction" : isMod ? "Moderate Friction" : "Smooth Mastery"}
                      </span>
                      <span className="text-[10px] font-black uppercase bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                        {item.subject}
                      </span>
                    </div>

                    {/* Accuracy Bar */}
                    <div className="flex items-center gap-3">
                      <div className="w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isHigh ? "bg-rose-500" : isMod ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-slate-800">
                        {item.accuracy}% Accuracy ({item.correctCount} passed / {item.totalAttempts} total attempts)
                      </span>
                    </div>

                    {/* Students Who Struggled on this Task */}
                    {item.strugglingStudents && item.strugglingStudents.length > 0 && (
                      <div className="pt-1.5 flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-rose-900">
                          ⚠️ Kids struggling on this task:
                        </span>
                        {item.strugglingStudents.map((st, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-xs font-black bg-rose-100 text-rose-950 border border-rose-300 px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-2xs"
                          >
                            <User className="w-3 h-3 text-rose-600" />
                            <span>{st}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Students Who Mastered this Task */}
                    {item.successfulStudents && item.successfulStudents.length > 0 && (
                      <div className="pt-1 flex items-center gap-2 flex-wrap text-xs text-emerald-800 font-bold">
                        <span>✓ Mastered by:</span>
                        {item.successfulStudents.map((st, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {Object.keys(item.commonMistakes).length > 0 && (
                      <p className="text-xs text-rose-900 font-semibold pt-1">
                        ❌ Common wrong selections:{" "}
                        <span className="font-normal italic">
                          {Object.entries(item.commonMistakes)
                            .map(([ans, cnt]) => `"${ans}" (${cnt}x)`)
                            .join(", ")}
                        </span>
                      </p>
                    )}

                    {/* Teacher Guidance / Pedagogical Recommendation */}
                    <div className="mt-2 p-3 bg-white/90 border border-slate-200 rounded-xl flex items-start gap-2 shadow-2xs">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 leading-relaxed">
                        <strong>Teacher Action:</strong> {item.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* Live Recent Learner Activity Feed */}
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Live Learner Activity Stream</span>
        </h3>
        <span className="text-xs font-bold text-slate-500">
          Showing real student actions
        </span>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-2">
        {(!data?.recentFeed || data.recentFeed.length === 0) ? (
          <div className="py-8 text-center text-slate-500 text-xs font-bold">
            Awaiting live sessions. Any question answered by a child will show up here live!
          </div>
        ) : (
          (data.recentFeed).map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Student & Parent Name Badge */}
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl shadow-2xs">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  <strong className="text-indigo-950 font-black">
                    {ev.studentName || "Learner"}
                  </strong>
                  {ev.parentName && (
                    <span className="text-slate-500 font-semibold text-[11px]">
                      (Parent: {ev.parentName})
                    </span>
                  )}
                </div>

                <span className="text-slate-400 font-bold">•</span>

                {/* Task Title */}
                <span className="font-extrabold text-slate-900 text-sm">
                  {ev.title || ev.eventType}
                </span>

                {/* Subject Badge */}
                {ev.subject && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {ev.subject}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {/* Result Indicator */}
                {typeof ev.isCorrect === "boolean" && (
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                      ev.isCorrect
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {ev.isCorrect ? "Correct ✓" : "Retry ↺"}
                  </span>
                )}

                {/* Quiz Score */}
                {typeof ev.score === "number" && (
                  <span className="font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg text-[10px]">
                    Score: {ev.score}%
                  </span>
                )}

                {/* Time */}
                <span className="text-[10px] font-semibold text-slate-400">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );
}
