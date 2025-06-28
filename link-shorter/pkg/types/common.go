package types

import (
	"net/http"
)

type Validator interface {
	Validate() error
}

type Decoder interface {
	Decode(r *http.Request) error
}
