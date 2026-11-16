"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Lock,
  CheckCircle2,
  Play,
  ArrowRight,
  Award,
  Zap,
  Target,
  X,
  Volume2,
  ShieldCheck,
} from "lucide-react";
import { SUBJECTS, SKILL_STEPS } from "@/data/curriculumData";
import { SubjectId } from "@/types/curriculum";

export default function LearnPage() {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>("english");
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);

  const subjectMeta = SUBJECTS[selectedSubject];
  const subjectSteps = SKILL_STEPS.filter((s) => s.subjectId === selectedSubject);

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
      {/* Child Mode Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Learner Adventure Map</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Welcome to Kid Zone! 🚀
          </h1>
          <p className="text-sm sm:text-base text-indigo-100 mt-2 font-medium max-w-xl">
            Choose your subject below and climb the skill ladder. Each step gives you stars, badges, and unlocks new challenges!
          </p>
        </div>

        {/* Initial Diagnostic Trigger */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center shrink-0 w-full md:w-auto">
          <span className="text-xs font-bold text-amber-200 block mb-1">
            New to Sir Xolo Academy?
          </span>
          <button
            onClick={() => setShowDiagnosticModal(true)}
            className="w-full px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <Target className="w-4 h-4 text-slate-950" />
            <span>Take Skill Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Subject Picker Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {(Object.keys(SUBJECTS) as SubjectId[]).map((subId) => {
          const sub = SUBJECTS[subId];
          const isSelected = selectedSubject === subId;

          return (
            <button
              key={subId}
              onClick={() => setSelectedSubject(subId)}
              className={`p-6 rounded-3xl border-3 text-left transition-all cursor-pointer transform active:scale-98 flex items-center gap-4 ${
                isSelected
                  ? `border-indigo-600 bg-white shadow-xl scale-102 ring-4 ring-indigo-100`
                  : `border-slate-200 bg-white/60 hover:bg-white text-slate-700 shadow-xs`
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center font-black shadow-md shrink-0`}
              >
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 block">
                  {sub.nativeName}
                </span>
                <span className="text-lg font-black text-slate-900 block leading-tight">
                  {sub.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Skill Ladder Pathway */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{subjectMeta.name} Skill Ladder</span>
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Follow the steps in sequence. Master quizzes and activities to unlock the next rung!
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Mastery Progress: 1 of {subjectSteps.length} Steps Unlocked</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {subjectSteps.map((step, idx) => {
            const isUnlocked = !step.isLocked;

            return (
              <div
                key={step.id}
                className={`relative rounded-2xl p-6 border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUnlocked
                    ? "bg-slate-50 border-indigo-200 hover:border-indigo-500 hover:shadow-md"
                    : "bg-slate-100/60 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 ${
                      isUnlocked
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-slate-300 text-slate-600"
                    }`}
                  >
                    {step.stepNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {step.title}
                      </h3>
                      {isUnlocked ? (
                        <span className="text-[11px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                          Available
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-sm mt-1">{step.subtitle}</p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {step.focusSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-semibold bg-white text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="sm:shrink-0 flex items-center">
                  {isUnlocked ? (
                    <Link
                      href={`/learn/${step.subjectId}/${step.id}`}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-102"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Lesson</span>
                    </Link>
                  ) : (
                    <div className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Complete Step {step.stepNumber - 1} First</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Mobile-Friendly Diagnostic Assessment Modal */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowDiagnosticModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Adaptive Skill Diagnostic
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Find Your Starting Step 🎯
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              At Sir Xolo Academy, we don&apos;t lock learners by rigid Grade 1, 2, or 3 labels. Each child takes 5 quick visual challenges to discover their starting rung on the ladder!
            </p>

            {/* 3 Core Benefits */}
            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Never Repeat:</strong> If your child already knows their letter sounds, they jump straight to word blending.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">Never Skip:</strong> Pinpoints foundational phonetic or math hurdles before moving forward.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700">
                  <strong className="text-slate-900">60-Second Assessment:</strong> Fast, visual, tactile puzzles designed for young children.
                </p>
              </div>
            </div>

            {/* Choose Diagnostic Track */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                Choose a Free Placement Diagnostic:
              </span>

              <Link
                href="/learn/english/eng-step-1"
                onClick={() => setShowDiagnosticModal(false)}
                className="w-full p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-950 font-black text-xs sm:text-sm flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🔤</span>
                  <div className="text-left">
                    <span className="block font-black">English Diagnostic</span>
                    <span className="text-[10px] text-indigo-600 font-semibold block">Sounds /s/, /a/, /t/, /p/ & Blending</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-600" />
              </Link>

              <Link
                href="/learn/mathematics/math-step-1"
                onClick={() => setShowDiagnosticModal(false)}
                className="w-full p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🔢</span>
                  <div className="text-left">
                    <span className="block font-black">Mathematics Diagnostic</span>
                    <span className="text-[10px] text-amber-700 font-semibold block">Subitizing, Ten-Frames & Number Bonds</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-700" />
              </Link>

              <Link
                href="/learn/isizulu/zulu-step-1"
                onClick={() => setShowDiagnosticModal(false)}
                className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🇿🇦</span>
                  <div className="text-left">
                    <span className="block font-black">isiZulu Ulwimi Diagnostic</span>
                    <span className="text-[10px] text-emerald-700 font-semibold block">Onkamisa A-E-I-O-U & Syllable Sounds</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-emerald-700" />
              </Link>
            </div>

            <button
              onClick={() => setShowDiagnosticModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Close & Explore Skill Ladders
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
