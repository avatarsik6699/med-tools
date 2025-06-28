package lib

import (
	"net/http"
)

func GetContextValueByKey[ContextValue any](r *http.Request, key any) (ContextValue, bool) {
	v, ok := r.Context().Value(key).(ContextValue)

	return v, ok
}
