package events

import "link-shorter/pkg/types"

const (
	EventLinkCreated EventType = "link:created"
	EventLinkGoTo    EventType = "link:goto"
	EventLinkDeleted EventType = "link:deleted"
)

type LinkCreatedEvent struct {
	LinkID    types.PrimaryKey
	UserAgent string
	IP        string
	Referer   string
}

type LinkGoToEvent struct {
	LinkID    types.PrimaryKey
	UserAgent string
	IP        string
	Referer   string
}

type LinkDeletedEvent struct {
	LinkID types.PrimaryKey
}
