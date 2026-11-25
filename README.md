# Зайнаб · Gender Party Wishlist

Веб-вишлист для гендер-пати: гости бронируют подарки, Зайнаб сама управляет карточками, адресом и временем.

## Что умеет

- Публичная страница с вишлистом, фото, ссылкой и кнопкой «Забронировать»
- Кабинет Зайнаб (`/admin`) — пароль из `ADMIN_PASSWORD`
- В профиле события: имя, заголовок, адрес, дата/время, заметка для гостей
- Создание / редактирование / удаление карточек + снятие брони

## Локальный запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000)  
Кабинет: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Пароль по умолчанию: `zainab2026`

Локально данные пишутся в `data/store.json` (папка создаётся сама).

## Деплой на Vercel

1. Залей репозиторий на GitHub и импортируй в Vercel.
2. Добавь env-переменные:
   - `ADMIN_PASSWORD` — пароль для Зайнаб
   - `AUTH_SECRET` — любая длинная случайная строка
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. Upstash Redis (бесплатно):
   - в Vercel → Storage / Marketplace → **Upstash**, или
   - [console.upstash.com](https://console.upstash.com) → Create Database → REST keys
4. Deploy.

Без Redis на Vercel данные не сохранятся между запросами (serverless filesystem эфемерен).

## Для Зайнаб

1. Зайти в `/admin/login`
2. Вкладка **Адрес и время** — куда приехать и когда
3. Вкладка **Вишлист** — добавить карточку: название, описание, ссылка, фото (URL или файл до ~1.2 МБ)
