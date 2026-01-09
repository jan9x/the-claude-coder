import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "data", "newsletter.csv");

async function ensureDirectoryExists() {
  const dir = path.dirname(CSV_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function getExistingEmails(): Promise<Set<string>> {
  try {
    const content = await fs.readFile(CSV_PATH, "utf-8");
    const emails = content
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.split(",")[0].toLowerCase());
    return new Set(emails);
  } catch {
    return new Set();
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 }
      );
    }

    await ensureDirectoryExists();

    const existingEmails = await getExistingEmails();

    if (existingEmails.has(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "Email already subscribed" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const line = `${email},${timestamp}\n`;

    await fs.appendFile(CSV_PATH, line);

    return NextResponse.json(
      { success: true, message: "Successfully subscribed!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { success: false, message: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
