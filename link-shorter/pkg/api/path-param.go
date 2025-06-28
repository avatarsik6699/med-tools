package api

import (
	"fmt"
	"net/http"
)

type PathParam[T any] struct {
	Name  string
	Value T
}

func ParsePathParam[T any](
	r *http.Request,
	name string,
	parser func(string) (T, error),
) (*PathParam[T], error) {
	value := r.PathValue(name)
	parsed, err := parser(value)

	if err != nil {
		return nil, fmt.Errorf("invalid %s parameter: %v", name, err)
	}

	return &PathParam[T]{Name: name, Value: parsed}, nil
}
