import { connection } from "next/server";
import { Suspense } from "react";
import { EventDetails } from "@/components/EventDetails";
import { PublicWishlist } from "@/components/PublicWishlist";
import { getSettings, listItems } from "@/lib/store";

async function HomeContent() {
  await connection();
  const [settings, items] = await Promise.all([getSettings(), listItems()]);

  const publicItems = items.map((item) => ({
    ...item,
    reservedBy: item.reservedBy ? "Забронировано" : null,
  }));

  return (
    <>
      <header className="relative overflow-hidden">
        <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center px-5 py-16 sm:px-8">
          <div className="max-w-2xl animate-rise">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--rose-deep)]">
              {settings.hostName || "Зайнаб"}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl leading-[1.05] sm:text-7xl">
              <span className="brand-gradient">{settings.title || "Gender Party"}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
              {settings.subtitle ||
                "Помогите нам подготовиться к встрече малыша"}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#wishlist" className="btn-primary">
                Смотреть вишлист
              </a>
              {(settings.address || settings.datetime || settings.mapUrl) && (
                <a href="#details" className="btn-ghost">
                  Адрес и время
                </a>
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute right-[-40px] top-16 hidden h-64 w-64 rounded-full bg-[radial-gradient(circle,#ffc3d4,transparent_70%)] blur-2xl animate-float md:block" />
          <div className="pointer-events-none absolute bottom-10 right-24 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,#bfe4f5,transparent_70%)] blur-2xl animate-float md:block" />
        </div>
      </header>

      <EventDetails settings={settings} />

      <div id="wishlist">
        <PublicWishlist settings={settings} initialItems={publicItems} />
      </div>

      <footer className="px-5 pb-10 text-center text-sm text-[var(--muted)]">
        С любовью · {settings.hostName || "Зайнаб"}
      </footer>
    </>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
          Загружаем вишлист…
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
