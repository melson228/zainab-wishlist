import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "zw_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-only-change-me";
  return new TextEncoder().encode(secret.trim());
}

export function getAdminPassword() {
  return (process.env.ADMIN_PASSWORD || "zainab2026").trim();
}

async function shouldUseSecureCookie() {
  if (process.env.COOKIE_SECURE === "false") return false;
  if (process.env.COOKIE_SECURE === "true") return true;

  const h = await headers();
  const proto = (h.get("x-forwarded-proto") || "").split(",")[0]?.trim();
  if (proto === "https") return true;
  if (proto === "http") return false;

  // Coolify/IP по HTTP — иначе cookie не сохранится и логин «молчит»
  return false;
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: await shouldUseSecureCookie(),
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: await shouldUseSecureCookie(),
    path: "/",
    maxAge: 0,
  });
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
