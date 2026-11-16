// Voice Studio Registry Cache & Dynamic Sound URL Resolver
export interface VoiceConfig {
  activeSources: Record<string, "default" | "xolo">;
  customRecordings: Record<string, string>;
  lastUpdated?: string;
}

let cachedVoiceConfig: VoiceConfig | null = null;
let isFetching = false;

// Sentence & Prompt to Sound Key mapping for native isiZulu lessons & stories
export const TEXT_TO_VOICE_KEY: Record<string, string> = {
  // isiZulu Story Sentences (Inja Yami uBobi)
  "lena inja yami. igama layo ngubobi.": "zulu_story_1",
  "lena inja yami igama layo ngubobi": "zulu_story_1",
  "ubobi uyagijima egcekeni. ubobi uyathanda ukudlala.": "zulu_story_2",
  "ubobi uyagijima egcekeni ubobi uyathanda ukudlala": "zulu_story_2",
  "ubobi uyabukeka ejabule kakhulu. ngiyayithanda inja yami!": "zulu_story_3",
  "ubobi uyabukeka ejabule kakhulu ngiyayithanda inja yami": "zulu_story_3",

  // Syllable building blocks (Izakhi)
  "ba, be, bi, bo, bu": "zulu_blend_ba",
  "ba be bi bo bu": "zulu_blend_ba",

  // isiZulu Prompts & Questions
  "bangaki onkamisa besizulu?": "zulu_quiz_1",
  "bangaki onkamisa besizulu": "zulu_quiz_1",
  "igama elithi 'amaqanda' liqala ngamuphi onkamisa?": "zulu_quiz_2",
  "igama elithi amaqanda liqala ngamuphi onkamisa": "zulu_quiz_2",
  "iyiphi inhlamvu ekhuluma umsindo othi /a/?": "zulu_act_1",
  "iyiphi inhlamvu ekhuluma umsindo othi a?": "zulu_act_1",
  "bhala onkamisa 'a' ngomunwe wakho!": "zulu_act_trace_a",
  "bhala onkamisa a ngomunwe wakho": "zulu_act_trace_a",
};

export function getMappedVoiceKey(text: string): string | null {
  if (!text) return null;
  const normalized = text.trim().toLowerCase().replace(/\s+/g, " ");
  if (TEXT_TO_VOICE_KEY[normalized]) return TEXT_TO_VOICE_KEY[normalized];

  const stripped = normalized.replace(/[^a-z0-9 ]/g, "").trim();
  if (TEXT_TO_VOICE_KEY[stripped]) return TEXT_TO_VOICE_KEY[stripped];

  return null;
}

export async function getVoiceConfig(): Promise<VoiceConfig> {
  if (typeof window === "undefined") {
    return { activeSources: {}, customRecordings: {} };
  }

  if (cachedVoiceConfig) return cachedVoiceConfig;

  if (!isFetching) {
    isFetching = true;
    try {
      const res = await fetch("/api/voice-studio", { cache: "no-store" });
      if (res.ok) {
        cachedVoiceConfig = await res.json();
      }
    } catch {
      // Fallback
    } finally {
      isFetching = false;
    }
  }

  return cachedVoiceConfig || { activeSources: {}, customRecordings: {} };
}

export function updateLocalVoiceConfig(newConfig: VoiceConfig) {
  cachedVoiceConfig = newConfig;
}

// Get the resolved URL for a letter sound, sentence, or feedback (checks Mr. Xolo's voice override first)
export async function resolveSoundUrl(soundKeyOrText: string): Promise<string> {
  const mappedKey = getMappedVoiceKey(soundKeyOrText);
  const targetKey = mappedKey || soundKeyOrText;
  const clean = targetKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");

  const config = await getVoiceConfig();

  // If Mr. Xolo's voice is selected and recorded, return his voice recording
  if (config.activeSources?.[clean] === "xolo" && config.customRecordings?.[clean]) {
    return config.customRecordings[clean];
  }

  // Default sound paths
  if (clean === "correct" || clean === "hooray") {
    return "/audio/hooray.mp3";
  }

  // Letters (a-z)
  if (clean.length === 1 && /^[a-z]$/.test(clean)) {
    return `/audio/phonics/${clean}.mp3`;
  }

  return "";
}
