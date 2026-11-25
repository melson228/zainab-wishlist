export type EventSettings = {
  hostName: string;
  title: string;
  subtitle: string;
  address: string;
  datetime: string;
  mapUrl: string;
  notes: string;
};

export type WishlistItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  reservedBy: string | null;
  reservedAt: string | null;
  createdAt: string;
};

export type StoreData = {
  settings: EventSettings;
  items: WishlistItem[];
};

export const DEFAULT_SETTINGS: EventSettings = {
  hostName: "Зайнаб",
  title: "Gender Party",
  subtitle: "Помогите нам подготовиться к встрече малыша",
  address: "",
  datetime: "",
  mapUrl: "",
  notes: "",
};
