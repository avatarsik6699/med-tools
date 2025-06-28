package events

import (
	"errors"
	"sync"
	"testing"
	"time"
)

type MockSubscriber struct {
	mu        sync.Mutex
	events    []Event
	withError bool
	withDelay bool
}

func (s *MockSubscriber) GetCountHandledEvents() int {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.events)
}

func (s *MockSubscriber) GetLastHandledEvent() Event {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.events[len(s.events)-1]
}

func (s *MockSubscriber) Handle(e Event) error {
	if s.withError {
		return errors.New("__ERROR__")
	}

	s.mu.Lock()
	s.events = append(s.events, e)
	s.mu.Unlock()

	if s.withDelay {
		time.Sleep(10 * time.Millisecond)
	}

	return nil
}

func TestEventManager(t *testing.T) {
	t.Run("NewEventManager() should return EventManager instance", func(t *testing.T) {
		eventManager := NewEventManager()

		if eventManager == nil {
			t.Fatal("NewEventManager() -> nil (constructor should not return nil!)")
		}
	})

	t.Run("EventManager.Pub should notify all handlers with correspond. type", func(t *testing.T) {
		eventManager := NewEventManager()

		subscriberToNotification := &MockSubscriber{}
		eventToNotification := Event{Type: EventLinkCreated, Payload: "test_payload_data"}

		subscriberToIgnore := &MockSubscriber{}
		eventTypeToIgnore := EventType("ignore")

		if err := eventManager.Sub(EventLinkCreated, subscriberToNotification); err != nil {
			t.Fatalf("__failed to subscribe: %#v__", err)
		}

		if err := eventManager.Sub(eventTypeToIgnore, subscriberToIgnore); err != nil {
			t.Fatalf("__failed to subscribe: %#v__", err)
		}

		result := eventManager.Pub(eventToNotification)

		select {
		case <-time.After(time.Second):
			t.Fatalf("__TIME_OUT__\n")
		case v := <-result:
			if v.Status != "success" {
				t.Fatalf("__failed to publish event: %#v__", v.Errors)
			}
		}

		if subscriberToNotification.GetCountHandledEvents() != 1 {
			t.Errorf(
				"__Expected 1 handled event, but got %d__",
				subscriberToNotification.GetCountHandledEvents(),
			)
		}

		if subscriberToIgnore.GetCountHandledEvents() != 0 {
			t.Errorf(
				"__Expected 0 handled event, but got %d__",
				subscriberToNotification.GetCountHandledEvents(),
			)
		}

		if subscriberToNotification.GetLastHandledEvent() != eventToNotification {
			t.Errorf(
				"__Expected event %v, got %v__",
				&eventToNotification,
				subscriberToNotification.GetLastHandledEvent(),
			)
		}
	})

	t.Run("EventManager.Pub without subscriptions", func(t *testing.T) {
		em := NewEventManager()

		// Публикуем событие без подписчиков
		event := Event{Type: EventLinkCreated, Payload: ""}
		result := em.Pub(event)

		select {
		case <-time.After(time.Second):
			t.Fatalf("__TIME_OUT__\n")
		case v := <-result:
			if v.Status != "success" {
				t.Fatalf("Pub() should not return error when no subscribers, got: %v", v.Errors)
			}
		}
	})

	t.Run("EventManager.Pub with error", func(t *testing.T) {
		em := NewEventManager()
		sub := &MockSubscriber{withError: true}
		e := Event{Type: EventLinkCreated, Payload: ""}

		// Подписываемся на событие
		if err := em.Sub(EventLinkCreated, sub); err != nil {
			t.Fatalf("Sub() returned error: %v", err)
		}

		// Публикуем событие, которое вызовет ошибку
		result := em.Pub(e)

		select {
		case <-time.After(time.Second):
			t.Fatalf("__TIME_OUT__\n")
		case v := <-result:
			if v.Status == "success" {
				t.Error("Pub() should return error when handler returns error")
			}

			if v.Errors[0].Error() != "__ERROR__" {
				t.Errorf("Expected error '__ERROR__', got: %v", v.Errors[0])
			}
		}
	})
}
