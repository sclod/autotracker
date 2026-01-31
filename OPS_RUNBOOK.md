# OPS Runbook (VPS)

## 1) Структура проекта
- Код: `/var/www/autotracker`
- БД SQLite: `./dev.db` (или `DATABASE_URL`)
- Uploads: `./data/uploads`

## 2) Обновление проекта (Git)
```bash
cd /var/www/autotracker
git fetch origin
git reset --hard origin/main
npm install
npm run build
pm2 restart autotracker --update-env
```

## 3) Обновление через rsync (если без git)
```bash
rsync -avz --delete ./ root@SERVER:/var/www/autotracker/
```

## 4) Переменные окружения (.env)
- `ADMIN_PASSWORD` — пароль админа.
- `AUTH_SECRET` — секрет сессии.
- `DATABASE_URL` — путь к SQLite (`file:./dev.db`).
- `SEED_DEMO=true|false` — включить демо-данные (123456/654321).
- `CHAT_REQUIRE_CODE=true|false` — требовать accessCode для чата/файлов.
- `NEXT_PUBLIC_SITE_URL` — базовый URL сайта.

После изменения `.env`:
```bash
npm run build
pm2 restart autotracker --update-env
```

## 5) Логи и диагностика
```bash
pm2 list
pm2 logs autotracker --lines 200
tail -n 200 /var/log/nginx/error.log
tail -n 200 /var/log/nginx/access.log
```

## 6) Nginx / домен / SSL
- Проверка конфига:
```bash
nginx -t
systemctl reload nginx
```
- Сертификат:
```bash
certbot --nginx -d your-domain.ru -d www.your-domain.ru
```

## 7) Диагностика трекера
```bash
curl -I http://127.0.0.1:3000
```

## 8) Демо-данные (seed)
Демо-данные включаются только при `SEED_DEMO=true`.
