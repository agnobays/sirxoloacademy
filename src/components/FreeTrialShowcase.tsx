"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Share2,
  Check,
  BookOpen,
  Volume2,
  ShieldCheck,
  Smartphone,
  Star,
} from "lucide-react";

interface FreeTrialShowcaseProps {
  currentSubjectId?: string;
  isMastered?: boolean;
}

const TRIAL_SUBJECTS = [
  {
    id: "english",
    title: "English Literacy (Letter /s/)",
    stepId: "eng-step-1",
    badge: "Phonics & Tracing",
    color: "from-blue-600 to-indigo-600",
    icon: "🔤",
    desc: "Authentic /s/ sound, CVC blending (/s/+/a/+/t/), and vector rail handwriting.",
  },
  {
    id: "mathematics",
    title: "Mathematics (Ten-Frames)",
    stepId: "math-step-1",
    badge: "Number Bonds 1-10",
    color: "from-amber-500 to-orange-500",
    icon: "🔢",
    desc: "Concrete subitizing, tactile ten-frame counters, and 4 + 6 = 10 equations.",
  },
  {
    id: "isizulu",
    title: "isiZulu Ulwimi (Onkamisa)",
    stepId: "zulu-step-1",
    badge: "Mother Tongue & FAL",
    color: "from-emerald-600 to-teal-600",
    icon: "🇿🇦",
    desc: "Onkamisa A-E-I-O-U, letter tracing 'A', and decodable stories.",
  },
];

export default function FreeTrialShowcase({
  currentSubjectId = "english",
  isMastered = false,
}: FreeTrialShowcaseProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full mt-10 rounded-3xl overflow-hidden border-2 border-indigo-200 bg-white shadow-xl">
      {/* Top Gradient Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Sir Xolo Academy • Free Interactive Trial</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              {isMastered
                ? "🎉 Free Trial Module Mastered!"
                : "🚀 Welcome to the Free Interactive Trial"}
            </h3>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl font-medium leading-relaxed">
              Experience South Africa&apos;s premier Foundation Phase learning engine.
              All Step 1 activities, recorded phonics, handwriting tracing, and quizzes
              are completely unlocked.
            </p>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="self-stretch sm:self-auto px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Share Showcase</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50">
        {/* Core Pedagogical Pillars Grid */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
            What You Experience in the Full Academy
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black shrink-0">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900">Authentic Phonics</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Real South African letter sounds. Zero robotic &quot;slash s slash&quot; TTS.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900">Vector Rail Tracing</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Guided Bézier spline corridors prevent incorrect letter formation habits.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900">Concrete Math (Ten-Frames)</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Visual subitizing and tangible number bonds (4 + 6 = 10) build math intuition.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-black text-slate-900">Decodable Stories & isiZulu</h5>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  Mother tongue Onkamisa & English readers aligned with CAPS Foundation Phase.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Other Free Trial Steps */}
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">
            Try Other Free Trial Modules
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {TRIAL_SUBJECTS.map((subj) => {
              const isCurrent = subj.id === currentSubjectId;
              return (
                <Link
                  key={subj.id}
                  href={`/learn/${subj.id}/${subj.stepId}`}
                  className={`p-5 rounded-2xl border-2 transition-all block ${
                    isCurrent
                      ? "border-indigo-600 bg-white ring-3 ring-indigo-100 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-400 shadow-xs hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{subj.icon}</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {isCurrent ? "Current Trial" : "Try Free"}
                    </span>
                  </div>
                  <h5 className="text-sm font-black text-slate-900 mb-1">{subj.title}</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">{subj.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Primary Call To Action Section */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-black text-slate-900 flex items-center justify-center sm:justify-start gap-1.5">
              <span>Ready for the Full Academy Launch?</span>
              <span className="inline-block animate-bounce">🚀</span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Pre-register your child today for early bird enrollment, diagnostic placement, and bonus workbooks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/#register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pre-Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/learn"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center"
            >
              <span>View Skill Ladder</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
