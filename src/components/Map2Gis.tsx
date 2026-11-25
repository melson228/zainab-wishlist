"use client";

import { useEffect, useRef } from "react";
import { parse2gisCoords } from "@/lib/map2gis";

type Props = {
  mapUrl: string;
  address?: string;
};

declare global {
  interface Window {
    DGWidgetLoader?: new (options: Record<string, unknown>) => void;
  }
}

function loadWidgetScript(): Promise<void> {
  if (window.DGWidgetLoader) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-dg-widget-loader="true"]',
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.DGWidgetLoader) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("2GIS loader error")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://widgets.2gis.com/js/DGWidgetLoader.js";
    script.async = true;
    script.charset = "utf-8";
    script.dataset.dgWidgetLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("2GIS loader error"));
    document.body.appendChild(script);
  });
}

export function Map2Gis({ mapUrl, address }: Props) {
  const coords = parse2gisCoords(mapUrl);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!coords || !hostRef.current) return;

    let cancelled = false;
    const host = hostRef.current;
    host.innerHTML = "";

    (async () => {
      try {
        await loadWidgetScript();
        if (cancelled || !window.DGWidgetLoader) return;

        // Виджет вставляется рядом с этим script-тегом
        const boot = document.createElement("script");
        boot.charset = "utf-8";
        host.appendChild(boot);

        new window.DGWidgetLoader({
          width: "100%",
          height: 360,
          borderColor: "#f3d5de",
          pos: {
            lat: coords.lat,
            lon: coords.lon,
            zoom: coords.zoom || 16,
          },
          org: [],
        });
      } catch {
        if (!cancelled && host) {
          host.innerHTML =
            '<p style="padding:24px;color:#6d5a66;font-size:14px">Не удалось встроить карту. Откройте её кнопкой выше.</p>';
        }
      }
    })();

    return () => {
      cancelled = true;
      host.innerHTML = "";
    };
  }, [coords?.lat, coords?.lon, coords?.zoom]);

  if (!mapUrl) return null;

  return (
    <div className="invite-panel overflow-hidden rounded-[30px]">
      <div className="flex flex-wrap items-end justify-between gap-3 p-6 pb-4">
        <div>
          <p className="section-kicker">Карта 2ГИС</p>
          {address ? (
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl leading-snug">
              {address}
            </p>
          ) : (
            <p className="mt-2 text-[var(--muted)]">Место проведения</p>
          )}
        </div>
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !py-2 !px-4 text-sm"
        >
          Открыть в 2ГИС
        </a>
      </div>

      {coords ? (
        <div ref={hostRef} className="min-h-[360px] w-full overflow-hidden bg-[var(--sage-soft)]" />
      ) : (
        <div className="border-t border-[var(--line)] px-6 py-8 text-sm text-[var(--muted)]">
          Нажмите «Открыть в 2ГИС». Чтобы карта появилась здесь, скопируйте
          ссылку через «Поделиться» в 2ГИС — в ней обычно есть координаты{" "}
          <code className="rounded bg-[var(--pearl)] px-1">?m=...</code>.
        </div>
      )}
    </div>
  );
}
