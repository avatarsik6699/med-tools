package events

import (
	"fmt"
	"sync"
)

/*
	TODO:
		-	Отписка
		- Улучшить типизацию?
		- Нет асинхронной обработки событий подписчиками в отд. горутинах.
			-	data racing, race cond.
			- завершение по таймауту?
			- избегать утечек горутин?
			- логирование / сообщение об ошибке, если не получилось обработать событие.

		Асинхронную обработку - использование горутин для параллельного выполнения обработчиков
		Функционал отписки - метод Unsub() для удаления обработчиков
		Типизированные события - использование дженериков для типобезопасности
		Middleware/фильтры - пред- и пост-обработка событий
		Retry механизм - повторные попытки при ошибках
		Метрики и логирование - отслеживание производительности
*/

type eventManager struct {
	subscribers map[EventType][]Subscriber
	mu          sync.RWMutex
}

func NewEventManager() *eventManager {
	return &eventManager{
		subscribers: make(map[EventType][]Subscriber),
	}
}

func (em *eventManager) Sub(eventType EventType, handler Subscriber) error {
	em.mu.Lock()
	defer em.mu.Unlock()

	em.subscribers[eventType] = append(em.subscribers[eventType], handler)

	return nil
}

func (em *eventManager) Pub(event Event) <-chan PublushResult {
	/*
		TODO:
		Горутина утечка - если sub.Handle() зависнет, горутина никогда не завершится
		Отсутствие контекста - нет возможности отменить выполнение
		Нет таймаута - обработчики могут выполняться бесконечно
	*/

	em.mu.RLock()
	subs := make([]Subscriber, len(em.subscribers[event.Type]))
	copy(subs, em.subscribers[event.Type])
	em.mu.RUnlock()

	var wg sync.WaitGroup
	var mu sync.Mutex
	var errorsPool []error

	resultCh := make(chan PublushResult, 1)

	for _, sub := range subs {
		wg.Add(1)
		go func(sub Subscriber) {
			defer wg.Done()
			defer func() {
				if r := recover(); r != nil {
					mu.Lock()
					errorsPool = append(errorsPool, fmt.Errorf("panic in handler: %v", r))
					mu.Unlock()
				}
			}()

			if err := sub.Handle(event); err != nil {
				mu.Lock()
				errorsPool = append(errorsPool, err)
				mu.Unlock()
			}
		}(sub)
	}

	go func() {
		wg.Wait()
		result := PublushResult{
			Status: "success",
			Errors: nil,
		}

		if len(errorsPool) != 0 {
			result.Status = "error"
			result.Errors = errorsPool
		}

		resultCh <- result

		close(resultCh)
	}()

	return resultCh
}
