package stat

import (
	"link-shorter/pkg/events"
	"log"
)

type StatEventHandler struct {
	statService *StatService
}

func NewStatEventHandler(
	statService *StatService,
) *StatEventHandler {
	return &StatEventHandler{
		statService: statService,
	}
}

func (h *StatEventHandler) Handle(e events.Event) error {
	if e.Type == events.EventLinkGoTo {

		if _, ok := e.Payload.(events.LinkGoToEvent); ok {

			return h.linkCreated(e.Payload.(events.LinkGoToEvent))
		}
	}

	return nil
}

func (h *StatEventHandler) linkCreated(payload events.LinkGoToEvent) error {
	log.Println("@@@@@", payload)
	if _, err := h.statService.Create(CreateReqestDTO{
		LinkID:    payload.LinkID,
		UserAgent: payload.UserAgent,
		IP:        payload.IP,
		Referer:   payload.Referer,
	}); err != nil {
		return err
	} else {

	}

	return nil
}
