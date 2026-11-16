"use client";

import React, { useState } from "react";
import { triggerFullScreenConfetti } from "@/utils/confettiHelper";
import { soundFx } from "@/utils/audioHelper";
import { Sparkles, CheckCircle2, RotateCcw, Volume2, Trophy } from "lucide-react";

interface TenFrameCounterProps {
  targetNumber?: number;
  prompt?: string;
  onMastered?: () => void;
}

const COUNTER_THEMES = [
  { id: "star", name: "Stars", icon: "⭐", bg: "bg-amber-400" },
  { id: "apple", name: "Apples", icon: "🍎", bg: "bg-rose-500" },
  { id: "coin", name: "Gold Coins", icon: "🪙", bg: "bg-yellow-500" },
];

export default function TenFrameCounter({
  targetNumber = 7,
  prompt = `Tap the boxes to place ${targetNumber} counters in the ten-frame!`,
  onMastered,
}: TenFrameCounterProps) {
  // 10 boxes (indices 0 to 9)
  const [filledSlots, setFilledSlots] = useState<boolean[]>(
    Array(10).fill(false)
  );
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const filledCount = filledSlots.filter(Boolean).length;
  const emptyCount = 10 - filledCount;

  const handleToggleSlot = (index: number) => {
    const updated = [...filledSlots];
    const willBeFilled = !updated[index];
    updated[index] = willBeFilled;
    setFilledSlots(updated);

    const newFilledCount = updated.filter(Boolean).length;

    if (willBeFilled) {
      soundFx.playSuccessChime();
      soundFx.speakText(`${newFilledCount}`);
    } else {
      soundFx.playRetryBoing();
    }

    // Check target match
    if (newFilledCount === targetNumber) {
      setIsSuccess(true);
      soundFx.playFanfare();
      soundFx.playHooray();
      triggerFullScreenConfetti();
      if (onMastered) {
        onMastered();
      }
    } else {
      setIsSuccess(false);
    }
  };

  const handleReset = () => {
    soundFx.playRetryBoing();
    setFilledSlots(Array(10).fill(false));
    setIsSuccess(false);
  };

  const handleReadEquation = () => {
    soundFx.speakText(`${filledCount} plus ${emptyCount} equals 10!`);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Target & Guidance Banner */}
      <div className="w-full mb-6 p-4 rounded-3xl bg-amber-50 border-2 border-amber-200 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-black uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Target Number: {targetNumber}</span>
        </div>
        <h3 className="text-base sm:text-lg font-black text-slate-900">
          {prompt}
        </h3>
      </div>

      {/* Control Bar: Theme picker & Reset */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {COUNTER_THEMES.map((theme, idx) => (
            <button
              key={theme.id}
              onClick={() => setSelectedTheme(idx)}
              className={`px-2.5 py-1.5 rounded-xl text-sm transition-all ${
                selectedTheme === idx
                  ? "bg-white shadow-sm scale-105 font-bold"
                  : "opacity-60 hover:opacity-100"
              }`}
              title={theme.name}
            >
              {theme.icon}
            </button>
          ))}
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* The 2x5 Ten-Frame Grid */}
      <div className="w-full bg-white p-4 sm:p-6 rounded-3xl border-4 border-slate-800 shadow-xl">
        <div className="grid grid-cols-5 gap-2.5 sm:gap-4">
          {filledSlots.map((isFilled, idx) => (
            <button
              key={idx}
              onClick={() => handleToggleSlot(idx)}
              className={`aspect-square rounded-2xl border-3 transition-all transform active:scale-90 flex items-center justify-center relative cursor-pointer ${
                isFilled
                  ? "border-amber-500 bg-amber-50/80 shadow-inner"
                  : "border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/60"
              }`}
            >
              {isFilled ? (
                <span className="text-3xl sm:text-4xl animate-bounce-short select-none">
                  {COUNTER_THEMES[selectedTheme].icon}
                </span>
              ) : (
                <span className="text-xs font-bold text-slate-300 select-none">
                  {idx + 1}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Number Bonds Equation Bar */}
      <div className="w-full mt-6 p-4 rounded-3xl bg-slate-900 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-lg flex items-center justify-center">
            {filledCount}
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              Number Bond
            </span>
            <span className="text-base sm:text-lg font-black text-amber-300">
              {filledCount} + {emptyCount} = 10
            </span>
          </div>
        </div>

        <button
          onClick={handleReadEquation}
          className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-400 transition-all"
          title="Read Equation Aloud"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Target status badge */}
      {isSuccess && (
        <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-black text-sm animate-pulse">
          <Trophy className="w-4 h-4 text-emerald-600" />
          <span>Correct! You made {targetNumber}! Outstanding job! ⭐</span>
        </div>
      )}
    </div>
  );
}
