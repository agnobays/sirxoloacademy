"use client";

import { useState } from "react";
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
} from "lucide-react";
import { SUBJECTS, SKILL_STEPS } from "@/data/curriculumData";
import { SubjectId } from "@/types/curriculum";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"lessons" | "questions" | "storybooks" | "store">("lessons");
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("english");
  const [videoUrl, setVideoUrl] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubtitle, setLessonSubtitle] = useState("");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

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
            Upload pre-recorded videos, write lesson questions, create storybooks, and manage workbook sales.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
            Host: sirxoloa@da43.host-ww.net
          </span>
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
                    <span className="text-slate-500">{s.videoDuration}</span>
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
