"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  Play,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Trophy,
  Volume2,
  RefreshCcw,
  Lock,
} from "lucide-react";
import { SkillStep, SubjectMeta } from "@/types/curriculum";
import AudioButton from "./AudioButton";
import TouchTracingCanvas from "./TouchTracingCanvas";
import TenFrameCounter from "./TenFrameCounter";
import { soundFx } from "@/utils/audioHelper";

interface Props {
  step: SkillStep;
  subject: SubjectMeta;
  nextStep?: SkillStep;
}

export default function InteractiveLessonPlayer({ step, subject, nextStep }: Props) {
  const [activeTab, setActiveTab] = useState<"video" | "activity" | "quiz" | "storybook">("video");
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

  const currentActivity = step.activities[activityIndex];

  const handleSelectOption = (optionId: string, isCorrect?: boolean) => {
    setSelectedActivityOption(optionId);
    if (isCorrect) {
      soundFx.playSuccessChime();
      soundFx.playHooray(subject.id === "isizulu");
      setActivityFeedback({
        isSuccess: true,
        message: currentActivity.feedbackSuccess,
      });
    } else {
      soundFx.playRetryBoing();
      soundFx.speakText("Oops! Try again!");
      setActivityFeedback({
        isSuccess: false,
        message: currentActivity.feedbackRetry,
      });
    }
  };

  const handleNextActivity = () => {
    if (activityIndex < step.activities.length - 1) {
      setActivityIndex(activityIndex + 1);
      setSelectedActivityOption(null);
      setActivityFeedback(null);
    } else {
      // Completed all activities, prompt to quiz!
      setActiveTab("quiz");
    }
  };

  const handleSelectQuizAnswer = (qIndex: number, optIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    step.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / step.quiz.length) * 100);
    setQuizScore(percent);
    setIsQuizSubmitted(true);

    if (percent >= 80) {
      setIsMastered(true);
      soundFx.playFanfare();
      soundFx.playHooray(subject.id === "isizulu");
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      soundFx.playRetryBoing();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-10">
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

        {/* Big Audio Helper */}
        <AudioButton
          textToSpeak={`Step ${step.stepNumber}: ${step.title}. ${step.description}`}
          label="Read Step Out Loud"
          size="md"
        />
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-200 rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab("video")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === "video"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
          <span>1. Watch Video</span>
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === "activity"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>2. Interactive Play</span>
        </button>

        <button
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === "quiz"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-500" />
          <span>3. Mastery Check</span>
        </button>

        {step.decodableBook && (
          <button
            onClick={() => setActiveTab("storybook")}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === "storybook"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>4. Storybook</span>
          </button>
        )}
      </div>

      {/* TAB 1: VIDEO LESSON */}
      {activeTab === "video" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm">
                ▶
              </span>
              Lesson with Sir Xolo
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
              Duration: {step.videoDuration}
            </span>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-inner flex items-center justify-center">
            <div className="text-center p-6 text-white max-w-md">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-105 transition-transform">
                <Play className="w-10 h-10 fill-white text-white ml-1" />
              </div>
              <h3 className="text-lg font-bold">Sir Xolo Teaching Video</h3>
              <p className="text-xs text-slate-300 mt-1">
                Short, high-energy concept breakdown with visual props and phonics articulation.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="text-sm text-slate-600">
              <span className="font-bold text-slate-800">Skills covered: </span>
              {step.focusSkills.join(" • ")}
            </div>
            <button
              onClick={() => setActiveTab("activity")}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>Ready to Play Activities!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE ACTIVITIES */}
      {activeTab === "activity" && currentActivity && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Activity {activityIndex + 1} of {step.activities.length}
            </span>
            <AudioButton
              textToSpeak={`${currentActivity.prompt}. ${currentActivity.subPrompt || ""}`}
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
                onClick={() =>
                  soundFx.speakPhoneme(
                    currentActivity.audioPrompt || (currentActivity.correctAnswer as string) || "s",
                    subject.id === "isizulu" ? "zu-ZA" : "en-ZA"
                  )
                }
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-black text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Volume2 className="w-5 h-5 animate-pulse" />
                <span>Play Sound</span>
              </button>
            </div>
          )}

          {/* Interactive Options or Specialized Widgets */}
          {currentActivity.type === "tracing" ? (
            <div className="my-6">
              <TouchTracingCanvas
                character={currentActivity.tracingTarget || "s"}
                guideHint={currentActivity.subPrompt}
                soundPrompt={currentActivity.audioPrompt}
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
                  <AudioButton textToSpeak={q.prompt} size="sm" label="Read" />
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
                  <Link
                    href={`/learn/${subject.id}/${nextStep.id}`}
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                  >
                    <span>Proceed to Step {nextStep.stepNumber}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
              onClick={() => setStoryPage((p) => Math.max(0, p - 1))}
              disabled={storyPage === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 disabled:opacity-30 cursor-pointer"
            >
              Previous Page
            </button>

            <span className="text-xs font-bold text-slate-500">
              Page {storyPage + 1} of {step.decodableBook.pages.length}
            </span>

            <button
              onClick={() =>
                setStoryPage((p) => Math.min(step.decodableBook!.pages.length - 1, p + 1))
              }
              disabled={storyPage === step.decodableBook.pages.length - 1}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold disabled:opacity-30 cursor-pointer shadow-sm"
            >
              Next Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
