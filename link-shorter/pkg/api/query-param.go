package api

import (
	"fmt"
	"net/http"
)

type QueryParam[T any] struct {
	Name  string
	Value T
}

func ParseQueryParam[T any](
	r *http.Request,
	name string,
	parser func(string) (T, error),
) (*QueryParam[T], error) {
	value := r.URL.Query().Get(name)
	parsed, err := parser(value)

	if err != nil {
		return nil, fmt.Errorf("invalid %s parameter: %v", name, err)
	}

	return &QueryParam[T]{Name: name, Value: parsed}, nil
}
