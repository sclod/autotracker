# AutoTracker

Публичный сайт + трекинг заказа + скрытая админка для управления этапами доставки авто.

## Быстрый старт

1. Установите зависимости:

```bash
npm install
```

2. Скопируйте переменные окружения:

```bash
copy .env.example .env
```

3. Укажите значения:

- `DATABASE_URL` (по умолчанию `file:./dev.db`)
- `ADMIN_PASSWORD` — пароль для входа в админку
- `AUTH_SECRET` — секрет для подписи сессии

4. Запустите проект:

```bash
npm run dev
```

Сайт: `http://localhost:3000`
Админка: `http://localhost:3000/admin/login`

## Страницы

Public:
- `/` — главная
- `/catalog` и `/catalog/[slug]`
- `/services` и `/services/[slug]`
- `/about`, `/reviews`, `/blog`, `/contact`
- `/track` и `/track/[trackingNumber]`

Admin:
- `/admin/login`
- `/admin/orders`
- `/admin/orders/new`
- `/admin/orders/[id]`

## Данные и база

SQLite база `dev.db` создаётся автоматически при первом запуске.
Prisma подключён через драйверный адаптер `better-sqlite3`.

Если хотите вести миграции вручную, используйте Prisma CLI (опционально):

```bash
npx prisma migrate dev --name init
```

## Безопасность (MVP)

- Закрытая `/admin` зона через httpOnly cookie.
- Пароль из `ADMIN_PASSWORD`.
- Rate-limit на `/api/admin/login` и `/api/track`.

## P1-заглушки

Карта, чат и файлы отображаются как блоки-заглушки и готовы к расширению.
