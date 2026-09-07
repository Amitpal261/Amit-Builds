import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signSession, SESSION_COOKIE } from "@/lib/auth";

function getEnvValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) return "";
  return value.replace(/\\\$/g, "$").replace(/^(?:\"|')|(?:\"|')$/g, "");
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const adminEmail = getEnvValue("ADMIN_EMAIL");
  const adminPasswordHash = getEnvValue("ADMIN_PASSWORD_HASH");

  if (!adminEmail || !adminPasswordHash) {
    return NextResponse.json(
      { error: "Admin account is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH." },
      { status: 500 }
    );
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const emailMatches = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordMatches = emailMatches ? await bcrypt.compare(password, adminPasswordHash) : false;

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
