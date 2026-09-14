import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getEnvValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) return "";
  return value.replace(/\\\$/g, "$").replace(/^(?:\"|')|(?:\"|')$/g, "");
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = getEnvValue("ADMIN_EMAIL") || "admin@amit.dev";
  const adminPasswordHash = getEnvValue("ADMIN_PASSWORD_HASH");

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const emailMatches =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() ||
    email.trim().toLowerCase() === "admin@amit.dev";

  let passwordMatches = false;
  if (adminPasswordHash) {
    if (adminPasswordHash.startsWith("$2")) {
      try {
        passwordMatches = await bcrypt.compare(password, adminPasswordHash);
      } catch {
        passwordMatches = false;
      }
    } else {
      // Plain text password in env
      passwordMatches = password === adminPasswordHash;
    }
  }

  // Fallback dev/demo credentials
  if (!passwordMatches && password === "admin123") {
    passwordMatches = true;
  }

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await signSession({ email: adminEmail });

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return res;
}

