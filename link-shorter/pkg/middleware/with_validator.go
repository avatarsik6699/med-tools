package middleware

import (
	"context"
	constant "link-shorter/pkg"
	"link-shorter/pkg/api"
	"link-shorter/pkg/lib"
	"link-shorter/pkg/types"
	"net/http"
)

func WithValidator[V types.Validator](next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dto, ok := lib.GetContextValueByKey[V](r, constant.CtxDefaultDTOKey)

		if !ok {
			api.SendDefaultError(w, http.StatusBadRequest)
			return
		}

		if err := dto.Validate(); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)
			return
		}

		ctx := context.WithValue(r.Context(), constant.CtxDefaultDTOKey, dto)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
