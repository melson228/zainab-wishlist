"use client";

import { useEffect, useState } from "react";

type Props = {
  itemTitle: string;
  open: boolean;
  busy?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

export function ReserveModal({
  itemTitle,
  open,
  busy,
  error,
  onClose,
  onConfirm,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-md rounded-3xl p-6 animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rose-deep)]">
          Бронирование
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl">
          {itemTitle}
        </h3>
        <p className="mt-2 text-[var(--muted)]">
          Напишите своё имя — так Зайнаб поймёт, кто взял подарок.
        </p>

        <label className="mt-5 block">
          <span className="field-label">Ваше имя</span>
          <input
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Например, Айгуль"
            autoFocus
          />
        </label>

        {error ? (
          <p className="mt-3 text-sm text-[var(--rose-deep)]">{error}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn-primary"
            disabled={busy || name.trim().length < 2}
            onClick={() => onConfirm(name.trim())}
          >
            {busy ? "Бронируем…" : "Забронировать"}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
