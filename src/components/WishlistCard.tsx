"use client";

import type { WishlistItem } from "@/lib/types";

type Props = {
  item: WishlistItem;
  onReserve: (item: WishlistItem) => void;
};

export function WishlistCard({ item, onReserve }: Props) {
  const reserved = Boolean(item.reservedBy);

  return (
    <article className="group overflow-hidden rounded-[28px] card-surface transition duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bg-soft)]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--muted)]">
            Без фото
          </div>
        )}
        {reserved ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(42,31,40,0.45)]">
            <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[var(--ink)]">
              Уже забронировано
            </span>
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="font-[family-name:var(--font-display)] text-xl leading-tight">
          {item.title}
        </h3>
        {item.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
            {item.description}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {item.productUrl ? (
            <a
              href={item.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost !px-4 !py-2 text-sm"
            >
              Открыть ссылку
            </a>
          ) : null}

          {!reserved ? (
            <button
              type="button"
              className="btn-primary !px-4 !py-2 text-sm"
              onClick={() => onReserve(item)}
            >
              Забронировать
            </button>
          ) : (
            <span className="inline-flex items-center rounded-full bg-[var(--sky-soft)] px-4 py-2 text-sm font-medium text-[var(--ink)]">
              Спасибо
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
