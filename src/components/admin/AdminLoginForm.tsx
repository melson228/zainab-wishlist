"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Ошибка входа");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Не удалось войти");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card-surface mx-auto w-full max-w-md rounded-[28px] p-7">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rose-deep)]">
        Для Зайнаб
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl">
        Вход в кабинет
      </h1>
      <p className="mt-2 text-[var(--muted)]">
        Здесь можно менять адрес, время и карточки вишлиста.
      </p>

      <label className="mt-6 block">
        <span className="field-label">Пароль</span>
        <input
          className="field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Введите пароль"
          required
        />
      </label>

      {error ? <p className="mt-3 text-sm text-[var(--rose-deep)]">{error}</p> : null}

      <button type="submit" className="btn-primary mt-6 w-full" disabled={busy}>
        {busy ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}
