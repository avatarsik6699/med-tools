modern config for node.js
https://medium.com/@gabrieldrouin/node-js-2025-guide-how-to-setup-express-js-with-typescript-eslint-and-prettier-b342cd21c30d

modern way to configure path aliases 
https://habr.com/ru/articles/840240/
https://habr.com/ru/articles/738132/
https://turborepo.com/docs/guides/tools/typescript#use-nodejs-subpath-imports-instead-of-typescript-compiler-paths

Основная концепция Middleware Flow

# Принцип "Стопка тарелок"
Представь middleware как стопку тарелок:
- Запрос идет сверху вниз через все middleware
- Ответ идет снизу вверх обратно через те же middleware
- Каждый middleware может остановить выполнение или продолжить

Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler
                                                           ↓
Response ← Middleware 1 ← Middleware 2 ← Middleware 3 ← Route Handler

🔑 Ключевые моменты для запоминания
- await next() - передает управление следующему middleware
- Без await next() - выполнение останавливается
- Flow идет вниз через все middleware до последнего
- Flow идет вверх обратно через те же middleware
- Каждый middleware выполняется дважды - до и после next()
- Порядок middleware важен - первый выполняется первым
- ctx.state - общее состояние между middleware
- Ошибки можно обрабатывать в try/catch

=/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/=

## Graceful Shutdown

**Graceful shutdown** — это корректное завершение работы приложения, которое позволяет:

- Завершить обработку текущих запросов вместо их обрыва
- Освободить ресурсы (закрыть соединения с БД, файлы, сокеты)
- Сохранить состояние приложения перед выходом

### Почему ваш код считается graceful shutdown:

- `server.close()` — останавливает прием новых соединений и ждет завершения активных запросов
- Обработка сигналов `SIGTERM`/`SIGINT` — реагирует на системные команды остановки
- `setTimeout()` — защита от зависания (fallback через 10 сек)
- `process.exit(0)` — корректный код завершения

### Без graceful shutdown сервер просто "убивается", что может привести к:

- Обрыву активных соединений
- Потере данных
- Незакрытым ресурсам
- Ошибкам у клиентов

Ваш код обеспечивает плавную остановку сервера при получении системных сигналов завершения.

SIGTERM и SIGINT сигналы
SIGTERM (Signal Terminate)
Источник: Система, процесс-менеджеры (PM2, Docker, systemd)
Назначение: Вежливая просьба завершить работу
Поведение: Можно перехватить и обработать
Примеры: kill <pid>, Docker stop, Kubernetes graceful shutdown
SIGINT (Signal Interrupt)
Источник: Пользователь (клавиатура)
Назначение: Прерывание выполнения
Поведение: Можно перехватить и обработать
Примеры: Ctrl+C в терминале
Ключевые отличия:
SIGTERM — "административная" остановка сервиса
SIGINT — "пользовательское" прерывание
Почему важно обрабатывать оба:
В продакшене чаще используется SIGTERM (деплои, рестарты)
В разработке чаще SIGINT (Ctrl+C)
SIGKILL (kill -9) — нельзя перехватить, убивает процесс принудительно
Типичный workflow:
Система шлет SIGTERM
Приложение начинает graceful shutdown
Если не завершилось — система шлет SIGKILL
