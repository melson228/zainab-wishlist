"use client";

import { useMemo, useState } from "react";
import type { EventSettings, WishlistItem } from "@/lib/types";
import { ReserveModal } from "./ReserveModal";
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
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 animate-rise">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl">
              Вишлист
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              Свободно: {available} из {items.length}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="card-surface rounded-[28px] p-10 text-center text-[var(--muted)]">
            Пока здесь пусто — Зайнаб скоро добавит желания.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-rise"
                style={{ animationDelay: `${Math.min(index, 8) * 0.05}s` }}
              >
                <WishlistCard item={item} onReserve={setSelected} />
              </div>
            ))}
          </div>
        )}

        {settings.notes ? (
          <p className="mt-12 text-center text-sm text-[var(--muted)]">
            {settings.notes}
          </p>
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
