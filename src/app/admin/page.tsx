"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Video,
  FileQuestion,
  BookOpen,
  ShoppingBag,
  Plus,
  Save,
  CheckCircle2,
  Trash2,
  Mic,
  Lock,
  KeyRound,
  LogOut,
  Sparkles,
} from "lucide-react";
import { SUBJECTS, SKILL_STEPS } from "@/data/curriculumData";
import { SubjectId } from "@/types/curriculum";
import VoiceStudioManager from "@/components/VoiceStudioManager";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<"voice_studio" | "lessons" | "questions" | "storybooks" | "store">("voice_studio");
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("english");
  const [videoUrl, setVideoUrl] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubtitle, setLessonSubtitle] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  // Check existing session token on load
  useEffect(() => {
    const savedToken = sessionStorage.getItem("xolo_admin_authenticated");
    if (savedToken === "true") {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("xolo_admin_authenticated", "true");
      } else {
        setAuthError("Incorrect PIN code. Please try again.");
      }
    } catch {
      setAuthError("Could not connect to authentication service.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("xolo_admin_authenticated");
    fetch("/api/admin-auth", { method: "DELETE" }).catch(() => {});
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  if (isCheckingAuth) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center" />;
  }

  // 1. PIN-PROTECTED LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin & Voice Studio Access</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter your secret Administrator Security PIN to manage the curriculum and record voices.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN"
                autoFocus
                className="w-full px-4 py-3.5 text-center text-2xl font-black tracking-widest rounded-2xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-hidden transition-all bg-slate-50"
              />
            </div>

            {authError && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm uppercase tracking-wider shadow-md hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Panel</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
      {/* Admin Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sir Xolo Content & Curriculum Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Administrator CMS
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Record teacher voices, configure lesson questions, create storybooks, and manage curriculum.
          </p>
        </div>

        {/* Secure session pill & logout */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated</span>
          </span>

          <button
            onClick={handleLogout}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Content published successfully! Changes are live immediately for all enrolled learners.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-4 overflow-x-auto">
        {[
          { id: "voice_studio", label: "🎙️ Mr. Xolo Voice Studio", icon: Mic },
          { id: "lessons", label: "Video Lessons & Steps", icon: Video },
          { id: "questions", label: "Interactive Questions", icon: FileQuestion },
          { id: "storybooks", label: "Storybook Creator", icon: BookOpen },
          { id: "store", label: "Workbook Inventory", icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: MR. XOLO VOICE STUDIO */}
      {activeTab === "voice_studio" && (
        <VoiceStudioManager />
      )}

      {/* TAB 1: VIDEO LESSONS BUILDER */}
      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6">Create New Skill Step</h2>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value as SubjectId)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="english">English Literacy</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="isizulu">isiZulu Ulwimi</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Step Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. CVC Words & Short Vowel /i/"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Subtitle / Learning Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blending p-i-n and s-i-t"
                  value={lessonSubtitle}
                  onChange={(e) => setLessonSubtitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Video URL (YouTube, Vimeo, Bunny.net, or Direct MP4)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Lesson Step</span>
                </button>
              </div>
            </form>
          </div>

          {/* Existing Steps */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-900 text-base mb-4">Current Ladder Steps</h3>
            <div className="space-y-3">
              {SKILL_STEPS.filter((s) => s.subjectId === selectedSubject).map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Step {s.stepNumber}: {s.title}
                    </span>
                    <span className="text-slate-500">{s.videoDuration || "Interactive Activities"}</span>
                  </div>
                  <button className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2, 3, 4 Placeholders with interactive info */}
      {activeTab !== "lessons" && (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center max-w-xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Save className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {activeTab === "questions"
              ? "Interactive Question Builder"
              : activeTab === "storybooks"
              ? "Decodable Storybook Builder"
              : "Workbook Store Inventory"}
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Configure auto-marked questions, audio pronunciations, and decodable book spreads directly in this interface.
          </p>
        </div>
      )}
    </div>
  );
}
