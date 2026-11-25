export type MapCoords = {
  lat: number;
  lon: number;
  zoom: number;
};

/** Достаёт ссылку, если Зайнаб вставила iframe/HTML из 2ГИС. */
export function normalizeMapUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const iframeSrc = trimmed.match(/src=["']([^"']+)["']/i);
  if (iframeSrc?.[1]) return iframeSrc[1].trim();

  const href = trimmed.match(/href=["']([^"']*2gis[^"']*)["']/i);
  if (href?.[1]) return href[1].trim();

  return trimmed;
}

/** Координаты из типичных ссылок 2ГИС (?m=lon,lat/zoom). */
export function parse2gisCoords(url: string): MapCoords | null {
  try {
    const parsed = new URL(url);
    const m = parsed.searchParams.get("m");
    if (m) {
      const [pair, zoomRaw] = decodeURIComponent(m).split("/");
      const [lon, lat] = pair.split(",").map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const zoom = Number(zoomRaw);
        return { lat, lon, zoom: Number.isFinite(zoom) ? zoom : 16 };
      }
    }

    const ll =
      parsed.searchParams.get("ll") || parsed.searchParams.get("center");
    if (ll) {
      const [lon, lat] = decodeURIComponent(ll).split(",").map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { lat, lon, zoom: 16 };
      }
    }

    // pos из виджета: "lat":43.2,"lon":76.9
    const latMatch = url.match(/"lat"\s*:\s*([-\d.]+)/i);
    const lonMatch = url.match(/"lon"\s*:\s*([-\d.]+)/i);
    if (latMatch && lonMatch) {
      return {
        lat: Number(latMatch[1]),
        lon: Number(lonMatch[1]),
        zoom: 16,
      };
    }
  } catch {
    return null;
  }
  return null;
}
