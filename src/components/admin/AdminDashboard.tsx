"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { EventSettings, WishlistItem } from "@/lib/types";

type Props = {
  settings: EventSettings;
  items: WishlistItem[];
};

type ItemForm = {
  title: string;
  description: string;
  imageUrl: string;
  productUrl: string;
};

const emptyForm: ItemForm = {
  title: "",
  description: "",
  imageUrl: "",
  productUrl: "",
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.readAsDataURL(file);
  });
}

export function AdminDashboard({ settings: initialSettings, items: initialItems }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"items" | "profile">("items");
  const [settings, setSettings] = useState(initialSettings);
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<ItemForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reservedCount = useMemo(
    () => items.filter((item) => item.reservedBy).length,
    [items],
  );

  function flash(text: string) {
    setMessage(text);
    setError(null);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не сохранилось");
        return;
      }
      setSettings(data);
      flash("Профиль события сохранён");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  async function onPickImage(file: File | null) {
    if (!file) return;
    if (file.size > 1_200_000) {
      setError("Фото больше 1.2 МБ — сожмите или вставьте ссылку на картинку");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      setError(null);
    } catch {
      setError("Не удалось загрузить фото");
    }
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const endpoint = editingId ? `/api/items/${editingId}` : "/api/items";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не сохранилось");
        return;
      }

      if (editingId) {
        setItems((prev) => prev.map((item) => (item.id === editingId ? data : item)));
        flash("Карточка обновлена");
      } else {
        setItems((prev) => [data, ...prev]);
        flash("Карточка добавлена");
      }
      setForm(emptyForm);
      setEditingId(null);
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  function startEdit(item: WishlistItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      productUrl: item.productUrl,
    });
    setTab("items");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeItem(id: string) {
    if (!confirm("Удалить эту карточку?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Не удалось удалить");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      flash("Карточка удалена");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  async function clearReserve(id: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/items/${id}/reserve`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось снять бронь");
        return;
      }
      setItems((prev) => prev.map((item) => (item.id === id ? data : item)));
      flash("Бронь снята");
      router.refresh();
    } catch {
      setError("Ошибка сети");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rose-deep)]">
            Кабинет
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl">
            Привет, {settings.hostName || "Зайнаб"}
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            Карточек: {items.length} · Забронировано: {reservedCount}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/" className="btn-ghost">
            Открыть сайт
          </a>
          <button type="button" className="btn-ghost" onClick={logout}>
            Выйти
          </button>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
        <button
          type="button"
          className={tab === "items" ? "btn-primary" : "btn-ghost"}
          onClick={() => setTab("items")}
        >
          Вишлист
        </button>
        <button
          type="button"
          className={tab === "profile" ? "btn-primary" : "btn-ghost"}
          onClick={() => setTab("profile")}
        >
          Адрес и время
        </button>
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl bg-[var(--sky-soft)] px-4 py-3 text-sm">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-[#ffe0e8] px-4 py-3 text-sm text-[var(--rose-deep)]">
          {error}
        </p>
      ) : null}

      {tab === "profile" ? (
        <form onSubmit={saveProfile} className="card-surface mt-6 space-y-4 rounded-[28px] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Профиль события
          </h2>
          <p className="text-sm text-[var(--muted)]">
            Эти данные увидят гости на главной странице.
          </p>

          <label className="block">
            <span className="field-label">Имя</span>
            <input
              className="field"
              value={settings.hostName}
              onChange={(e) => setSettings({ ...settings, hostName: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="field-label">Заголовок</span>
            <input
              className="field"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="field-label">Короткое описание</span>
            <input
              className="field"
              value={settings.subtitle}
              onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="field-label">Адрес</span>
            <input
              className="field"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Город, улица, дом, квартира / ориентир"
            />
          </label>

          <label className="block">
            <span className="field-label">Ссылка на 2ГИС</span>
            <input
              className="field"
              value={settings.mapUrl || ""}
              onChange={(e) => setSettings({ ...settings, mapUrl: e.target.value })}
              placeholder="В 2ГИС: Поделиться → скопировать ссылку"
            />
            <span className="mt-2 block text-xs text-[var(--muted)]">
              Открой место в 2ГИС → Поделиться → вставь ссылку сюда. Можно также
              вставить HTML-код виджета.
            </span>
          </label>

          <label className="block">
            <span className="field-label">Дата и время</span>
            <input
              className="field"
              type="datetime-local"
              value={settings.datetime}
              onChange={(e) => setSettings({ ...settings, datetime: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="field-label">Заметка для гостей</span>
            <textarea
              className="field min-h-28"
              value={settings.notes}
              onChange={(e) => setSettings({ ...settings, notes: e.target.value })}
              placeholder="Например: парковка во дворе, звоните в домофон 42"
            />
          </label>

          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Сохраняем…" : "Сохранить профиль"}
          </button>
        </form>
      ) : (
        <div className="mt-6 space-y-6">
          <form onSubmit={saveItem} className="card-surface space-y-4 rounded-[28px] p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {editingId ? "Редактировать карточку" : "Новая карточка"}
            </h2>

            <label className="block">
              <span className="field-label">Название</span>
              <input
                className="field"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Коляска / боди / игрушка"
              />
            </label>

            <label className="block">
              <span className="field-label">Описание</span>
              <textarea
                className="field min-h-24"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Цвет, размер, комментарий"
              />
            </label>

            <label className="block">
              <span className="field-label">Ссылка на товар</span>
              <input
                className="field"
                value={form.productUrl}
                onChange={(e) => setForm({ ...form, productUrl: e.target.value })}
                placeholder="https://..."
              />
            </label>

            <label className="block">
              <span className="field-label">Ссылка на фото</span>
              <input
                className="field"
                value={form.imageUrl.startsWith("data:") ? "" : form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://... или загрузите файл ниже"
              />
            </label>

            <label className="block">
              <span className="field-label">Или загрузить фото с телефона</span>
              <input
                className="field"
                type="file"
                accept="image/*"
                onChange={(e) => onPickImage(e.target.files?.[0] || null)}
              />
            </label>

            {form.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl}
                alt="Превью"
                className="h-40 w-full rounded-2xl object-cover"
              />
            ) : null}

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn-primary" disabled={busy}>
                {busy ? "Сохраняем…" : editingId ? "Сохранить" : "Добавить"}
              </button>
              {editingId ? (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Отмена
                </button>
              ) : null}
            </div>
          </form>

          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="card-surface flex flex-col gap-4 rounded-[24px] p-4 sm:flex-row sm:items-center"
              >
                <div className="h-24 w-full overflow-hidden rounded-2xl bg-[var(--bg-soft)] sm:w-28">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-[family-name:var(--font-display)] text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    {item.reservedBy
                      ? `Забронировал(а): ${item.reservedBy}`
                      : "Свободно"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-ghost !py-2" onClick={() => startEdit(item)}>
                    Изменить
                  </button>
                  {item.reservedBy ? (
                    <button
                      type="button"
                      className="btn-ghost !py-2"
                      onClick={() => clearReserve(item.id)}
                    >
                      Снять бронь
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn-ghost !py-2 !text-[var(--rose-deep)]"
                    onClick={() => removeItem(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
