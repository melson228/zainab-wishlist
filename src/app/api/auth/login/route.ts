import { createSession, getAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;

  if (!body?.password || body.password !== getAdminPassword()) {
    return Response.json({ error: "Неверный пароль" }, { status: 401 });
  }

  await createSession();
  return Response.json({ ok: true });
}
