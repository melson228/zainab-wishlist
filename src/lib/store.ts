import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";
import {
  DEFAULT_SETTINGS,
  type EventSettings,
  type StoreData,
  type WishlistItem,
} from "./types";

const STORE_KEY = "zainab-wishlist:v1";

function storeFile() {
  // Amvera: persistenceMount /data. Локально: ./data
  if (process.env.DATA_DIR) {
    return path.join(process.env.DATA_DIR, "store.json");
  }
  if (process.env.NODE_ENV === "production") {
    return path.join("/data", "store.json");
  }
  return path.join(process.cwd(), "data", "store.json");
}

function emptyStore(): StoreData {
  return { settings: { ...DEFAULT_SETTINGS }, items: [] };
}

function hasRedis() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

function redis() {
  return Redis.fromEnv();
}

async function readLocal(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(storeFile(), "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return emptyStore();
  }
}

async function writeLocal(data: StoreData) {
  const file = storeFile();
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

export async function getStore(): Promise<StoreData> {
  if (hasRedis()) {
    const data = await redis().get<StoreData>(STORE_KEY);
    if (!data) return emptyStore();
    return {
      settings: { ...DEFAULT_SETTINGS, ...data.settings },
      items: Array.isArray(data.items) ? data.items : [],
    };
  }
  return readLocal();
}

export async function saveStore(data: StoreData) {
  if (hasRedis()) {
    await redis().set(STORE_KEY, data);
    return;
  }
  await writeLocal(data);
}

export async function getSettings(): Promise<EventSettings> {
  const store = await getStore();
  return store.settings;
}

export async function updateSettings(
  patch: Partial<EventSettings>,
): Promise<EventSettings> {
  const store = await getStore();
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  ) as Partial<EventSettings>;
  store.settings = { ...store.settings, ...cleaned };
  await saveStore(store);
  return store.settings;
}

export async function listItems(): Promise<WishlistItem[]> {
  const store = await getStore();
  return [...store.items].sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1,
  );
}

export async function createItem(
  input: Omit<
    WishlistItem,
    "id" | "reservedBy" | "reservedAt" | "createdAt"
  >,
): Promise<WishlistItem> {
  const store = await getStore();
  const item: WishlistItem = {
    ...input,
    id: crypto.randomUUID(),
    reservedBy: null,
    reservedAt: null,
    createdAt: new Date().toISOString(),
  };
  store.items.unshift(item);
  await saveStore(store);
  return item;
}

export async function updateItem(
  id: string,
  patch: Partial<
    Pick<WishlistItem, "title" | "description" | "imageUrl" | "productUrl">
  >,
): Promise<WishlistItem | null> {
  const store = await getStore();
  const index = store.items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const cleaned = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined),
  ) as typeof patch;
  store.items[index] = { ...store.items[index], ...cleaned };
  await saveStore(store);
  return store.items[index];
}

export async function deleteItem(id: string): Promise<boolean> {
  const store = await getStore();
  const next = store.items.filter((item) => item.id !== id);
  if (next.length === store.items.length) return false;
  store.items = next;
  await saveStore(store);
  return true;
}

export async function reserveItem(
  id: string,
  reservedBy: string,
): Promise<{ ok: true; item: WishlistItem } | { ok: false; error: string }> {
  const store = await getStore();
  const item = store.items.find((entry) => entry.id === id);
  if (!item) return { ok: false, error: "Товар не найден" };
  if (item.reservedBy) return { ok: false, error: "Уже забронировано" };

  item.reservedBy = reservedBy.trim();
  item.reservedAt = new Date().toISOString();
  await saveStore(store);
  return { ok: true, item };
}

export async function unreserveItem(id: string): Promise<WishlistItem | null> {
  const store = await getStore();
  const item = store.items.find((entry) => entry.id === id);
  if (!item) return null;
  item.reservedBy = null;
  item.reservedAt = null;
  await saveStore(store);
  return item;
}
