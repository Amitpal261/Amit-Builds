import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE = "amit_admin_session";

export type AdminSession = {
  email: string;
};

export async function signSession(payload: AdminSession) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    if (typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

/** Read + verify the session from the cookie store (Server Components / Route Handlers). */
export async function getServerSession(): Promise<AdminSession | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Read + verify the session from a NextRequest (middleware / edge-friendly). */
export async function getSessionFromRequest(req: NextRequest): Promise<AdminSession | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Guard for API route handlers that mutate data. Throws a Response if unauthorized. */
export async function requireAdmin(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  return session;
}
