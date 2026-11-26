"use client";

import type { WishlistItem } from "@/lib/types";

type Props = {
  item: WishlistItem;
  onReserve: (item: WishlistItem) => void;
};

export function WishlistCard({ item, onReserve }: Props) {
  const reserved = Boolean(item.reservedBy);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] invite-panel transition duration-500 hover:-translate-y-1">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[var(--bg-deep)]">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--muted)]">
            Без фото
          </div>
        )}
        {reserved ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(58,48,50,0.42)]">
            <span className="rounded-full bg-[var(--pearl)] px-4 py-2 text-sm font-medium tracking-wide text-[var(--ink)]">
              Уже забронировано
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-[family-name:var(--font-display)] text-2xl font-medium leading-tight">
          {item.title}
        </h3>
        {item.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
            {item.description}
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
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
            <span className="inline-flex items-center px-2 py-2 text-sm text-[var(--sage)]">
              Спасибо
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
