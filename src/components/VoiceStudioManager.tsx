"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Play,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Sparkles,
  ShieldCheck,
  Radio,
  UploadCloud,
  Check,
  AlertCircle,
} from "lucide-react";
import { VoiceConfig, updateLocalVoiceConfig } from "@/utils/voiceRegistry";

interface VoiceItemDef {
  key: string;
  name: string;
  sublabel: string;
  category: "isizulu" | "feedback";
  sampleScript: string;
  defaultAudioUrl: string;
}

const VOICE_ITEMS: VoiceItemDef[] = [
  {
    key: "a",
    name: "Inhlamvu 'A' (Onkamisa)",
    sublabel: "isiZulu Vowel /a/ sound",
    category: "isizulu",
    sampleScript: "Say clearly: 'Ah... Ah... Amaqanda'",
    defaultAudioUrl: "/audio/phonics/a.mp3",
  },
  {
    key: "b",
    name: "Inhlamvu 'B' (Ongwaqa)",
    sublabel: "isiZulu Consonant /b/ sound",
    category: "isizulu",
    sampleScript: "Say clearly: 'Buh... Buh... Ubaba'",
    defaultAudioUrl: "/audio/phonics/b.mp3",
  },
  {
    key: "c",
    name: "Inhlamvu 'C' (Uchwaza Click)",
    sublabel: "isiZulu Dental Click /c/ sound",
    category: "isizulu",
    sampleScript: "Make crisp dental click: 'C... C... Icula'",
    defaultAudioUrl: "/audio/phonics/c.mp3",
  },
  {
    key: "d",
    name: "Inhlamvu 'D' (Ongwaqa)",
    sublabel: "isiZulu Consonant /d/ sound",
    category: "isizulu",
    sampleScript: "Say clearly: 'Duh... Duh... Idada'",
    defaultAudioUrl: "/audio/phonics/d.mp3",
  },
  {
    key: "e",
    name: "Inhlamvu 'E' (Onkamisa)",
    sublabel: "isiZulu Vowel /e/ sound",
    category: "isizulu",
    sampleScript: "Say clearly: 'Eh... Eh... Ekhaya'",
    defaultAudioUrl: "/audio/phonics/e.mp3",
  },
  {
    key: "correct",
    name: "Praise & Correct Answer Audio",
    sublabel: "Celebration sound when a child gets it right",
    category: "feedback",
    sampleScript: "Say with high energy: 'Halala! Kuhle kakhulu! You got it right!'",
    defaultAudioUrl: "/audio/hooray.mp3",
  },
  {
    key: "retry",
    name: "Encouraging Retry Audio",
    sublabel: "Gentle motivation when a child needs another try",
    category: "feedback",
    sampleScript: "Say gently: 'Zama futhi mfundi wami! Try one more time, you can do it!'",
    defaultAudioUrl: "",
  },
];

export default function VoiceStudioManager() {
  const [config, setConfig] = useState<VoiceConfig>({
    activeSources: {},
    customRecordings: {},
  });
  const [loading, setLoading] = useState(true);
  const [recordingKey, setRecordingKey] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState<"isizulu" | "feedback">("isizulu");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [previewPlayingKey, setPreviewPlayingKey] = useState<string | null>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load configuration from API
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/voice-studio");
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        updateLocalVoiceConfig(data);
      }
    } catch {
      console.warn("Could not fetch voice settings");
    } finally {
      setLoading(false);
    }
  };

  // Start recording from device microphone
  const startRecording = async (soundKey: string) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }

      // Explicitly request microphone stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });

      audioChunksRef.current = [];

      // Determine best audio mime type supported by this browser/phone
      let mimeType = "";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const recordedBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });

        // Immediately create a local Object URL for instant zero-latency playback
        const localBlobUrl = URL.createObjectURL(recordedBlob);
        setConfig((prev) => ({
          ...prev,
          customRecordings: { ...prev.customRecordings, [soundKey]: localBlobUrl },
        }));

        await uploadRecording(soundKey, recordedBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);

      setRecordingKey(soundKey);
      setRecordingSeconds(0);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Microphone error: ${msg}. Please ensure your browser has microphone permission enabled.`);
    }
  };

  // Stop recording and process upload
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setRecordingKey(null);
  };

  // Upload recorded audio file to server
  const uploadRecording = async (soundKey: string, blob: Blob) => {
    try {
      setStatusMessage(`Saving Mr. Xolo's voice for ${soundKey.toUpperCase()}...`);
      const formData = new FormData();
      formData.append("soundKey", soundKey);
      formData.append("audio", blob, `xolo_${soundKey}.webm`);

      const res = await fetch("/api/voice-studio", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // Update local state
        setConfig((prev) => {
          const updated = {
            ...prev,
            activeSources: { ...prev.activeSources, [soundKey]: "xolo" },
            customRecordings: { ...prev.customRecordings, [soundKey]: data.url },
          };
          updateLocalVoiceConfig(updated);
          return updated;
        });
        setStatusMessage(`Successfully saved & published Mr. Xolo's voice for ${soundKey.toUpperCase()}! ⭐`);
        setTimeout(() => setStatusMessage(null), 4000);
      }
    } catch {
      setStatusMessage("Upload failed. Please check network connection.");
    }
  };

  // Toggle published voice source between Default and Mr. Xolo
  const handleToggleSource = async (soundKey: string, source: "default" | "xolo") => {
    try {
      // Optimistic update
      setConfig((prev) => {
        const updated = {
          ...prev,
          activeSources: { ...prev.activeSources, [soundKey]: source },
        };
        updateLocalVoiceConfig(updated);
        return updated;
      });

      const res = await fetch("/api/voice-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ soundKey, source }),
      });

      if (res.ok) {
        setStatusMessage(
          source === "xolo"
            ? `Now playing Mr. Xolo's voice for ${soundKey.toUpperCase()}!`
            : `Reverted ${soundKey.toUpperCase()} to standard default audio.`
        );
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch {
      console.warn("Failed to switch audio source");
    }
  };

  // Play audio preview
  const playAudio = (url: string, key: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    setPreviewPlayingKey(key);

    audio.onended = () => setPreviewPlayingKey(null);
    audio.onerror = () => setPreviewPlayingKey(null);

    audio.play().catch(() => setPreviewPlayingKey(null));
  };

  const filteredItems = VOICE_ITEMS.filter((item) => item.category === activeTab);

  return (
    <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
      {/* Studio Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-purple-700 animate-pulse" />
            <span>Voice Studio • Mr. Xolo Authentic Recordings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Mr. Xolo Voice Studio</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Live Safe-Switching Active
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Record each sound directly using your phone or laptop microphone. You can test your recording and switch between <strong>Mr. Xolo&apos;s Voice</strong> and the <strong>Default Audio</strong> at any time with a single click!
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab("isizulu")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "isizulu"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            isiZulu Sounds (A, B, C, D, E)
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "feedback"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Praise & Corrections
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-950 font-bold text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Voice Items Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const hasCustomRecording = Boolean(config.customRecordings?.[item.key]);
          const currentSource = config.activeSources?.[item.key] || "default";
          const isRecordingThis = recordingKey === item.key;
          const isPlayingThis = previewPlayingKey === item.key;

          return (
            <div
              key={item.key}
              className={`p-5 sm:p-6 rounded-3xl border-2 transition-all ${
                currentSource === "xolo"
                  ? "bg-purple-50/50 border-purple-300 shadow-sm"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">{item.name}</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        currentSource === "xolo"
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      Active: {currentSource === "xolo" ? "⭐ Mr. Xolo's Voice" : "Default Audio"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{item.sublabel}</p>
                  <p className="text-xs text-indigo-900 bg-white/80 border border-indigo-100 px-3 py-1.5 rounded-xl font-bold inline-block">
                    🎙️ <span className="text-slate-500 font-normal">Script to say:</span> &ldquo;{item.sampleScript}&rdquo;
                  </p>
                </div>

                {/* Right Controls */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {/* Record Button */}
                  {!isRecordingThis ? (
                    <button
                      type="button"
                      onClick={() => startRecording(item.key)}
                      disabled={recordingKey !== null}
                      className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                      <span>{hasCustomRecording ? "Re-Record Voice" : "Record Voice"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-5 py-2.5 rounded-2xl bg-slate-900 text-rose-400 font-black text-xs uppercase tracking-wider animate-pulse flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Square className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>Stop & Save ({recordingSeconds}s)</span>
                    </button>
                  )}

                  {/* Play Mr. Xolo's Recording */}
                  {hasCustomRecording && (
                    <button
                      type="button"
                      onClick={() => playAudio(config.customRecordings[item.key], item.key)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold border-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                        isPlayingThis
                          ? "bg-purple-600 text-white border-purple-600 shadow-md"
                          : "bg-purple-100 hover:bg-purple-200 text-purple-950 border-purple-200"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play My Voice</span>
                    </button>
                  )}

                  {/* Play Default Audio */}
                  {item.defaultAudioUrl && (
                    <button
                      type="button"
                      onClick={() => playAudio(item.defaultAudioUrl, `default-${item.key}`)}
                      className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Play Default</span>
                    </button>
                  )}

                  {/* Publish Switch Toggle */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleToggleSource(item.key, "default")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentSource === "default"
                          ? "bg-white text-slate-900 shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Default
                    </button>

                    <button
                      type="button"
                      disabled={!hasCustomRecording}
                      onClick={() => handleToggleSource(item.key, "xolo")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        currentSource === "xolo"
                          ? "bg-purple-600 text-white shadow-xs"
                          : hasCustomRecording
                          ? "text-purple-700 hover:bg-purple-100"
                          : "text-slate-300 cursor-not-allowed"
                      }`}
                      title={!hasCustomRecording ? "Record your voice first to publish" : ""}
                    >
                      Mr. Xolo Voice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
