import type { EventSettings } from "@/lib/types";
import { Map2Gis } from "./Map2Gis";

function formatWhen(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function EventDetails({ settings }: { settings: EventSettings }) {
  const when = formatWhen(settings.datetime);
  const hasDetails = Boolean(settings.address || when || settings.mapUrl);

  if (!hasDetails) return null;

  return (
    <section id="details" className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div className="grid gap-4 md:grid-cols-2">
        {when ? (
          <div className="card-surface rounded-[28px] p-7 animate-rise">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rose-deep)]">
              Когда
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl capitalize">
              {when}
            </p>
          </div>
        ) : null}

        {settings.address ? (
          <div className="card-surface rounded-[28px] p-7 animate-rise-delay">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--sky)]">
              Куда приехать
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-2xl leading-snug">
              {settings.address}
            </p>
            {settings.mapUrl ? (
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-5 !py-2 text-sm"
              >
                Открыть в 2ГИС
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {settings.mapUrl ? (
        <div className="mt-4">
          <Map2Gis mapUrl={settings.mapUrl} />
        </div>
      ) : null}
    </section>
  );
}
