"use client";

import { useMemo, useState } from "react";
import type { EventSettings, WishlistItem } from "@/lib/types";
import { ReserveModal } from "./ReserveModal";
import { Reveal } from "./Reveal";
import { WishlistCard } from "./WishlistCard";

type Props = {
  settings: EventSettings;
  initialItems: WishlistItem[];
};

export function PublicWishlist({ settings, initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [selected, setSelected] = useState<WishlistItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const available = useMemo(
    () => items.filter((item) => !item.reservedBy).length,
    [items],
  );

  async function confirmReserve(name: string) {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/items/${selected.id}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось забронировать");
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.id === selected.id
            ? { ...item, reservedBy: data.reservedBy || "Забронировано" }
            : item,
        ),
      );
      setSelected(null);
    } catch {
      setError("Сеть недоступна, попробуйте ещё раз");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-8 sm:pt-10">
        <Reveal className="mb-10 text-center sm:mb-12">
          <p className="section-kicker">Подарки</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[2.2rem] font-medium tracking-wide sm:text-5xl">
            Вишлист
          </h2>
          <p className="mt-3 text-sm text-[var(--muted)] sm:text-base">
            Свободно: {available} из {items.length}
          </p>
          <span className="ornament-line mt-5 !animate-none opacity-100 sm:mt-6" />
        </Reveal>

        {items.length === 0 ? (
          <Reveal
            delay={120}
            className="invite-panel rounded-[24px] px-6 py-12 text-center text-sm text-[var(--muted)] sm:rounded-[30px] sm:px-8 sm:py-14 sm:text-base"
          >
            Пока здесь пусто — желания скоро появятся.
          </Reveal>
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal
                key={item.id}
                delay={Math.min(index, 6) * 90}
                className="h-full min-w-0"
              >
                <WishlistCard item={item} onReserve={setSelected} />
              </Reveal>
            ))}
          </div>
        )}

        {settings.notes ? (
          <Reveal className="mt-14 text-center text-sm leading-relaxed text-[var(--muted)]">
            {settings.notes}
          </Reveal>
        ) : null}
      </section>

      <ReserveModal
        open={Boolean(selected)}
        itemTitle={selected?.title || ""}
        busy={busy}
        error={error}
        onClose={() => {
          setSelected(null);
          setError(null);
        }}
        onConfirm={confirmReserve}
      />
    </>
  );
}
