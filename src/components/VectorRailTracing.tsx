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

// Normalized vector splines on a 600x400 viewBox (Landscape, with generous margins)
// Top line at Y=75, Midline at Y=195, Baseline at Y=315
const LETTER_PATHS: Record<string, StrokeDef[]> = {
  s: [
    {
      id: "s-curve",
      pathData: "M 355,120 C 320,80 235,80 225,145 C 215,200 295,215 315,245 C 350,295 330,325 240,310",
      startLabel: "1",
    },
  ],
  A: [
    {
      id: "A-left",
      pathData: "M 300,85 L 210,315",
      startLabel: "1",
    },
    {
      id: "A-right",
      pathData: "M 300,85 L 390,315",
      startLabel: "2",
    },
    {
      id: "A-bar",
      pathData: "M 245,215 L 355,215",
      startLabel: "3",
    },
  ],
  t: [
    {
      id: "t-stem",
      pathData: "M 300,80 L 300,285 C 300,315 320,320 345,315",
      startLabel: "1",
    },
    {
      id: "t-cross",
      pathData: "M 240,150 L 360,150",
      startLabel: "2",
    },
  ],
  p: [
    {
      id: "p-stem",
      pathData: "M 240,95 L 240,350",
      startLabel: "1",
    },
    {
      id: "p-loop",
      pathData: "M 240,115 C 275,100 360,110 360,195 C 360,270 275,270 240,255",
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
  guideHint = "Follow the glowing star along the curves of the letter!",
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

    const currentDef = strokes[activeStrokeIdx] || strokes[0];
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

  // W3C Standard screen-to-SVG coordinates transformation
  const getSVGPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };

    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;

    const ctm = svg.getScreenCTM();
    if (ctm) {
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    }

    const rect = svg.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * 600,
      y: ((clientY - rect.top) / rect.height) * 400,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (hasCompleted) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored if capture unsupported
    }

    const pt = getSVGPoint(e.clientX, e.clientY);
    const samples = sampledPathPoints.current;
    if (samples.length === 0) return;

    const currentDist = strokeProgress[activeStrokeIdx] || 0;
    const currentSampleIdx = Math.min(
      Math.floor((currentDist / (totalPathLength.current || 1)) * samples.length),
      samples.length - 1
    );
    const targetPt = samples[currentSampleIdx] || samples[0];

    const distFromTarget = Math.hypot(pt.x - targetPt.x, pt.y - targetPt.y);

    // Generous 75px start area so mobile fingers easily grab the star
    if (distFromTarget <= 75) {
      setIsTracing(true);
      setHintMessage(null);
    } else {
      soundFx.playRetryBoing();
      setHintMessage("Touch the glowing star ⭐ to begin tracing!");
    }
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isTracing || hasCompleted) return;

    const pt = getSVGPoint(e.clientX, e.clientY);
    const samples = sampledPathPoints.current;
    const totalLen = totalPathLength.current;
    if (samples.length === 0 || totalLen === 0) return;

    const currentDist = strokeProgress[activeStrokeIdx] || 0;
    const currentSampleIdx = Math.min(
      Math.floor((currentDist / totalLen) * samples.length),
      samples.length - 1
    );

    // Look ahead within a forward window
    const maxLookahead = Math.min(currentSampleIdx + 18, samples.length - 1);
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

    // Corridors: must be within 55px of the forward curve (accommodates mobile thumbs)
    if (bestDist <= 55 && bestSampleIdx > currentSampleIdx) {
      const advancedDist = samples[bestSampleIdx].dist;
      setStrokeProgress((prev) => {
        const next = [...prev];
        next[activeStrokeIdx] = advancedDist;
        return next;
      });

      // Check if current stroke reached the end
      if (bestSampleIdx >= samples.length - 2) {
        setStrokeProgress((prev) => {
          const next = [...prev];
          next[activeStrokeIdx] = totalLen;
          return next;
        });

        if (activeStrokeIdx < strokes.length - 1) {
          soundFx.playSuccessChime();
          setActiveStrokeIdx((prev) => prev + 1);
          setIsTracing(false);
          setHintMessage(`Stroke ${activeStrokeIdx + 1} complete! Now follow stroke ${activeStrokeIdx + 2} ⭐`);
        } else {
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

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsTracing(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
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

  // Compute current star position
  const currentActiveLen = strokeProgress[activeStrokeIdx] || 0;
  const currentTotalLen = totalPathLength.current || 1;
  const samples = sampledPathPoints.current;
  const sampleIdx = Math.min(
    Math.floor((currentActiveLen / currentTotalLen) * samples.length),
    samples.length - 1
  );
  const currentStarPos = samples[sampleIdx] || samples[0] || { x: 300, y: 200 };

  // Overall percentage
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

      {/* SVG Rail Container - 600x400 Landscape, Fully Fitted, Never Cut Off */}
      <div className="relative w-full aspect-[6/4] bg-white rounded-3xl border-4 border-dashed border-indigo-300 shadow-xl select-none touch-none overflow-hidden">
        {/* Hidden path for exact SVG length math */}
        <svg className="hidden" aria-hidden="true">
          <path ref={hiddenPathRef} d="" />
        </svg>

        <svg
          ref={svgRef}
          viewBox="0 0 600 400"
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full cursor-pointer select-none touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Paper Writing Rule Lines */}
          <line x1="30" y1="75" x2="570" y2="75" stroke="#E2E8F0" strokeWidth="2.5" />
          <line x1="30" y1="195" x2="570" y2="195" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="30" y1="315" x2="570" y2="315" stroke="#64748B" strokeWidth="3" />

          {/* Background Letter Rail Track (Dashed Corridor) */}
          {strokes.map((stroke) => (
            <path
              key={`track-${stroke.id}`}
              d={stroke.pathData}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="58"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Inner Dashed Guideline */}
          {strokes.map((stroke) => (
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

          {/* Inked Liquid Trail */}
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
                strokeWidth="50"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: isCurrent ? `${progressDist} ${totalLen}` : progressDist > 0 ? "1000 0" : "0 1000",
                  transition: "none",
                }}
              />
            );
          })}

          {/* Glowing Animated Follow-Star */}
          {!hasCompleted && currentStarPos && (
            <g transform={`translate(${currentStarPos.x}, ${currentStarPos.y})`}>
              <circle r="24" fill="#FDE047" opacity="0.45" className="animate-ping" />
              <circle r="18" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
              <text textAnchor="middle" dy="5" fontSize="14" fontWeight="900" fill="#78350F">
                ⭐
              </text>
            </g>
          )}

          {/* Numbered Start Markers on Each Stroke */}
          {strokes.map((stroke, idx) => {
            if (strokeProgress[idx] > 20) return null;
            const match = stroke.pathData.match(/M\s*([\d.]+)[,\s]+([\d.]+)/);
            if (!match) return null;
            const startX = parseFloat(match[1]);
            const startY = parseFloat(match[2]);

            return (
              <g key={`start-badge-${stroke.id}`} transform={`translate(${startX}, ${startY})`}>
                <circle r="15" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
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
