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

  // Cheerful audio cheer on correct answer ("Hooray!", "Halala!")
  playHooray(isZulu = false) {
    const englishPraise = [
      "Hooray! Well done!",
      "Hooray! You got it right!",
      "Superstar! That is correct!",
      "Hooray! Brilliant job!",
    ];
    const zuluPraise = [
      "Halala! Kuhle kakhulu!",
      "Yebo! Uqinisile!",
      "Halala! Ngiyakubongela!",
    ];

    const list = isZulu ? zuluPraise : englishPraise;
    const praise = list[Math.floor(Math.random() * list.length)];

    // Allow the chime to ring first, then speak cheer
    setTimeout(() => {
      this.speakText(praise, isZulu ? "zu-ZA" : "en-ZA");
    }, 280);
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
      .replace(/\//g, " "); // Strip any remaining forward slashes so "slash" is NEVER uttered
  }

  // Speak a standalone phonics sound (e.g. "s" -> "ssss. Like snake!")
  speakPhoneme(phonemeOrPrompt: string, lang = "en-ZA") {
    const raw = phonemeOrPrompt.trim().toLowerCase().replace(/\//g, "");

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
