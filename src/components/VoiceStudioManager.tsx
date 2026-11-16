"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Play,
  Volume2,
  Sparkles,
  Radio,
  Upload,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { VoiceConfig, updateLocalVoiceConfig } from "@/utils/voiceRegistry";

interface VoiceItemDef {
  key: string;
  name: string;
  sublabel: string;
  category:
    | "isizulu_sentences"
    | "isizulu_vowels"
    | "isizulu_questions"
    | "isizulu_clicks"
    | "feedback"
    | "english";
  sampleScript: string;
  defaultAudioUrl: string;
}

const VOICE_ITEMS: VoiceItemDef[] = [
  // --- ISIZULU SENTENCES & STORIES ---
  {
    key: "zulu_story_1",
    name: "Indaba Page 1 (Inja Yami uBobi)",
    sublabel: "Sentence: 'Lena inja yami. Igama layo nguBobi.'",
    category: "isizulu_sentences",
    sampleScript: "Say with warmth: 'Lena inja yami. Igama layo nguBobi.'",
    defaultAudioUrl: "",
  },
  {
    key: "zulu_story_2",
    name: "Indaba Page 2 (Inja Yami uBobi)",
    sublabel: "Sentence: 'UBobi uyagijima egcekeni. UBobi uyathanda ukudlala.'",
    category: "isizulu_sentences",
    sampleScript: "Say energetically: 'UBobi uyagijima egcekeni. UBobi uyathanda ukudlala.'",
    defaultAudioUrl: "",
  },
  {
    key: "zulu_story_3",
    name: "Indaba Page 3 (Inja Yami uBobi)",
    sublabel: "Sentence: 'UBobi uyabukeka ejabule kakhulu. Ngiyayithanda inja yami!'",
    category: "isizulu_sentences",
    sampleScript: "Say happily: 'UBobi uyabukeka ejabule kakhulu. Ngiyayithanda inja yami!'",
    defaultAudioUrl: "",
  },
  {
    key: "zulu_blend_ba",
    name: "Izakhi Zamagama (Ba - Be - Bi - Bo - Bu)",
    sublabel: "Syllable blending practice sentence",
    category: "isizulu_sentences",
    sampleScript: "Say rhythmically: 'Ba... Be... Bi... Bo... Bu'",
    defaultAudioUrl: "",
  },

  // --- ISIZULU ONKAMISA (VOWELS) ---
  {
    key: "a",
    name: "Onkamisa 'A'",
    sublabel: "isiZulu Vowel /a/ sound",
    category: "isizulu_vowels",
    sampleScript: "Say clearly: 'Ah... Ah... Amaqanda'",
    defaultAudioUrl: "/audio/phonics/a.mp3",
  },
  {
    key: "e",
    name: "Onkamisa 'E'",
    sublabel: "isiZulu Vowel /e/ sound",
    category: "isizulu_vowels",
    sampleScript: "Say clearly: 'Eh... Eh... Ekhaya'",
    defaultAudioUrl: "/audio/phonics/e.mp3",
  },
  {
    key: "i",
    name: "Onkamisa 'I'",
    sublabel: "isiZulu Vowel /i/ sound",
    category: "isizulu_vowels",
    sampleScript: "Say clearly: 'Ee... Ee... Imoto'",
    defaultAudioUrl: "/audio/phonics/i.mp3",
  },
  {
    key: "o",
    name: "Onkamisa 'O'",
    sublabel: "isiZulu Vowel /o/ sound",
    category: "isizulu_vowels",
    sampleScript: "Say clearly: 'Oh... Oh... Ogogo'",
    defaultAudioUrl: "/audio/phonics/o.mp3",
  },
  {
    key: "u",
    name: "Onkamisa 'U'",
    sublabel: "isiZulu Vowel /u/ sound",
    category: "isizulu_vowels",
    sampleScript: "Say clearly: 'Oo... Oo... Ubaba'",
    defaultAudioUrl: "/audio/phonics/u.mp3",
  },

  // --- ISIZULU QUESTIONS & ACTIVITIES ---
  {
    key: "zulu_quiz_1",
    name: "Imibuzo 1: Bangaki onkamisa?",
    sublabel: "Quiz question 1 audio prompt",
    category: "isizulu_questions",
    sampleScript: "Say clearly: 'Bangaki onkamisa besiZulu? Bala kanye nami!'",
    defaultAudioUrl: "",
  },
  {
    key: "zulu_quiz_2",
    name: "Imibuzo 2: Igama elithi 'Amaqanda'",
    sublabel: "Quiz question 2 audio prompt",
    category: "isizulu_questions",
    sampleScript: "Say clearly: 'Igama elithi Amaqanda liqala ngamuphi onkamisa?'",
    defaultAudioUrl: "",
  },
  {
    key: "zulu_act_1",
    name: "Umsebenzi 1: Umsindo /a/",
    sublabel: "Matching activity audio prompt",
    category: "isizulu_questions",
    sampleScript: "Say clearly: 'Iyiphi inhlamvu ekhuluma umsindo othi ah? Njengakwi-Amaqanda!'",
    defaultAudioUrl: "",
  },
  {
    key: "zulu_act_trace_a",
    name: "Umsebenzi 2: Ukubhala onkamisa 'A'",
    sublabel: "Finger tracing audio prompt",
    category: "isizulu_questions",
    sampleScript: "Say warmly: 'Bhala onkamisa A ngomunwe wakho! Landela imigqa yokubhala.'",
    defaultAudioUrl: "",
  },

  // --- ISIZULU CLICKS & CONSONANTS ---
  {
    key: "c",
    name: "Uchwaza 'C' (Dental Click)",
    sublabel: "isiZulu Dental Click /c/ sound",
    category: "isizulu_clicks",
    sampleScript: "Make crisp dental click: 'C... C... Icula'",
    defaultAudioUrl: "/audio/phonics/c.mp3",
  },
  {
    key: "q",
    name: "Uchwaza 'Q' (Palatal Click)",
    sublabel: "isiZulu Palatal Click /q/ sound",
    category: "isizulu_clicks",
    sampleScript: "Make crisp click: 'Q... Q... Iqanda'",
    defaultAudioUrl: "",
  },
  {
    key: "x",
    name: "Uchwaza 'X' (Lateral Click)",
    sublabel: "isiZulu Lateral Click /x/ sound",
    category: "isizulu_clicks",
    sampleScript: "Make crisp side click: 'X... X... Ixoxo'",
    defaultAudioUrl: "",
  },
  {
    key: "b",
    name: "Ongwaqa 'B'",
    sublabel: "isiZulu Consonant /b/ sound",
    category: "isizulu_clicks",
    sampleScript: "Say clearly: 'Buh... Buh... Ubaba'",
    defaultAudioUrl: "/audio/phonics/b.mp3",
  },
  {
    key: "d",
    name: "Ongwaqa 'D'",
    sublabel: "isiZulu Consonant /d/ sound",
    category: "isizulu_clicks",
    sampleScript: "Say clearly: 'Duh... Duh... Idada'",
    defaultAudioUrl: "/audio/phonics/d.mp3",
  },

  // --- PRAISE & ENCOURAGEMENT ---
  {
    key: "correct",
    name: "Praise & Celebration (Halala!)",
    sublabel: "Celebration sound when a child gets it right",
    category: "feedback",
    sampleScript: "Say with high energy: 'Halala! Kuhle kakhulu! You got it right!'",
    defaultAudioUrl: "/audio/hooray.mp3",
  },
  {
    key: "retry",
    name: "Encouraging Retry (Zama Futhi!)",
    sublabel: "Gentle motivation when a child needs another try",
    category: "feedback",
    sampleScript: "Say gently: 'Zama futhi mfundi wami! Try one more time, you can do it!'",
    defaultAudioUrl: "",
  },

  // --- ENGLISH PHONICS ---
  {
    key: "s",
    name: "English Sound /s/",
    sublabel: "Letter 's' phonics sound",
    category: "english",
    sampleScript: "Say clearly: 'Ssss... Ssss... like a snake'",
    defaultAudioUrl: "/audio/phonics/s.mp3",
  },
  {
    key: "t",
    name: "English Sound /t/",
    sublabel: "Letter 't' phonics sound",
    category: "english",
    sampleScript: "Say crisply: 'Tuh... Tuh... like tiger'",
    defaultAudioUrl: "/audio/phonics/t.mp3",
  },
  {
    key: "p",
    name: "English Sound /p/",
    sublabel: "Letter 'p' phonics sound",
    category: "english",
    sampleScript: "Say with pop: 'Puh... Puh... like popcorn'",
    defaultAudioUrl: "/audio/phonics/p.mp3",
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
  const [micLevel, setMicLevel] = useState(0);
  const [activeTab, setActiveTab] = useState<
    | "isizulu_sentences"
    | "isizulu_vowels"
    | "isizulu_questions"
    | "isizulu_clicks"
    | "feedback"
    | "english"
  >("isizulu_sentences");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [previewPlayingKey, setPreviewPlayingKey] = useState<string | null>(null);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  // Start recording from device microphone with real-time level visualizer
  const startRecording = async (soundKey: string) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      setPlaybackError(null);

      // Standard audio options with auto gain control enabled for clear speech capture
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Initialize Web Audio API Analyser for live volume metering
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          audioContextRef.current = audioCtx;
          const sourceNode = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          sourceNode.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolumeMeter = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avg = sum / bufferLength;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            setMicLevel(normalized);
            animFrameRef.current = requestAnimationFrame(updateVolumeMeter);
          };
          updateVolumeMeter();
        }
      } catch (audioCtxErr) {
        console.warn("AudioContext visualizer not supported:", audioCtxErr);
      }

      audioChunksRef.current = [];

      // Determine best audio mime type supported
      let mimeType = "";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
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

        // Clean up visualizer & stream
        if (animFrameRef.current) {
          cancelAnimationFrame(animFrameRef.current);
          animFrameRef.current = null;
        }
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(() => {});
          audioContextRef.current = null;
        }
        setMicLevel(0);
        stream.getTracks().forEach((track) => track.stop());

        // Immediately create a local Object URL for instant playback
        const localBlobUrl = URL.createObjectURL(recordedBlob);
        setConfig((prev) => ({
          ...prev,
          customRecordings: { ...prev.customRecordings, [soundKey]: localBlobUrl },
        }));

        await uploadRecording(soundKey, recordedBlob);
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
      setStatusMessage(`Converting & saving Mr. Xolo's voice for ${soundKey.toUpperCase()}...`);
      const formData = new FormData();
      formData.append("soundKey", soundKey);
      formData.append("audio", blob, `xolo_${soundKey}.webm`);

      const res = await fetch("/api/voice-studio", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
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
      } else {
        setStatusMessage("Save error: Could not save recording.");
      }
    } catch {
      setStatusMessage("Upload failed. Please check network connection.");
    }
  };

  // Upload external audio file directly (e.g. from WhatsApp, Voice Memos, or laptop)
  const handleFileUpload = async (soundKey: string, file: File) => {
    try {
      setStatusMessage(`Uploading & normalizing voice file for ${soundKey.toUpperCase()}...`);
      const formData = new FormData();
      formData.append("soundKey", soundKey);
      formData.append("audio", file, file.name);

      const res = await fetch("/api/voice-studio", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => {
          const updated = {
            ...prev,
            activeSources: { ...prev.activeSources, [soundKey]: "xolo" },
            customRecordings: { ...prev.customRecordings, [soundKey]: data.url },
          };
          updateLocalVoiceConfig(updated);
          return updated;
        });
        setStatusMessage(`Successfully uploaded & published ${soundKey.toUpperCase()}! ⭐`);
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage("Upload failed. Please check file format and try again.");
      }
    } catch {
      setStatusMessage("Upload error. Please try again.");
    }
  };

  // Toggle published voice source between Default and Mr. Xolo
  const handleToggleSource = async (soundKey: string, source: "default" | "xolo") => {
    try {
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

  // Play audio preview with error handling
  const playAudio = async (url: string, key: string) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setPlaybackError(null);
    setPreviewPlayingKey(key);

    try {
      const audio = new Audio(url);
      currentAudioRef.current = audio;

      audio.onended = () => setPreviewPlayingKey(null);
      audio.onerror = () => {
        setPreviewPlayingKey(null);
        setPlaybackError(`Audio playback issue for ${key.toUpperCase()}. Tap the audio player directly or re-record.`);
      };

      await audio.play();
    } catch (playErr) {
      console.warn("Playback prevented or failed:", playErr);
      setPreviewPlayingKey(null);
      setPlaybackError("Tap the audio player directly to listen.");
    }
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
            Record each sound directly using your phone or laptop microphone, or upload a clean voice note from your phone. You can test your recording and switch between <strong>Mr. Xolo&apos;s Voice</strong> and the <strong>Default Audio</strong> at any time!
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab("isizulu_sentences")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "isizulu_sentences"
                ? "bg-white text-purple-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>📖 Imisho & Indaba</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
              4
            </span>
          </button>
          <button
            onClick={() => setActiveTab("isizulu_vowels")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "isizulu_vowels"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🅰️ Onkamisa (A, E, I, O, U)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
              5
            </span>
          </button>
          <button
            onClick={() => setActiveTab("isizulu_questions")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "isizulu_questions"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>❓ Imibuzo (Questions)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 font-bold">
              4
            </span>
          </button>
          <button
            onClick={() => setActiveTab("isizulu_clicks")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "isizulu_clicks"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🗣️ Uchwaza & Ongwaqa</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-900 font-bold">
              5
            </span>
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "feedback"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🎉 Ukubonga (Praise)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              2
            </span>
          </button>
          <button
            onClick={() => setActiveTab("english")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "english"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>🔤 English Phonics</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold">
              3
            </span>
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

      {/* Playback Error Alert */}
      {playbackError && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{playbackError}</span>
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
                <div className="space-y-1.5 flex-1">
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

                  {/* Visual Live Volume Meter while recording */}
                  {isRecordingThis && (
                    <div className="mt-3 p-3 bg-slate-900 rounded-2xl border border-slate-800 text-white space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span>Live Recording: {recordingSeconds}s</span>
                        </span>
                        <span className={micLevel > 5 ? "text-emerald-400" : "text-amber-400 font-semibold"}>
                          {micLevel > 5 ? "🎙️ Voice Detected!" : "⚠️ Silence / Mic Muted?"}
                        </span>
                      </div>

                      {/* VU Meter Bar */}
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 flex">
                        <div
                          className={`h-full rounded-full transition-all duration-75 ${
                            micLevel > 40
                              ? "bg-emerald-400"
                              : micLevel > 5
                              ? "bg-teal-400"
                              : "bg-slate-600"
                          }`}
                          style={{ width: `${Math.max(5, micLevel)}%` }}
                        />
                      </div>
                      {recordingSeconds > 2 && micLevel <= 4 && (
                        <p className="text-[11px] text-amber-300">
                          Tip: We are not detecting audio from your microphone. Make sure your browser microphone is unmuted and speak clearly!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Native Mini Audio Player for 100% reliable preview */}
                  {hasCustomRecording && !isRecordingThis && (
                    <div className="mt-2.5 flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                        Mr. Xolo Voice Track:
                      </span>
                      <audio
                        controls
                        controlsList="nodownload"
                        preload="metadata"
                        src={config.customRecordings[item.key]}
                        className="h-8 w-56 rounded-lg"
                      />
                    </div>
                  )}
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
                      <span>{hasCustomRecording ? "Re-Record Mic" : "Record Mic"}</span>
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

                  {/* Upload Audio File Alternative (Phone Voice Memo / WhatsApp voice note) */}
                  {!isRecordingThis && (
                    <>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.m4a,.wav,.ogg,.aac,.webm"
                        className="hidden"
                        ref={(el) => {
                          fileInputRefs.current[item.key] = el;
                        }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(item.key, file);
                            e.target.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[item.key]?.click()}
                        disabled={recordingKey !== null}
                        className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                        title="Upload a voice memo or audio file from your device"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                        <span>Upload File</span>
                      </button>
                    </>
                  )}

                  {/* Play Mr. Xolo's Recording Button */}
                  {hasCustomRecording && !isRecordingThis && (
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
                  {item.defaultAudioUrl && !isRecordingThis && (
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
                  {!isRecordingThis && (
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
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
