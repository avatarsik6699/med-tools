package link

import (
	"errors"
	"fmt"
	"link-shorter/pkg/types"
)

var (
	ErrLinkNotFound              = errors.New("Link not found")
	ErrLinkWithHashAlreadyExists = errors.New("Link with current Hash already exists")
	ErrInvalidLinkID             = errors.New("invalid link ID identifier")
	ErrInvalidLinkHash           = errors.New("invalid link hash")
	ErrLinkWithHashNotFound      = errors.New("link with Hash not found")

	ErrLinkWithIDNotFound = func(linkID types.PrimaryKey) error {
		return fmt.Errorf("link with ID %d not found", linkID)
	}
)
