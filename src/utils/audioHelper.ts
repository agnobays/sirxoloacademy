// Web Audio API Synthesizer & Speech Helper for child-friendly instant feedback

class AudioEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a happy chime for correct answers
  playSuccessChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (major chord arpeggio)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);

      gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + i * 0.08 + 0.35);
    });
  }

  // Gentle low tone for retry
  playRetryBoing() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }

  // Celebration fanfare for mastering a step
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.5);
    });
  }

  // Cheerful audio cheer on correct answer (Plays authentic Hooray audio from YouTube)
  playHooray(isZulu = false) {
    if (typeof window !== "undefined") {
      try {
        const audio = new Audio("/audio/hooray.mp3");
        audio.currentTime = 0;
        const promise = audio.play();
        if (promise !== undefined) {
          promise.catch(() => {
            // fallback if browser autoplay blocked
            const praise = isZulu ? "Halala! Kuhle kakhulu!" : "Hooray! Well done!";
            this.speakText(praise, isZulu ? "zu-ZA" : "en-ZA");
          });
        }
        return;
      } catch (err) {
        // Fallback to speech synthesis
      }
    }

    const praise = isZulu ? "Halala! Kuhle kakhulu!" : "Hooray! Well done!";
    this.speakText(praise, isZulu ? "zu-ZA" : "en-ZA");
  }

  // Convert linguistic phonics notation (e.g. /s/) to child-friendly natural sounds so TTS never reads "slash"
  cleanPhonetics(text: string): string {
    return text
      .replace(/\/s\//gi, " ssss ")
      .replace(/\/a\//gi, " ah ")
      .replace(/\/t\//gi, " tuh ")
      .replace(/\/p\//gi, " puh ")
      .replace(/\/i\//gi, " ih ")
      .replace(/\/n\//gi, " nnnn ")
      .replace(/\/m\//gi, " mmmm ")
      .replace(/\/d\//gi, " duh ")
      .replace(/\/g\//gi, " guh ")
      .replace(/\/o\//gi, " aw ")
      .replace(/\/c\//gi, " kuh ")
      .replace(/\/k\//gi, " kuh ")
      .replace(/\/e\//gi, " eh ")
      .replace(/\/u\//gi, " uh ")
      .replace(/\/r\//gi, " rrr ")
      .replace(/\/h\//gi, " huh ")
      .replace(/\/b\//gi, " buh ")
      .replace(/\/f\//gi, " fff ")
      .replace(/\/l\//gi, " lll ")
      .replace(/\/j\//gi, " juh ")
      .replace(/\/v\//gi, " vvv ")
      .replace(/\/w\//gi, " wuh ")
      .replace(/\/x\//gi, " ks ")
      .replace(/\/y\//gi, " yuh ")
      .replace(/\/z\//gi, " zzz ")
      .replace(/\/sh\//gi, " shhh ")
      .replace(/\/ch\//gi, " ch ")
      .replace(/\/th\//gi, " th ")
      .replace(/(?:\/|\[\s*)([a-z])(?:\/|\s*\])/gi, " $1 ")
      .replace(/[/[\]]/g, " "); // Strip any remaining forward slashes or brackets so "slash" or "bracket" is NEVER uttered
  }

  // Play an array of phoneme sounds in sequence with natural pedagogical pauses
  async playPhonemeSequence(letters: string[]): Promise<void> {
    for (const letter of letters) {
      await this.playRecordedPhoneme(letter);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  // Speak question prompt and seamlessly chain the real recorded phoneme audio
  speakQuestion(promptText: string, targetLetter?: string, lang = "en-ZA") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    // Extract all phonetic notations: supports both slashes (/s/, /a/, /t/) and brackets ([s], [a], [t], [ t ])
    const matches = Array.from(promptText.matchAll(/(?:\/|\[\s*)([a-z])(?:\/|\s*\])/gi));
    const phonemes = matches.map((m) => m[1].toLowerCase());

    // Clean spoken text so it NEVER speaks "slash", "bracket", or robotic words
    let cleanSpoken: string;
    if (phonemes.length > 1) {
      // For blending questions like "Blend the sounds together: /s/ + /a/ + /t/" or "[s] + [a] + [t]"
      cleanSpoken = "Blend the sounds together.";
    } else if (phonemes.length === 1 || targetLetter) {
      // Single letter question (e.g. "Listen to the sound: [s]. Which letter makes this sound?")
      cleanSpoken = promptText
        .replace(/(?:\/|\[\s*)([a-z])(?:\/|\s*\])/gi, "this sound")
        .replace(/[/[\]]/g, " ");
    } else {
      // General instructions, descriptions, or breadcrumbs (no phoneme sound to append)
      cleanSpoken = promptText.replace(/[/[\]]/g, " ");
    }

    const utterance = new SpeechSynthesisUtterance(cleanSpoken);
    utterance.lang = lang;
    utterance.rate = 0.88;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.includes("en-ZA") || v.lang.includes("en-GB"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setTimeout(() => {
        if (phonemes.length > 1) {
          // Play the multiple phonemes in sequence (e.g. s -> a -> t)
          this.playPhonemeSequence(phonemes);
        } else {
          // Only play letter audio IF a target letter or phoneme was explicitly in the question!
          // NEVER fall back to 's' or play unexpected sounds
          const letter = targetLetter || (phonemes.length === 1 ? phonemes[0] : undefined);
          if (letter) {
            this.playRecordedPhoneme(letter);
          }
        }
      }, 180);
    };

    window.speechSynthesis.speak(utterance);
  }

  // Play authentic recorded letter sound file from Sound City Reading
  playRecordedPhoneme(letter: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(false);
        return;
      }

      const clean = letter.trim().toLowerCase().replace(/[^a-z]/g, "");
      if (!clean) {
        resolve(false);
        return;
      }

      const audioPath = `/audio/phonics/${clean}.mp3`;
      const audio = new Audio(audioPath);

      audio.onended = () => {
        resolve(true);
      };

      audio.onerror = () => {
        console.warn(`Could not load /audio/phonics/${clean}.mp3`);
        resolve(false);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn(`Autoplay blocked for ${clean}:`, err);
          resolve(false);
        });
      }
    });
  }

  // Speak a standalone phonics sound (plays authentic recorded MP3, fallback to TTS)
  async speakPhoneme(phonemeOrPrompt: string, lang = "en-ZA") {
    const raw = phonemeOrPrompt.trim().toLowerCase().replace(/[^a-z]/g, "");

    // Try playing authentic recorded audio file first
    if (raw.length === 1 && /^[a-z]$/.test(raw)) {
      const played = await this.playRecordedPhoneme(raw);
      if (played) return;
    }

    const phonemeMap: Record<string, string> = {
      s: "ssss... ssss... like snake!",
      a: "ah... ah... like apple!",
      t: "tuh... tuh... like tiger!",
      p: "puh... puh... like penguin!",
      i: "ih... ih... like igloo!",
      n: "nnnn... nnnn... like nest!",
      m: "mmmm... mmmm... like monkey!",
      d: "duh... duh... like dolphin!",
      opt_s: "ssss... ssss... like snake!",
      "opt-s": "ssss... ssss... like snake!",
    };

    const phoneticSpeech = phonemeMap[raw] || this.cleanPhonetics(phonemeOrPrompt);
    this.speakText(phoneticSpeech, lang);
  }

  // Speak prompt or phonetic sound
  speakText(text: string, lang = "en-ZA") {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const cleanedText = this.cleanPhonetics(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = lang;
    utterance.rate = 0.88; // Slower cadence for foundation learners
    utterance.pitch = 1.1; // Cheerful tone

    // Try finding an English or Zulu voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((v) => v.lang.includes("en-ZA") || v.lang.includes("en-GB"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const soundFx = new AudioEngine();
