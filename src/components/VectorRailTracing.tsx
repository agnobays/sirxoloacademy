"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { triggerFullScreenConfetti } from "@/utils/confettiHelper";
import { soundFx } from "@/utils/audioHelper";
import { RotateCcw, CheckCircle2, Volume2, Sparkles, RefreshCcw } from "lucide-react";

interface VectorRailTracingProps {
  character: string;
  guideHint?: string;
  onComplete?: () => void;
}

interface StrokeDef {
  id: string;
  pathData: string;
  startLabel: string;
}

// Normalized vector splines on a 500x500 viewBox
const LETTER_PATHS: Record<string, StrokeDef[]> = {
  s: [
    {
      id: "s-curve",
      pathData: "M 330,135 C 290,95 180,95 160,165 C 145,225 240,250 265,285 C 310,345 290,410 160,405",
      startLabel: "1",
    },
  ],
  A: [
    {
      id: "A-left",
      pathData: "M 250,95 L 140,410",
      startLabel: "1",
    },
    {
      id: "A-right",
      pathData: "M 250,95 L 360,410",
      startLabel: "2",
    },
    {
      id: "A-bar",
      pathData: "M 180,270 L 320,270",
      startLabel: "3",
    },
  ],
  // Fallback for t, p, etc.
  t: [
    {
      id: "t-stem",
      pathData: "M 250,90 L 250,360 C 250,405 280,410 310,405",
      startLabel: "1",
    },
    {
      id: "t-cross",
      pathData: "M 180,180 L 320,180",
      startLabel: "2",
    },
  ],
  p: [
    {
      id: "p-stem",
      pathData: "M 180,110 L 180,430",
      startLabel: "1",
    },
    {
      id: "p-loop",
      pathData: "M 180,150 C 220,130 320,140 320,240 C 320,330 220,330 180,310",
      startLabel: "2",
    },
  ],
};

const BRUSH_COLORS = [
  { name: "Indigo", value: "#4F46E5" },
  { name: "Emerald", value: "#10B981" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Purple", value: "#8B5CF6" },
];

export default function VectorRailTracing({
  character,
  guideHint = "Follow the star along the curves of the letter!",
  onComplete,
}: VectorRailTracingProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hiddenPathRef = useRef<SVGPathElement | null>(null);

  const strokes = LETTER_PATHS[character] || LETTER_PATHS.s;
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState<number[]>(() => strokes.map(() => 0));
  const [isTracing, setIsTracing] = useState(false);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].value);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  // Sampled points along the current stroke
  const sampledPathPoints = useRef<{ x: number; y: number; dist: number }[]>([]);
  const totalPathLength = useRef(0);

  // Sample the active stroke path whenever it changes
  useEffect(() => {
    const hiddenPath = hiddenPathRef.current;
    if (!hiddenPath) return;

    const currentDef = strokes[activeStrokeIdx];
    hiddenPath.setAttribute("d", currentDef.pathData);
    const length = hiddenPath.getTotalLength();
    totalPathLength.current = length;

    const pts: { x: number; y: number; dist: number }[] = [];
    const numSamples = 120;
    for (let i = 0; i <= numSamples; i++) {
      const d = (i / numSamples) * length;
      const p = hiddenPath.getPointAtLength(d);
      pts.push({ x: p.x, y: p.y, dist: d });
    }
    sampledPathPoints.current = pts;
  }, [character, activeStrokeIdx, strokes]);

  const getSVGPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = 500 / rect.width;
    const scaleY = 500 / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (hasCompleted) return;
    if ("touches" in e) e.stopPropagation();

    const pt = getSVGPoint(e);
    const samples = sampledPathPoints.current;
    if (samples.length === 0) return;

    // Check if touch is near the current progress position (within comfortable 55px corridor)
    const currentDist = strokeProgress[activeStrokeIdx] || 0;
    const currentSampleIdx = Math.min(
      Math.floor((currentDist / (totalPathLength.current || 1)) * samples.length),
      samples.length - 1
    );
    const targetPt = samples[currentSampleIdx] || samples[0];

    const distFromTarget = Math.hypot(pt.x - targetPt.x, pt.y - targetPt.y);

    if (distFromTarget <= 65) {
      setIsTracing(true);
      setHintMessage(null);
    } else {
      // Finger touched too far away (e.g. attempting to draw across like a T)
      soundFx.playRetryBoing();
      setHintMessage("Start at the glowing star and trace along the curve!");
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTracing || hasCompleted) return;
    if ("touches" in e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const pt = getSVGPoint(e);
    const samples = sampledPathPoints.current;
    const totalLen = totalPathLength.current;
    if (samples.length === 0 || totalLen === 0) return;

    const currentDist = strokeProgress[activeStrokeIdx] || 0;
    const currentSampleIdx = Math.min(
      Math.floor((currentDist / totalLen) * samples.length),
      samples.length - 1
    );

    // Look ahead within a narrow forward window (up to +12 sample steps)
    const maxLookahead = Math.min(currentSampleIdx + 14, samples.length - 1);
    let bestDist = Infinity;
    let bestSampleIdx = currentSampleIdx;

    for (let i = currentSampleIdx; i <= maxLookahead; i++) {
      const sp = samples[i];
      const d = Math.hypot(pt.x - sp.x, pt.y - sp.y);
      if (d < bestDist) {
        bestDist = d;
        bestSampleIdx = i;
      }
    }

    // STRICT RAIL CONSTRAINT:
    // User finger must remain within 48px of the forward curve rail!
    // If they draw perpendicular (like a "T" across an "S"), bestDist will exceed 48px, so it refuses to advance!
    if (bestDist <= 50 && bestSampleIdx > currentSampleIdx) {
      const advancedDist = samples[bestSampleIdx].dist;
      setStrokeProgress((prev) => {
        const next = [...prev];
        next[activeStrokeIdx] = advancedDist;
        return next;
      });

      // Check if current stroke reached the end!
      if (bestSampleIdx >= samples.length - 2) {
        // Complete this stroke
        setStrokeProgress((prev) => {
          const next = [...prev];
          next[activeStrokeIdx] = totalLen;
          return next;
        });

        if (activeStrokeIdx < strokes.length - 1) {
          // Advance to next stroke (e.g. for letter A)
          soundFx.playSuccessChime();
          setActiveStrokeIdx((prev) => prev + 1);
          setIsTracing(false);
          setHintMessage(`Stroke ${activeStrokeIdx + 1} complete! Now trace stroke ${activeStrokeIdx + 2}.`);
        } else {
          // All strokes complete! Mastery!
          setIsTracing(false);
          setHasCompleted(true);
          soundFx.playSuccessChime();
          soundFx.playHooray();
          triggerFullScreenConfetti();
          setHintMessage("Tracing Mastered! Beautiful handwriting! ⭐");
          if (onComplete) onComplete();
        }
      }
    }
  };

  const handlePointerUp = () => {
    setIsTracing(false);
  };

  const handleReset = () => {
    soundFx.playRetryBoing();
    setActiveStrokeIdx(0);
    setStrokeProgress(strokes.map(() => 0));
    setHasCompleted(false);
    setIsTracing(false);
    setHintMessage(null);
  };

  const handleHearSound = () => {
    soundFx.speakPhoneme(character);
  };

  // Compute current star position along active stroke
  const currentActiveLen = strokeProgress[activeStrokeIdx] || 0;
  const currentTotalLen = totalPathLength.current || 1;
  const samples = sampledPathPoints.current;
  const sampleIdx = Math.min(
    Math.floor((currentActiveLen / currentTotalLen) * samples.length),
    samples.length - 1
  );
  const currentStarPos = samples[sampleIdx] || samples[0] || { x: 250, y: 250 };

  // Overall completion percentage
  const totalOverallLength = strokes.length * 100;
  const currentOverallSum = strokeProgress.reduce((acc, p, idx) => {
    const len = idx === activeStrokeIdx ? totalPathLength.current || 1 : 100;
    return acc + Math.min((p / len) * 100, 100);
  }, 0);
  const overallPercentage = Math.round((currentOverallSum / totalOverallLength) * 100);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <button
          type="button"
          onClick={handleHearSound}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-950 hover:bg-amber-200 font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-amber-800" />
          <span>Hear Sound</span>
        </button>

        {/* Brush Colors */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {BRUSH_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setBrushColor(c.value)}
              className={`w-7 h-7 rounded-xl transition-all transform cursor-pointer ${
                brushColor === c.value ? "scale-115 ring-3 ring-slate-900 shadow-md" : "hover:scale-105 opacity-80"
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          title="Reset Tracing"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Real-time Rail Progress Meter */}
      <div className="w-full mb-3 px-2 flex items-center justify-between gap-3">
        <div className="flex-1 bg-slate-200 rounded-full h-3.5 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-150 rounded-full"
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700 whitespace-nowrap">
          {overallPercentage}% Traced {hasCompleted ? "⭐" : ""}
        </span>
      </div>

      {/* SVG Rail Container */}
      <div className="relative w-full aspect-4/3 max-h-[380px] bg-white rounded-3xl border-4 border-dashed border-indigo-300 shadow-xl overflow-hidden select-none touch-none">
        {/* Hidden path used strictly for native SVG arc calculations */}
        <svg className="hidden" aria-hidden="true">
          <path ref={hiddenPathRef} d="" />
        </svg>

        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="w-full h-full cursor-pointer select-none"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
          {/* Paper Writing Rule Lines */}
          <line x1="20" y1="110" x2="480" y2="110" stroke="#E2E8F0" strokeWidth="2.5" />
          <line x1="20" y1="260" x2="480" y2="260" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="20" y1="410" x2="480" y2="410" stroke="#64748B" strokeWidth="3" />

          {/* Background Letter Rail Track (Dashed Corridor) */}
          {strokes.map((stroke, idx) => (
            <path
              key={`track-${stroke.id}`}
              d={stroke.pathData}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="56"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Inner Dashed Guideline */}
          {strokes.map((stroke, idx) => (
            <path
              key={`dashed-${stroke.id}`}
              d={stroke.pathData}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="4"
              strokeDasharray="10 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Completed / Active Inked Trail */}
          {strokes.map((stroke, idx) => {
            const isCurrent = idx === activeStrokeIdx;
            const progressDist = strokeProgress[idx] || 0;
            const totalLen = isCurrent ? totalPathLength.current || 1 : 1000;

            return (
              <path
                key={`ink-${stroke.id}`}
                d={stroke.pathData}
                fill="none"
                stroke={brushColor}
                strokeWidth="48"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: isCurrent ? `${progressDist} ${totalLen}` : progressDist > 0 ? "1000 0" : "0 1000",
                  transition: "none",
                }}
              />
            );
          })}

          {/* Glowing Animated Follow-Star (Target position on rail) */}
          {!hasCompleted && currentStarPos && (
            <g transform={`translate(${currentStarPos.x}, ${currentStarPos.y})`}>
              <circle r="22" fill="#FDE047" opacity="0.4" className="animate-ping" />
              <circle r="18" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" shadow-lg="true" />
              <text textAnchor="middle" dy="5" fontSize="14" fontWeight="900" fill="#78350F">
                ⭐
              </text>
            </g>
          )}

          {/* Numbered Start Markers on Each Stroke */}
          {strokes.map((stroke, idx) => {
            if (strokeProgress[idx] > 20) return null;
            // Get starting point from path data
            const match = stroke.pathData.match(/M\s*([\d.]+)[,\s]+([\d.]+)/);
            if (!match) return null;
            const startX = parseFloat(match[1]);
            const startY = parseFloat(match[2]);

            return (
              <g key={`start-badge-${stroke.id}`} transform={`translate(${startX}, ${startY})`}>
                <circle r="14" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                <text textAnchor="middle" dy="4" fontSize="12" fontWeight="900" fill="#FFFFFF">
                  {stroke.startLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {overallPercentage === 0 && (
          <div className="absolute inset-x-0 bottom-4 text-center pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-bold backdrop-blur-xs shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {guideHint}
            </span>
          </div>
        )}
      </div>

      {/* Guidance Feedback */}
      {hintMessage && (
        <div
          className={`w-full mt-3 p-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
            hasCompleted
              ? "bg-emerald-50 border border-emerald-300 text-emerald-900"
              : "bg-amber-50 border border-amber-200 text-amber-900"
          }`}
        >
          {hasCompleted ? (
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <RefreshCcw className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span>{hintMessage}</span>
        </div>
      )}

      {/* Completion Status */}
      <div className="w-full mt-4 flex justify-center">
        <div
          className={`px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg flex items-center gap-2.5 transition-all ${
            hasCompleted
              ? "bg-emerald-600 text-white ring-4 ring-emerald-200"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{hasCompleted ? "Tracing Mastered! ⭐" : "Follow the Star to Complete"}</span>
        </div>
      </div>
    </div>
  );
}
