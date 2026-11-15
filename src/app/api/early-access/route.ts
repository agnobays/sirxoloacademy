import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "early_registrations.json");

interface RegistrationRecord {
  id: string;
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  childAge: string;
  subjects: string[];
  workbookInterest: boolean;
  notes?: string;
  createdAt: string;
}

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { parentName, email, phone, childName, childAge, subjects, workbookInterest, notes } = body;

    if (!parentName || !email || !phone) {
      return NextResponse.json(
        { error: "Parent name, email, and WhatsApp/phone number are required." },
        { status: 400 }
      );
    }

    ensureDataFile();

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records: RegistrationRecord[] = JSON.parse(fileContent);

    const newRecord: RegistrationRecord = {
      id: "reg_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      parentName: String(parentName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      childName: String(childName || "").trim(),
      childAge: String(childAge || "").trim(),
      subjects: Array.isArray(subjects) ? subjects : [],
      workbookInterest: Boolean(workbookInterest),
      notes: notes ? String(notes).trim() : undefined,
      createdAt: new Date().toISOString(),
    };

    records.push(newRecord);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Thank you for registering! We have secured your spot for early access.",
      id: newRecord.id,
    });
  } catch (error) {
    console.error("Error saving early registration:", error);
    return NextResponse.json(
      { error: "Failed to save registration. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    ensureDataFile();
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records: RegistrationRecord[] = JSON.parse(fileContent);

    return NextResponse.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read records." }, { status: 500 });
  }
}
