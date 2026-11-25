import { isAdmin } from "@/lib/auth";
import { createItem, listItems } from "@/lib/store";

export async function GET() {
  const items = await listItems();
  const admin = await isAdmin();

  return Response.json(
    items.map((item) => ({
      ...item,
      reservedBy: admin || !item.reservedBy ? item.reservedBy : "Забронировано",
    })),
  );
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    title?: string;
    description?: string;
    imageUrl?: string;
    productUrl?: string;
  } | null;

  if (!body?.title?.trim()) {
    return Response.json({ error: "Укажите название" }, { status: 400 });
  }

  const item = await createItem({
    title: body.title.trim(),
    description: body.description?.trim() || "",
    imageUrl: body.imageUrl?.trim() || "",
    productUrl: body.productUrl?.trim() || "",
  });

  return Response.json(item, { status: 201 });
}
