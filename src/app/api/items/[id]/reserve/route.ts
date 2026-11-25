import { isAdmin } from "@/lib/auth";
import { reserveItem, unreserveItem } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Ctx) {
  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    name?: string;
  } | null;

  const name = body?.name?.trim();
  if (!name || name.length < 2) {
    return Response.json(
      { error: "Введите имя (минимум 2 символа)" },
      { status: 400 },
    );
  }

  const result = await reserveItem(id, name);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 409 });
  }

  return Response.json({
    ...result.item,
    reservedBy: "Забронировано",
  });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await unreserveItem(id);
  if (!item) {
    return Response.json({ error: "Не найдено" }, { status: 404 });
  }

  return Response.json(item);
}
