package middleware

import (
	"context"
	constant "link-shorter/pkg"
	"link-shorter/pkg/api"
	"link-shorter/pkg/types"
	"net/http"
)

func WithDecoder[D types.Decoder](dtoFactory func() D, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dto := dtoFactory()

		if err := dto.Decode(r); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)
			return
		}

		ctx := context.WithValue(r.Context(), constant.CtxDefaultDTOKey, dto)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
