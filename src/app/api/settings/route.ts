import { isAdmin } from "@/lib/auth";
import { normalizeMapUrl } from "@/lib/map2gis";
import { getSettings, updateSettings } from "@/lib/store";
import type { EventSettings } from "@/lib/types";

export async function GET() {
  const settings = await getSettings();
  return Response.json(settings);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Partial<EventSettings> | null;
  if (!body) {
    return Response.json({ error: "Некорректные данные" }, { status: 400 });
  }

  const settings = await updateSettings({
    hostName: body.hostName?.trim(),
    title: body.title?.trim(),
    subtitle: body.subtitle?.trim(),
    address: body.address?.trim(),
    datetime: body.datetime?.trim(),
    mapUrl:
      body.mapUrl !== undefined ? normalizeMapUrl(body.mapUrl) : undefined,
    notes: body.notes?.trim(),
  });

  return Response.json(settings);
}
