# TV Shows Explorer API

NestJS API для фронтенда из соседней папки `simple-architecture`.
Перед запуском проверьте версии Node.js (`engines.node`) и pnpm
(`packageManager`) в [package.json](package.json).

```powershell
pnpm install
pnpm dev
```

Локальный сервер слушает порт `8080`. Переменная `PORT` переопределяет
порт, например при развёртывании.

Для запуска собранной версии используйте `pnpm build`, затем `pnpm start`.

## API

| Метод и путь | Результат |
| --- | --- |
| `GET /api/health` | `{"status":"ok"}` |
| `GET /api/shows?q=girls&genre=Drama&page=2` | `shows`, `genres`, `selectedGenre`, `page`, `pageCount`, `resultRange` |
| `GET /api/favorites` | `{"shows":[...]}` |
| `PUT /api/favorites/{id}` | Добавляет шоу по ID TVmaze; возвращает `shows` и `changed`. |
| `DELETE /api/favorites/{id}` | Удаляет шоу по ID TVmaze; возвращает `shows` и `changed`. |

Для поиска обязателен `q`, остальные параметры необязательны. Сервер
собирает жанры из всех совпадений, фильтрует их и отдаёт по три шоу
на страницу в порядке релевантности. Неизвестный жанр сбрасывается,
слишком большая страница ограничивается последней. `resultRange` содержит
`first`, `last` и `total` уже после фильтрации.

Повторное добавление или удаление возвращает текущее избранное с
`changed: false`. Данные при добавлении берутся из TVmaze по ID.

## Структура проекта

- `src/shows` обрабатывает поиск, жанры и пагинацию.
- `src/favorites` обрабатывает список и изменения избранного.
- `src/tvmaze` обращается к TVmaze и кеширует успешные ответы по URL в
  обычном объекте на пять минут. Смена жанра или страницы использует тот же
  ответ. Одновременные обращения к одному URL используют общий запрос.

Избранное хранится в отдельном объекте в памяти процесса. Это один общий
учебный список на экземпляр сервера, без учётных записей.

## Vercel Hobby

Production API доступен на `https://tv-shows-backend-eta.vercel.app`.
Проверить доступность можно через [`GET /api/health`](https://tv-shows-backend-eta.vercel.app/api/health).

Импортируйте папку бэкенда как корень отдельного проекта. Vercel распознаёт
[NestJS по `src/main.ts`](https://vercel.com/docs/frameworks/backend/nestjs).
[Hobby](https://vercel.com/docs/plans/hobby) бесплатен для личных проектов
в пределах лимитов.

Для публикации из локальной копии выполните `pnpm dlx vercel link` и выберите
существующий проект `tv-shows-backend`. Затем выполните `pnpm dlx vercel --prod`.

Для отдельно размещённого фронтенда задайте `FRONTEND_ORIGIN` его точным
origin (с `https://`, без пути и завершающего `/`). Это разрешает браузеру
обращаться к API с этого origin. При локальном прокси переменная не нужна.

[Экземпляры Vercel Functions](https://vercel.com/docs/functions#how-the-vercel-functions-lifecycle-works)
могут масштабироваться независимо и останавливаться при простое. У них
разная память, поэтому кеш и список могут отличаться между запросами или
сброситься. Для демонстрации стабильного списка в рамках одного процесса
запустите сервер локально.
