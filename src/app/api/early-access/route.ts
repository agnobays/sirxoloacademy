import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDbPool, initDatabase } from "@/lib/db";

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
  savedToMySQL?: boolean;
}

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf-8");
  }
}

function saveLocalBackup(record: RegistrationRecord) {
  try {
    ensureDataFile();
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const records: RegistrationRecord[] = JSON.parse(fileContent);
    records.push(record);
    fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
  } catch (err) {
    console.error("Local backup write failed:", err);
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

    const recordId = "reg_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    let savedToMySQL = false;

    // 1. Attempt MySQL insertion
    try {
      await initDatabase();
      const pool = getDbPool();
      const insertQuery = `
        INSERT INTO parent_registrations 
        (id, parent_name, email, phone, child_name, child_age, subjects, workbook_interest, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await pool.execute(insertQuery, [
        recordId,
        String(parentName).trim(),
        String(email).trim().toLowerCase(),
        String(phone).trim(),
        String(childName || "").trim(),
        String(childAge || "").trim(),
        JSON.stringify(Array.isArray(subjects) ? subjects : []),
        Boolean(workbookInterest),
        notes ? String(notes).trim() : null,
      ]);
      savedToMySQL = true;
    } catch (dbErr) {
      console.warn("MySQL insert notice (fallback to local backup enabled):", dbErr);
    }

    // 2. Always persist a local JSON backup as well
    const record: RegistrationRecord = {
      id: recordId,
      parentName: String(parentName).trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      childName: String(childName || "").trim(),
      childAge: String(childAge || "").trim(),
      subjects: Array.isArray(subjects) ? subjects : [],
      workbookInterest: Boolean(workbookInterest),
      notes: notes ? String(notes).trim() : undefined,
      createdAt: new Date().toISOString(),
      savedToMySQL,
    };

    saveLocalBackup(record);

    // 3. Send email notification to preapplicattion@sirxoloacademy.co.za
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: "mail.sirxoloacademy.co.za",
        port: 587,
        secure: false,
        auth: {
          user: "preapplicattion@sirxoloacademy.co.za",
          pass: "HgTvABMZrV8jL42JLKPy",
        },
        tls: { rejectUnauthorized: false },
      });

      const subsList = Array.isArray(subjects) ? subjects.join(", ") : "All 3 Subjects";
      await transporter.sendMail({
        from: '"Sir Xolo Academy" <preapplicattion@sirxoloacademy.co.za>',
        to: "preapplicattion@sirxoloacademy.co.za",
        subject: `New Pre-Registration: ${parentName} (Learner: ${childName || "Child"})`,
        text: `NEW PRE-REGISTRATION RECEIVED

Parent: ${parentName}
Email: ${email}
Phone/WhatsApp: ${phone}

Learner: ${childName || "Not specified"}
Age: ${childAge || "Not specified"}
Subjects: ${subsList}
Workbook Interest: ${workbookInterest ? "YES" : "No"}
Notes: ${notes || "None"}

Date: ${new Date().toLocaleString("en-ZA")}
Registration ID: ${recordId}`,
      });
    } catch (mailErr) {
      console.warn("Email alert notice:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for registering! We have secured your spot for early access.",
      id: recordId,
      savedToDb: savedToMySQL,
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
    try {
      await initDatabase();
      const pool = getDbPool();
      const [rows] = await pool.query("SELECT * FROM parent_registrations ORDER BY created_at DESC");
      return NextResponse.json({
        success: true,
        source: "mysql",
        data: rows,
      });
    } catch (mysqlErr) {
      ensureDataFile();
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const records: RegistrationRecord[] = JSON.parse(fileContent);
      return NextResponse.json({
        success: true,
        source: "file_backup",
        count: records.length,
        data: records,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to read records." }, { status: 500 });
  }
}
