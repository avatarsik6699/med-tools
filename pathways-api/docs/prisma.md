Prisma - ОРМ, в составе которой есть клиент(Auto-generated and type-safe query builder for Node.js & TypeScript) + модуль миграций.

Всё начинается с prisma.schema
In this schema, you configure three things:
- Data source: Specifies your database connection (via an environment variable)
- Generator: Indicates that you want to generate Prisma Client
	Генерирует код для CRUD операций над моделями.
- Data model: Defines your application models


# Workflow разработки с Prisma
Добавили новую модель → npx prisma db push
- Быстро синхронизирует схему с БД
- Не создает миграции (идеально для прототипирования)
Изменили существующую модель → npx prisma db push
- Prisma попытается сохранить данные при изменениях
- Если изменения критичные - предупредит
Нужно обновить Prisma Client → npx prisma generate
- Обновляет TypeScript типы
- Обычно запускается автоматически после db push

Команды сброса
prisma migrate reset --force (ваша npm run db:reset)
Удаляет ВСЕ данные
Применяет все миграции заново
Оставляет таблицу _prisma_migrations
Используйте когда хотите чистую БД с историей миграций
prisma db push --force-reset
Удаляет ВСЕ данные и структуру
Удаляет таблицу _prisma_migrations
Применяет только текущую схему
Используйте когда хотите полностью чистую БД без истории
Когда что использовать
Development с миграциями → migrate reset
Прототипирование без миграций → db push --force-reset
Запутались в миграциях → удалите prisma/migrations + db push --force-reset
Рекомендация: Для стабильной разработки используйте migrate reset, для экспериментов - db push --force-reset.

# 🧭 Общая картина: Жизненный цикл работы с Prisma
1. Инициализация → 2. Описание модели → 3. Миграция → 4. Работа с данными → 5. Изменение схемы → 6. Управление миграциями
##  Шаг 1: Инициализация проекта
```sh  
npx prisma init
```
Создаст: .env — с DATABASE_URL и prisma/schema.prisma — основной файл схемы
(Убедись, что DATABASE_URL указывает на нужную БД (например, локальную PostgreSQL, SQLite или облачную)). 
## 🔹  Шаг 2: Описать модель в schema.prisma

// prisma/schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
## 🔹 Шаг 3: Создать и применить миграцию
```sh 
sql npx prisma migrate dev --name init 
```
Что происходит:
- Prisma сравнивает текущую схему с состоянием БД
- Генерирует SQL-миграцию в prisma/migrations/
- Применяет её к БД
- Обновляет внутреннее состояние Prisma и генерирует Prisma Client
## 🔁 Шаг 4: Внесение изменений в схему (например, добавить поле)
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  name     String?
  age      Int?    // ← новое поле
}

```sh 
npx prisma migrate dev --name add_age_to_user
```
Prisma:
- увидит изменение
- создаст новую миграцию (папку в migrations/)
- применит ALTER TABLE к БД
- перегенерирует Client

=/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/==/=
# Порядок действий при риске потерять данные в ходе миграцией и т.д.
- создать backup
- создать миграцию с ручным редактированием 
```sh 
	npx prisma migrate dev --name SOME_NAME --create-only
```
- Отредактировать созданный SQL файл:
```sql
-- Сохранить данные во временную таблицу
CREATE TABLE temp_nodes AS SELECT * FROM "Node";

-- Удалить старую таблицу
DROP TABLE "Node";

-- Создать новую таблицу (Prisma сгенерирует автоматически)
CREATE TABLE "nodes" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- Восстановить данные с адаптацией
INSERT INTO "nodes" ("id", "label") 
SELECT "id", "label" FROM temp_nodes;

-- Удалить временную таблицу
DROP TABLE temp_nodes;
```
