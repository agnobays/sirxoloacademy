import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const configPath = path.join(process.cwd(), "data", "voice_settings.json");
const uploadDir = path.join(process.cwd(), "public", "audio", "voice-studio");

function ensureSettingsFile() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(configPath)) {
    // Initial default settings: All default to "default" voice
    const initialConfig = {
      activeSources: {
        a: "default",
        b: "default",
        c: "default",
        d: "default",
        e: "default",
        correct: "default",
        retry: "default",
      },
      customRecordings: {},
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(configPath, JSON.stringify(initialConfig, null, 2), "utf-8");
  }
}

// GET: Retrieve voice studio settings
export async function GET() {
  try {
    ensureSettingsFile();
    const raw = fs.readFileSync(configPath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

// POST: Save or toggle voice source, or upload recorded audio blob
export async function POST(req: Request) {
  try {
    ensureSettingsFile();
    const contentType = req.headers.get("content-type") || "";

    // 1. Multipart Form Data (Audio Blob or Uploaded File)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const soundKey = (formData.get("soundKey") as string)?.toLowerCase().trim();
      const file = formData.get("audio") as File | null;

      if (!soundKey || !file) {
        return NextResponse.json({ error: "Missing soundKey or audio file" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Determine extension of the incoming payload
      const originalName = file.name || "";
      const parsedExt = path.extname(originalName).replace(".", "").toLowerCase();
      const rawExt = parsedExt || (file.type.includes("mp4") ? "m4a" : file.type.includes("wav") ? "wav" : file.type.includes("mp3") ? "mp3" : "webm");

      const tempRawFileName = `temp_${soundKey}_${Date.now()}.${rawExt}`;
      const tempRawFilePath = path.join(uploadDir, tempRawFileName);
      fs.writeFileSync(tempRawFilePath, buffer);

      // Desired standard output: xolo_${soundKey}.mp3 (universal 100% browser compatibility)
      const mp3FileName = `xolo_${soundKey}.mp3`;
      const mp3FilePath = path.join(uploadDir, mp3FileName);

      let finalFileName = mp3FileName;
      let conversionSucceeded = false;

      // Convert via ffmpeg with volume normalization if ffmpeg is available
      try {
        // -y overwrite, loudnorm for clear audible voice, 44.1kHz mono 128k
        execSync(
          `ffmpeg -y -i "${tempRawFilePath}" -af "loudnorm=I=-16:TP=-1.5:LRA=11" -ar 44100 -ac 1 -b:a 128k "${mp3FilePath}"`,
          { timeout: 15000, stdio: "ignore" }
        );
        if (fs.existsSync(mp3FilePath) && fs.statSync(mp3FilePath).size > 500) {
          conversionSucceeded = true;
          finalFileName = mp3FileName;
        }
      } catch (convErr) {
        console.warn("FFmpeg conversion not available or failed, falling back to original format:", convErr);
      }

      if (conversionSucceeded) {
        try {
          fs.unlinkSync(tempRawFilePath);
        } catch {}
      } else {
        // Fallback: save as xolo_${soundKey}.${rawExt}
        finalFileName = `xolo_${soundKey}.${rawExt}`;
        const fallbackPath = path.join(uploadDir, finalFileName);
        fs.renameSync(tempRawFilePath, fallbackPath);
      }

      const publicUrl = `/audio/voice-studio/${finalFileName}?t=${Date.now()}`;

      // Update voice_settings.json
      const raw = fs.readFileSync(configPath, "utf-8");
      const config = JSON.parse(raw);
      if (!config.customRecordings) config.customRecordings = {};
      if (!config.activeSources) config.activeSources = {};

      config.customRecordings[soundKey] = publicUrl;
      // Auto-publish to Mr. Xolo's voice when uploaded
      config.activeSources[soundKey] = "xolo";
      config.lastUpdated = new Date().toISOString();

      fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

      return NextResponse.json({
        success: true,
        soundKey,
        url: publicUrl,
        activeSource: "xolo",
        format: conversionSucceeded ? "mp3" : rawExt,
      });
    }

    // 2. JSON: Toggle voice source between "default" and "xolo"
    const body = await req.json();
    const { soundKey, source } = body;

    if (!soundKey || !source) {
      return NextResponse.json({ error: "Missing soundKey or source" }, { status: 400 });
    }

    const raw = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);
    if (!config.activeSources) config.activeSources = {};

    config.activeSources[soundKey.toLowerCase().trim()] = source === "xolo" ? "xolo" : "default";
    config.lastUpdated = new Date().toISOString();

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      soundKey,
      activeSource: config.activeSources[soundKey.toLowerCase().trim()],
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
