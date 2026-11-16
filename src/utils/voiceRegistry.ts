// Voice Studio Registry Cache
export interface VoiceConfig {
  activeSources: Record<string, "default" | "xolo">;
  customRecordings: Record<string, string>;
  lastUpdated?: string;
}

let cachedVoiceConfig: VoiceConfig | null = null;
let isFetching = false;

export async function getVoiceConfig(): Promise<VoiceConfig> {
  if (typeof window === "undefined") {
    return { activeSources: {}, customRecordings: {} };
  }

  // Return cached if present
  if (cachedVoiceConfig) return cachedVoiceConfig;

  if (!isFetching) {
    isFetching = true;
    try {
      const res = await fetch("/api/voice-studio", { cache: "no-store" });
      if (res.ok) {
        cachedVoiceConfig = await res.json();
      }
    } catch {
      // Fallback to default
    } finally {
      isFetching = false;
    }
  }

  return cachedVoiceConfig || { activeSources: {}, customRecordings: {} };
}

export function updateLocalVoiceConfig(newConfig: VoiceConfig) {
  cachedVoiceConfig = newConfig;
}

// Get the resolved URL for a letter sound or feedback (checks Mr. Xolo's voice override first)
export async function resolveSoundUrl(soundKey: string): Promise<string> {
  const clean = soundKey.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
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
  return `/audio/phonics/${clean}.mp3`;
}
