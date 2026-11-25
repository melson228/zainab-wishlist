import { connection } from "next/server";
import { Suspense } from "react";
import { EventDetails } from "@/components/EventDetails";
import { NameUnderline } from "@/components/NameUnderline";
import { PublicWishlist } from "@/components/PublicWishlist";
import { scriptFont } from "@/lib/fonts";
import { getSettings, listItems } from "@/lib/store";

async function HomeContent() {
  await connection();
  const [settings, items] = await Promise.all([getSettings(), listItems()]);

  const publicItems = items.map((item) => ({
    ...item,
    reservedBy: item.reservedBy ? "Забронировано" : null,
  }));

  const hasDetails = Boolean(
    settings.address || settings.datetime || settings.mapUrl,
  );

  return (
    <>
      <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-16 sm:px-8">
        <div className="pointer-events-none absolute -left-20 top-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,#ffd6e2,transparent_70%)] soft-float" />
        <div className="pointer-events-none absolute -right-16 bottom-28 h-60 w-60 rounded-full bg-[radial-gradient(circle,#ccebff,transparent_70%)] soft-float" />

        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <p
            className={`${scriptFont.className} hero-in hero-in-1 mx-auto leading-none text-[var(--ink)]`}
            style={{
              whiteSpace: "nowrap",
              fontSize: "clamp(1.85rem, 9vw, 3.75rem)",
            }}
          >
            Марсель&nbsp;<span className="ampersand">&</span>&nbsp;Зайнаб
          </p>

          <NameUnderline className="mt-1 sm:mt-1.5" />

          <h1 className="hero-in hero-in-3 mt-6 font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,4.2rem)] font-medium tracking-[0.04em] text-[var(--ink)] sm:mt-7">
            {settings.title || "Gender Party"}
          </h1>

          <p className="hero-in hero-in-4 mx-auto mt-4 max-w-[20rem] text-[0.95rem] leading-relaxed text-[var(--muted)] sm:mt-5 sm:max-w-md sm:text-lg">
            {settings.subtitle ||
              "Помогите нам подготовиться к встрече малыша"}
          </p>
        </div>

        <a
          href={hasDetails ? "#details" : "#wishlist"}
          className="scroll-hint absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-[var(--muted)]"
          aria-label="Листайте вниз"
        >
          <span className="scroll-hint-arrow" />
        </a>
      </header>

      <EventDetails settings={settings} />

      <div id="wishlist">
        <PublicWishlist settings={settings} initialItems={publicItems} />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center text-[var(--muted)]">
          Загружаем…
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
