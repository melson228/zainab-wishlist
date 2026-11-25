import type { EventSettings } from "@/lib/types";
import { Map2Gis } from "./Map2Gis";
import { Reveal } from "./Reveal";

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
    <section id="details" className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
      <Reveal className="mb-8 text-center sm:mb-10">
        <p className="section-kicker">Детали</p>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-[2.2rem] font-medium tracking-wide sm:text-5xl">
          Ждём вас
        </h2>
        <span className="ornament-line mt-5 !animate-none opacity-100 sm:mt-6" />
      </Reveal>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {when ? (
          <Reveal className="invite-panel rounded-[24px] px-6 py-7 text-center sm:rounded-[30px] sm:px-7 sm:py-8 md:text-left">
            <p className="section-kicker">Когда</p>
            <p className="mt-4 font-[family-name:var(--font-display)] text-xl capitalize leading-snug sm:text-3xl">
              {when}
            </p>
          </Reveal>
        ) : null}

        {settings.address ? (
          <Reveal
            delay={120}
            className="invite-panel rounded-[24px] px-6 py-7 text-center sm:rounded-[30px] sm:px-7 sm:py-8 md:text-left"
          >
            <p className="section-kicker">Куда приехать</p>
            <p className="mt-4 font-[family-name:var(--font-display)] text-2xl leading-snug sm:text-3xl">
              {settings.address}
            </p>
            {settings.mapUrl ? (
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost mt-6 !py-2 text-sm"
              >
                Открыть в 2ГИС
              </a>
            ) : null}
          </Reveal>
        ) : null}
      </div>

      {settings.mapUrl ? (
        <Reveal delay={180} className="mt-5">
          <Map2Gis mapUrl={settings.mapUrl} />
        </Reveal>
      ) : null}
    </section>
  );
}
