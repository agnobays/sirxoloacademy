import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // 1. Multipart Form Data (Audio Blob Upload from microphone)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const soundKey = (formData.get("soundKey") as string)?.toLowerCase().trim();
      const file = formData.get("audio") as File | null;

      if (!soundKey || !file) {
        return NextResponse.json({ error: "Missing soundKey or audio file" }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save file as .webm or .mp3
      const ext = file.type.includes("mp3") ? "mp3" : "webm";
      const fileName = `xolo_${soundKey}.${ext}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/audio/voice-studio/${fileName}?t=${Date.now()}`;

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
