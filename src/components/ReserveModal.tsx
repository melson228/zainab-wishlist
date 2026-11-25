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
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(58,48,50,0.35)] p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="invite-panel w-full max-w-md rounded-[28px] p-6 hero-in"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="section-kicker">Бронирование</p>
        <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-medium">
          {itemTitle}
        </h3>
        <p className="mt-2 text-[var(--muted)]">
          Напишите своё имя — так будет понятно, кто взял подарок.
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
          <p className="mt-3 text-sm text-[var(--blush)]">{error}</p>
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
