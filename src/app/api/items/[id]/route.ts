import { isAdmin } from "@/lib/auth";
import { deleteItem, updateItem } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    imageUrl?: string;
    productUrl?: string;
  } | null;

  if (!body) {
    return Response.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const item = await updateItem(id, {
    title: body.title?.trim(),
    description: body.description?.trim(),
    imageUrl: body.imageUrl?.trim(),
    productUrl: body.productUrl?.trim(),
  });

  if (!item) {
    return Response.json({ error: "Не найдено" }, { status: 404 });
  }

  return Response.json(item);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await deleteItem(id);
  if (!ok) {
    return Response.json({ error: "Не найдено" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
