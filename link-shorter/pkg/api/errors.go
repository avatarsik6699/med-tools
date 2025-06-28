package api

import "errors"

var (
	ErrInvalidContentType = errors.New("content-type must be application/json")
	ErrInvalidJSON        = errors.New("invalid json")
)
