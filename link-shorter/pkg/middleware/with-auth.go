package middleware

import (
	"context"
	"link-shorter/pkg/api"
	"link-shorter/pkg/service/jwt"
	"net/http"
	"strings"
)

type contextKey string

const (
	USER_LOGIN_KEY contextKey = "userLogin"
	USER_ID_KEY    contextKey = "userID"
)

func WithAuth(next http.Handler, jwtService *jwt.JWTService) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")

		if authorization == "" || !strings.HasPrefix(authorization, "Bearer ") {
			api.SendDefaultError(w, http.StatusUnauthorized)

			return
		}

		payload, isValid, err := jwtService.Parse(
			strings.TrimPrefix(authorization, "Bearer "),
		)

		if err != nil || !isValid {
			api.SendDefaultError(w, http.StatusUnauthorized)

			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, USER_LOGIN_KEY, payload["login"])
		ctx = context.WithValue(ctx, USER_ID_KEY, payload["id"])

		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
