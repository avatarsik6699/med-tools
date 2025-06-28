package auth

import "errors"

var (
	ErrUserAlreadyExists = errors.New("user with current login already exists")
	ErrInvalidPassword   = errors.New("invalid password")
	ErrUserNotFound      = errors.New("user with current login not found")
)
