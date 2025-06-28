package events

/*
EventType представляет тип события
К нему можно в дальнейшем навешивать методы (валидация например, получение через геттер).
*/
type EventType string

// Event представляет базовую структуру события
type Event struct {
	Type    EventType
	Payload any
}

type Subscriber interface {
	Handle(e Event) error
}

type PublushResult struct {
	Status string
	Errors []error
}

type EventManager interface {
	Pub(e Event) <-chan PublushResult
	Sub(t EventType, subscriber Subscriber) error
}
