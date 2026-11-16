"use client";

import React, { useState } from "react";
import { Volume2 } from "lucide-react";
import { soundFx } from "@/utils/audioHelper";

interface AudioButtonProps {
  textToSpeak: string;
  soundKey?: string;
  targetLetter?: string;
  label?: string;
  lang?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AudioButton({
  textToSpeak,
  soundKey,
  targetLetter,
  label = "Listen",
  lang = "en-ZA",
  className = "",
  size = "md",
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    try {
      await soundFx.speakSmart({
        text: textToSpeak,
        soundKey,
        targetLetter,
        lang,
      });
    } finally {
      setIsPlaying(false);
    }
  };

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-3 font-black",
  };

  return (
    <button
      onClick={handlePlay}
      type="button"
      className={`inline-flex items-center justify-center font-bold rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 shadow-md hover:shadow-lg transition-all cursor-pointer ${sizeClasses[size]} ${className}`}
      aria-label={`Listen to ${textToSpeak}`}
    >
      <Volume2 className={`w-5 h-5 text-amber-900 ${isPlaying ? "animate-bounce" : "animate-pulse"}`} />
      <span>{isPlaying ? "Playing..." : label}</span>
    </button>
  );
}
