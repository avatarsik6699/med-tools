package stat

import (
	"errors"
	"fmt"
	"link-shorter/pkg/types"
)

var (
	ErrStatNotFound            = errors.New("Stat not found")
	ErrStatWithIDAlreadyExists = errors.New("Stat with current ID already exists")
	ErrInvalidStatID           = errors.New("invalid stat ID identifier")

	ErrStatWithIDNotFound = func(statID types.PrimaryKey) error {
		return fmt.Errorf("stat with ID %d not found", statID)
	}
)
