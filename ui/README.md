Основные сущности
Node - базовая единица с типизацией:
type: "question" | "info" | "diagnostic" | "action" | "decision"
state: "active" | "completed" | "skipped" | "blocked"
metadata: дополнительные свойства в зависимости от типа
Description - контент узла:
Лучше сделать content с поддержкой разных типов (text, markdown, react component)
Версионность для обновлений
Edge/Transition - связь между узлами:
condition: логическое условие перехода
priority: порядок проверки условий
type: "automatic" | "manual" | "conditional"
Что можете упускать
Контекст pathway - глобальные переменные/состояние для всего пути
Группировка узлов - возможность создавать подграфы/секции
Валидация - правила корректности pathway (нет циклов, есть начало/конец)
Пользовательский прогресс - отдельная сущность для отслеживания прохождения
Шаблоны узлов - готовые типы для быстрого создания
Рассмотрите паттерн State Machine для управления переходами - это добавит структурированности.

# pathways
medical_groups Медицинские группы (Anesthesiology, Cardiovascular Medicine, etc.)
pathways (например, "Diabetes: Diagnosis of diabetes mellitus")

Узлы с типами:
- Вопросы с вариантами ответов
- Информационные блоки
- Диагностические критерии
- Действия/рекомендации

Node: {
  label: string | ReactNode,
  focus: boolean
}

Condition: {

}

Description: {
  
}

Node (описание, состояния) 
-> Edge(условие перехода) 
-> Node (описание, состояния)


model Pathway {
  id String @id @default(cuid())
  title String
  medicalGroup String
  nodes Node[]
  edges Edge[]
  context Json? // глобальные переменные
}

model Node {
  id String @id @default(cuid())
  type NodeType
  position Json // {x, y}
  state NodeState @default(INACTIVE)
  metadata Json?
  
  pathway Pathway @relation(fields: [pathwayId], references: [id])
  pathwayId String
  
  content NodeContent?
  sourceEdges Edge[] @relation("SourceNode")
  targetEdges Edge[] @relation("TargetNode")
}

model NodeContent {
  id String @id @default(cuid())
  contentType ContentType
  data Json // text, markdown, или component config
  version Int @default(1)
  
  node Node @relation(fields: [nodeId], references: [id])
  nodeId String @unique
}

model UserProgress {
  id String @id
  pathwayId String
  userId String
  currentNodeId String
  answers Json // {"nodeA": "yes", "nodeC": "option1"}
  completedAt DateTime?
}


На бекенд передавать:

{
  "nodeId": "A",
  "answer": "yes",
  "pathwayId": "pathway123"
}

model Edge {
  id String @id @default(cuid())
  condition Json? // логические условия
  priority Int @default(0)
  type EdgeType @default(MANUAL)
  
  sourceNode Node @relation("SourceNode", fields: [sourceId], references: [id])
  sourceId String
  targetNode Node @relation("TargetNode", fields: [targetId], references: [id])
  targetId String
  
  pathway Pathway @relation(fields: [pathwayId], references: [id])
  pathwayId String
}


Спецификация Pathway System
Основные сущности
Pathway
id, title, medicalGroup
context (Json) - глобальные переменные
Связь: nodes[], edges[]
Node
id, type (question/info/action/diagnostic), role (START/INTERMEDIATE/END)
position (Json), state (active/completed/skipped/blocked)
metadata (Json) - дополнительные свойства по типу
Связь: content, sourceEdges[], targetEdges[]
NodeContent
contentType (text/markdown/component), data (Json)
version - для обновлений контента
Edge
condition (Json), priority, type (manual/automatic/conditional)
Связь: sourceNode, targetNode
Простые условия переходов
Workflow создания
Добавление узлов → выбор типа → заполнение label/content
Создание связей → drag&drop между узлами → настройка условий
Валидация → проверка START/END узлов
Ограничения
Минимум 1 START и 1 END узел
START: только исходящие edges
END: только входящие edges
Приоритет edges для разрешения конфликтов
