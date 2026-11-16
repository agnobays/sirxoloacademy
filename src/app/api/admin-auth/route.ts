import { NextResponse } from "next/server";

// Hardcoded emergency fallback PIN if env variable is not set yet
// Mr. Xolo can customize ADMIN_PIN in .env.local or DirectAdmin environment variables!
const DEFAULT_ADMIN_PIN = "7860";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pin } = body;

    const expectedPin = process.env.ADMIN_PIN || DEFAULT_ADMIN_PIN;

    if (!pin || pin.trim() !== expectedPin.trim()) {
      return NextResponse.json(
        { success: false, error: "Incorrect Security PIN" },
        { status: 401 }
      );
    }

    // Generate session token valid for this session
    const sessionToken = Buffer.from(`xolo_admin_${Date.now()}_${Math.random()}`).toString("base64");

    const response = NextResponse.json({ success: true });
    // Set secure HTTP-only session cookie
    response.cookies.set("xolo_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, loggedOut: true });
  response.cookies.delete("xolo_admin_session");
  return response;
}
