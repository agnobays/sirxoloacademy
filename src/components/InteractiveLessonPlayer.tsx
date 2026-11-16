"use client";

import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { triggerFullScreenConfetti } from "@/utils/confettiHelper";
import {
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  Volume2,
  RefreshCcw,
  Lock,
  User,
  Edit3,
  X,
  RotateCcw,
} from "lucide-react";
import { SkillStep, SubjectMeta } from "@/types/curriculum";
import AudioButton from "./AudioButton";
import VectorRailTracing from "./VectorRailTracing";
import TenFrameCounter from "./TenFrameCounter";
import FreeTrialShowcase from "./FreeTrialShowcase";
import { soundFx } from "@/utils/audioHelper";
import { trackLearningEvent, getLearnerIdentity, setLearnerIdentity } from "@/utils/analytics";
import {
  getStepProgress,
  saveStepProgress,
  resetStepProgress,
} from "@/utils/progressManager";

interface Props {
  step: SkillStep;
  subject: SubjectMeta;
  nextStep?: SkillStep;
}

export default function InteractiveLessonPlayer({ step, subject, nextStep }: Props) {
  const [activeTab, setActiveTab] = useState<"activity" | "quiz" | "storybook">("activity");
  const [activityIndex, setActivityIndex] = useState(0);
  const [selectedActivityOption, setSelectedActivityOption] = useState<string | null>(null);
  const [activityFeedback, setActivityFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isMastered, setIsMastered] = useState(false);

  // Storybook state
  const [storyPage, setStoryPage] = useState(0);

  // Learner Identity (Student & Parent tracking)
  const [learnerName, setLearnerName] = useState("Guest Learner");
  const [parentName, setParentName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [inputStudent, setInputStudent] = useState("");
  const [inputParent, setInputParent] = useState("");
  const [resumedNotice, setResumedNotice] = useState<string | null>(null);

  useEffect(() => {
    const ident = getLearnerIdentity();
    setLearnerName(ident.studentName);
    setParentName(ident.parentName);
    setInputStudent(ident.studentName === "Guest Learner" ? "" : ident.studentName);
    setInputParent(ident.parentName);

    // Retrieve saved progress for this step and learner
    const saved = getStepProgress(subject.id, step.id, ident.studentName);
    if (saved) {
      if (saved.isMastered) {
        setIsMastered(true);
      }
      if (saved.quizScore !== null) {
        setQuizScore(saved.quizScore);
        setIsQuizSubmitted(true);
      }
      if (saved.storyPage > 0 && step.decodableBook) {
        setStoryPage(Math.min(saved.storyPage, step.decodableBook.pages.length - 1));
      }
      if (saved.activityIndex > 0 && saved.activityIndex < step.activities.length && !saved.isMastered) {
        setActivityIndex(saved.activityIndex);
        setResumedNotice(`Resumed at Activity ${saved.activityIndex + 1} of ${step.activities.length}`);
      } else if (saved.isMastered) {
        setResumedNotice(`Welcome back! You previously mastered this step (${saved.quizScore ?? 100}%).`);
      }
    }
  }, [subject.id, step.id, step.activities.length, step.decodableBook]);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    const finalStudent = inputStudent.trim() || "Guest Learner";
    const finalParent = inputParent.trim();
    setLearnerIdentity(finalStudent, finalParent);
    setLearnerName(finalStudent);
    setParentName(finalParent);
    setShowNameModal(false);

    // Reload progress for newly selected learner
    const saved = getStepProgress(subject.id, step.id, finalStudent);
    if (saved) {
      setIsMastered(Boolean(saved.isMastered));
      setQuizScore(saved.quizScore);
      setIsQuizSubmitted(saved.quizScore !== null);
      setActivityIndex(saved.activityIndex || 0);
      setStoryPage(saved.storyPage || 0);
      setSelectedActivityOption(null);
      setActivityFeedback(null);
      setResumedNotice(`Loaded ${finalStudent}'s progress: Activity ${(saved.activityIndex || 0) + 1}`);
    } else {
      setIsMastered(false);
      setQuizScore(null);
      setIsQuizSubmitted(false);
      setActivityIndex(0);
      setStoryPage(0);
      setSelectedActivityOption(null);
      setActivityFeedback(null);
      setResumedNotice(null);
    }
  };

  const handleResetProgress = () => {
    resetStepProgress(step.id, learnerName);
    setActivityIndex(0);
    setSelectedActivityOption(null);
    setActivityFeedback(null);
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setQuizScore(null);
    setIsMastered(false);
    setStoryPage(0);
    setActiveTab("activity");
    setResumedNotice(null);
  };

  const currentActivity = step.activities[activityIndex];

  // Telemetry: Log lesson start once per session
  useEffect(() => {
    trackLearningEvent({
      eventType: "lesson_start",
      subject: subject.id,
      stepId: step.id,
      title: `${subject.name} • Step ${step.stepNumber}: ${step.title}`,
    });
  }, [subject.id, subject.name, step.id, step.stepNumber, step.title]);

  const handleSelectOption = (optionId: string, isCorrect?: boolean) => {
    setSelectedActivityOption(optionId);

    // Telemetry: Track student attempt & stuck friction point
    const chosenLabel = currentActivity?.options?.find((o) => o.id === optionId)?.label || optionId;
    trackLearningEvent({
      eventType: "activity_attempt",
      subject: subject.id,
      stepId: step.id,
      targetId: currentActivity?.id || "activity",
      title: currentActivity?.prompt || "Activity Challenge",
      isCorrect: Boolean(isCorrect),
      chosenOption: chosenLabel,
    });

    if (isCorrect) {
      setTimeout(() => {
        soundFx.playSuccessChime();
        soundFx.playHooray(subject.id === "isizulu");
        triggerFullScreenConfetti();
      }, 350);
      setActivityFeedback({
        isSuccess: true,
        message: currentActivity.feedbackSuccess,
      });
    } else {
      setTimeout(() => {
        soundFx.playRetryBoing();
      }, 400);
      setActivityFeedback({
        isSuccess: false,
        message: currentActivity.feedbackRetry,
      });
    }
  };

  const handleNextActivity = () => {
    if (activityIndex < step.activities.length - 1) {
      const nextIdx = activityIndex + 1;
      setActivityIndex(nextIdx);
      setSelectedActivityOption(null);
      setActivityFeedback(null);
      saveStepProgress(
        {
          subjectId: subject.id,
          stepId: step.id,
          activityIndex: nextIdx,
          totalActivities: step.activities.length,
          isMastered,
          quizScore,
          storyPage,
        },
        learnerName
      );
    } else {
      // Completed all activities, prompt to quiz!
      setActiveTab("quiz");
      saveStepProgress(
        {
          subjectId: subject.id,
          stepId: step.id,
          activityIndex: step.activities.length - 1,
          totalActivities: step.activities.length,
          isMastered,
          quizScore,
          storyPage,
        },
        learnerName
      );
    }
  };

  const handleSelectQuizAnswer = (qIndex: number, optIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    step.quiz.forEach((q, idx) => {
      const isAnsCorrect = quizAnswers[idx] === q.correctIndex;
      if (isAnsCorrect) {
        correctCount += 1;
      }
      // Telemetry: Log per-question attempt to identify specific stuck questions
      trackLearningEvent({
        eventType: "quiz_attempt",
        subject: subject.id,
        stepId: step.id,
        targetId: q.id,
        title: q.prompt,
        isCorrect: isAnsCorrect,
        chosenOption: q.options[quizAnswers[idx]] || "Unanswered",
      });
    });

    const percent = Math.round((correctCount / step.quiz.length) * 100);
    setQuizScore(percent);
    setIsQuizSubmitted(true);
    const mastered = percent >= 80;

    // Telemetry: Log overall quiz mastery
    trackLearningEvent({
      eventType: "quiz_completed",
      subject: subject.id,
      stepId: step.id,
      title: `${subject.name} Step ${step.stepNumber} Mastery Check`,
      score: percent,
      isCorrect: mastered,
    });

    if (mastered) {
      setIsMastered(true);
      soundFx.playFanfare();
      soundFx.playHooray(subject.id === "isizulu");
      triggerFullScreenConfetti();
    } else {
      soundFx.playRetryBoing();
    }

    saveStepProgress(
      {
        subjectId: subject.id,
        stepId: step.id,
        activityIndex,
        totalActivities: step.activities.length,
        isMastered: mastered || isMastered,
        quizScore: percent,
        storyPage,
      },
      learnerName
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Free Trial Showcase Top Banner */}
      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider flex items-center gap-1.5 flex-wrap">
              <span>Free Interactive Trial</span>
              <span className="bg-white/25 px-2 py-0.5 rounded-full text-[10px] font-bold">Step {step.stepNumber} Unlocked</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100 font-medium hidden sm:block">
              Experience authentic recorded sounds, handwriting tracing, and interactive quizzes on phone or tablet!
            </p>
          </div>
        </div>
        <Link
          href="/#register"
          className="shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white text-amber-950 font-black text-xs hover:bg-amber-50 active:scale-95 shadow-sm transition-all"
        >
          Pre-Register
        </Link>
      </div>

      {/* Top Breadcrumb & Step Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 mb-1">
            <Link href="/learn" className="hover:text-indigo-600 transition-colors">
              Learner Zone
            </Link>
            <span>/</span>
            <span className="text-slate-800 capitalize">{subject.name}</span>
            <span>/</span>
            <span className="text-indigo-600 font-extrabold">Step {step.stepNumber}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>{step.title}</span>
            {isMastered && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-500 text-white font-extrabold px-3 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Mastered!
              </span>
            )}
          </h1>
          <p className="text-slate-600 text-sm mt-1">{step.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Learner Identity Pill */}
          <div className="flex items-center gap-2 bg-indigo-50 border-2 border-indigo-200 px-3.5 py-1.5 rounded-2xl shadow-xs">
            <User className="w-4 h-4 text-indigo-600" />
            <div className="text-xs">
              <span className="text-slate-500 font-bold">Learner: </span>
              <strong className="text-indigo-950 font-black">{learnerName}</strong>
              {parentName && <span className="text-slate-500 font-medium"> ({parentName})</span>}
            </div>
            <button
              onClick={() => setShowNameModal(true)}
              className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-900 underline ml-1 cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Big Audio Helper */}
          <AudioButton
            textToSpeak={`Step ${step.stepNumber}: ${step.title}. ${step.description}`}
            label="Read Step Out Loud"
            size="md"
          />
        </div>
      </div>

      {/* Saved Learner Progress Resume Notice Banner */}
      {resumedNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              ⚡
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700 block">
                Saved Progress Active
              </span>
              <p className="text-xs sm:text-sm font-extrabold text-indigo-950">
                {resumedNotice}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetProgress}
              className="px-3 py-1.5 rounded-xl border border-indigo-300 hover:bg-white text-indigo-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start from Beginning</span>
            </button>
            <button
              onClick={() => setResumedNotice(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-indigo-100 cursor-pointer"
              title="Dismiss notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Learner Identity Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Who is Learning Today?</h3>
                  <p className="text-xs text-slate-500">Student & Parent profile for learning tracking</p>
                </div>
              </div>
              <button
                onClick={() => setShowNameModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveIdentity} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Child / Student Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputStudent}
                  onChange={(e) => setInputStudent(e.target.value)}
                  placeholder="e.g. Sipho, Lindiwe, Thabo"
                  autoFocus
                  required
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-hidden text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Parent / Guardian Name (Optional)
                </label>
                <input
                  type="text"
                  value={inputParent}
                  onChange={(e) => setInputParent(e.target.value)}
                  placeholder="e.g. Mrs. Khumalo, Bab' uDlamini"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:outline-hidden text-sm font-semibold text-slate-900"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
                >
                  Save & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mode Navigation Tabs - Touch & Mobile Responsive */}
      <div className={`grid ${step.decodableBook ? "grid-cols-3" : "grid-cols-2"} gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-slate-200/90 rounded-2xl mb-6 sm:mb-8`}>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "activity"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
          <span className="truncate">1. Activities</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "quiz"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
          <span className="truncate">2. Quiz</span>
        </button>

        {step.decodableBook && (
          <button
            onClick={() => setActiveTab("storybook")}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "storybook"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
            <span className="truncate">3. Story</span>
          </button>
        )}
      </div>

      {/* TAB 2: INTERACTIVE ACTIVITIES */}
      {activeTab === "activity" && currentActivity && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Activity {activityIndex + 1} of {step.activities.length}
            </span>
            <AudioButton
              textToSpeak={currentActivity.prompt}
              targetLetter={
                currentActivity.tracingTarget ||
                currentActivity.options?.find((o) => o.isCorrect)?.label ||
                currentActivity.audioPrompt ||
                "s"
              }
              label="Hear Question"
              size="sm"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
            {currentActivity.prompt}
          </h2>
          {currentActivity.subPrompt && (
            <p className="text-slate-600 text-sm sm:text-base mb-6">
              {currentActivity.subPrompt}
            </p>
          )}

          {/* Prominent Phonics Sound Player for Sound Matching & Letter Recognition */}
          {(currentActivity.audioPrompt || currentActivity.type === "sound_matching") && (
            <div className="my-6 p-5 sm:p-6 rounded-3xl bg-amber-50 border-3 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                  🔊
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 block">
                    Phonics Sound Player
                  </span>
                  <p className="text-sm sm:text-base font-black text-slate-900">
                    {currentActivity.subPrompt || "Tap the sound button to listen!"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const correctOption = currentActivity.options?.find((o) => o.isCorrect);
                  const targetLetter =
                    currentActivity.audioPrompt ||
                    (correctOption && correctOption.label.length === 1 ? correctOption.label : undefined) ||
                    currentActivity.tracingTarget ||
                    "s";
                  soundFx.speakPhoneme(
                    targetLetter,
                    subject.id === "isizulu" ? "zu-ZA" : "en-ZA"
                  );
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>Play Sound</span>
              </button>
            </div>
          )}

          {/* Interactive CVC Blending Sound Player for /s/ + /a/ + /t/ */}
          {currentActivity.type === "cvc_builder" && (
            <div className="my-6 p-5 sm:p-6 rounded-3xl bg-indigo-50 border-3 border-indigo-200 flex flex-col items-center gap-4 shadow-sm text-center">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-indigo-700 bg-white/90 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-xs">
                Tap each letter to hear its sound, or blend them together!
              </span>

              {/* Individual Sound Tiles */}
              <div className="flex items-center gap-2 sm:gap-4 my-1">
                {["s", "a", "t"].map((letter, idx) => (
                  <Fragment key={letter}>
                    <button
                      type="button"
                      onClick={() => soundFx.playRecordedPhoneme(letter)}
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white border-3 border-indigo-300 hover:border-indigo-600 active:scale-90 text-indigo-950 font-black text-xl sm:text-3xl shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center cursor-pointer group"
                    >
                      <span className="group-hover:text-indigo-600 transition-colors uppercase">{letter}</span>
                      <span className="text-[8px] sm:text-[10px] text-indigo-500 font-bold uppercase mt-0.5">🔊 Sound</span>
                    </button>
                    {idx < 2 && <span className="text-xl sm:text-3xl font-black text-indigo-400">+</span>}
                  </Fragment>
                ))}
              </div>

              {/* Blend All Button */}
              <button
                type="button"
                onClick={() => soundFx.playPhonemeSequence(["s", "a", "t"])}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>Play Blended Sounds (/s/ + /a/ + /t/)</span>
              </button>
            </div>
          )}

          {/* Interactive Options or Specialized Widgets */}
          {currentActivity.type === "number_counter" && (
            <div className="my-6 p-6 sm:p-8 rounded-3xl bg-amber-50/90 border-3 border-amber-300 shadow-md flex flex-col items-center text-center">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-4 py-1.5 rounded-full mb-4 flex items-center gap-1.5 shadow-xs">
                <span>🧺</span>
                <span>The Apple Basket</span>
              </span>

              {/* Realistic Visual Wicker Basket */}
              <div className="relative w-64 sm:w-80 h-36 sm:h-44 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-full border-4 border-amber-950 shadow-2xl flex items-center justify-center pt-2">
                {/* Basket Rim */}
                <div className="absolute -top-3 inset-x-2 h-6 bg-amber-600 border-3 border-amber-950 rounded-full shadow-md" />

                {/* Cross-hatch weave effect */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:14px_14px] rounded-b-full pointer-events-none" />

                {/* Apples inside the basket */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 z-10 -mt-2">
                  {Array.from({ length: currentActivity.counterCount || 3 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => soundFx.speakText(`${i + 1}`)}
                      className="text-5xl sm:text-6xl drop-shadow-lg transform hover:scale-125 active:scale-95 transition-all cursor-pointer select-none"
                      title={`Apple ${i + 1} (Tap to count)`}
                    >
                      {currentActivity.counterIcon || "🍎"}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm font-bold text-amber-950">
                Look at the apples in the basket! Tap them to count, then select the answer below:
              </p>
            </div>
          )}

          {currentActivity.type === "tracing" ? (
            <div className="my-6">
              <VectorRailTracing
                character={currentActivity.tracingTarget || "s"}
                guideHint={currentActivity.subPrompt}
                onComplete={() => {
                  setActivityFeedback({
                    isSuccess: true,
                    message: currentActivity.feedbackSuccess,
                  });
                }}
              />
            </div>
          ) : currentActivity.type === "ten_frame" ? (
            <div className="my-6">
              <TenFrameCounter
                targetNumber={currentActivity.tenFrameTarget || 5}
                prompt={currentActivity.prompt}
                onMastered={() => {
                  setActivityFeedback({
                    isSuccess: true,
                    message: currentActivity.feedbackSuccess,
                  });
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
              {currentActivity.options?.map((option) => {
                const isSelected = selectedActivityOption === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id, option.isCorrect)}
                    className={`relative p-6 sm:p-8 rounded-3xl border-3 text-center transition-all cursor-pointer transform active:scale-95 flex flex-col items-center justify-center min-h-[140px] ${
                      isSelected
                        ? option.isCorrect
                          ? "border-emerald-500 bg-emerald-50 text-emerald-950 shadow-lg scale-102"
                          : "border-rose-400 bg-rose-50 text-rose-950"
                        : "border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 text-slate-900 shadow-sm"
                    }`}
                  >
                    <span className="text-4xl sm:text-5xl font-black tracking-wide block mb-2">
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span className="text-sm font-semibold text-slate-500">
                        {option.sublabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback banner */}
          {activityFeedback && (
            <div
              className={`p-5 rounded-2xl mb-6 flex items-start gap-3 transition-all ${
                activityFeedback.isSuccess
                  ? "bg-emerald-100 text-emerald-950 border border-emerald-300"
                  : "bg-rose-100 text-rose-950 border border-rose-300"
              }`}
            >
              {activityFeedback.isSuccess ? (
                <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <RefreshCcw className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-extrabold text-base">{activityFeedback.message}</p>
                {activityFeedback.isSuccess && (
                  <button
                    onClick={handleNextActivity}
                    className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Next Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUTO-MARKED QUIZ */}
      {activeTab === "quiz" && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Step {step.stepNumber} Mastery Check
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {step.quiz.length} Questions
            </span>
          </div>

          <div className="space-y-6">
            {step.quiz.map((q, qIdx) => (
              <div key={q.id} className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <p className="font-black text-base sm:text-lg text-slate-900">
                    <span className="text-indigo-600 mr-2">{qIdx + 1}.</span>
                    {q.prompt}
                  </p>
                  <AudioButton
                    textToSpeak={q.prompt}
                    soundKey={subject.id === "isizulu" ? `zulu_quiz_${qIdx + 1}` : undefined}
                    size="sm"
                    label="Read"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    const isSubmitted = isQuizSubmitted;
                    const isCorrect = q.correctIndex === optIdx;

                    let btnClass = "border-slate-300 bg-white hover:border-indigo-400 text-slate-800";
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnClass = "border-emerald-500 bg-emerald-100 text-emerald-950 font-black";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "border-rose-500 bg-rose-100 text-rose-950";
                      }
                    } else if (isSelected) {
                      btnClass = "border-indigo-600 bg-indigo-50 text-indigo-950 font-black ring-2 ring-indigo-400";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isQuizSubmitted}
                        onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                        className={`p-4 rounded-xl border-2 text-center text-base font-bold transition-all cursor-pointer ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {isQuizSubmitted && (
                  <p className="mt-3 text-xs font-semibold text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    💡 <span className="font-bold">Explanation:</span> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Submission and Unlock Section */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {!isQuizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < step.quiz.length}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                Submit Answers & Check Mastery!
              </button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-2xl font-black text-slate-900">
                    Your Score: {quizScore}%
                  </span>
                  <p className="text-xs text-slate-600">
                    {quizScore && quizScore >= 80
                      ? "🌟 Fantastic work! You have mastered this step and unlocked the next skill!"
                      : "Keep practicing! You can retake the quiz anytime to master it."}
                  </p>
                </div>

                {nextStep && isMastered && (
                  nextStep.isLocked ? (
                    <Link
                      href="/store"
                      className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Lock className="w-4 h-4 text-amber-900" />
                      <span>Unlock Step {nextStep.stepNumber} (Full Access)</span>
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/${subject.id}/${nextStep.id}`}
                      className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    >
                      <span>Proceed to Step {nextStep.stepNumber}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DECODABLE STORYBOOK */}
      {activeTab === "storybook" && step.decodableBook && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase font-extrabold text-purple-600 tracking-wider">
                Digital Storybook Reader
              </span>
              <h2 className="text-2xl font-black text-slate-900">{step.decodableBook.title}</h2>
            </div>
            <AudioButton
              textToSpeak={step.decodableBook.pages[storyPage]?.text || ""}
              soundKey={subject.id === "isizulu" ? `zulu_story_${storyPage + 1}` : undefined}
              label="Read Page"
              size="md"
            />
          </div>

          {/* Book Page Spread */}
          <div className="bg-amber-50/70 border-2 border-amber-200/80 rounded-3xl p-8 sm:p-12 text-center min-h-[300px] flex flex-col items-center justify-center relative shadow-inner">
            <div className="text-7xl mb-6">
              {step.decodableBook.pages[storyPage]?.illustration}
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-relaxed max-w-xl">
              {step.decodableBook.pages[storyPage]?.text}
            </p>
          </div>

          {/* Page controls */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => {
                const prev = Math.max(0, storyPage - 1);
                setStoryPage(prev);
                saveStepProgress(
                  {
                    subjectId: subject.id,
                    stepId: step.id,
                    activityIndex,
                    totalActivities: step.activities.length,
                    isMastered,
                    quizScore,
                    storyPage: prev,
                  },
                  learnerName
                );
              }}
              disabled={storyPage === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-30 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              Previous Page
            </button>

            <span className="text-xs font-bold text-slate-500">
              Page {storyPage + 1} of {step.decodableBook.pages.length}
            </span>

            <button
              onClick={() => {
                const next = Math.min(step.decodableBook!.pages.length - 1, storyPage + 1);
                setStoryPage(next);
                saveStepProgress(
                  {
                    subjectId: subject.id,
                    stepId: step.id,
                    activityIndex,
                    totalActivities: step.activities.length,
                    isMastered,
                    quizScore,
                    storyPage: next,
                  },
                  learnerName
                );
              }}
              disabled={storyPage === step.decodableBook.pages.length - 1}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold disabled:opacity-30 cursor-pointer shadow-sm transition-all"
            >
              Next Page
            </button>
          </div>
        </div>
      )}

      {/* Free Trial Showcase & Full Academy Overview */}
      <FreeTrialShowcase currentSubjectId={subject.id} isMastered={isMastered} />
    </div>
  );
}
