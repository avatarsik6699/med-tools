package auth

import (
	"link-shorter/internal/user"
	"link-shorter/pkg/api"
	"link-shorter/pkg/service/jwt"
	"net/http"
)

type AuthHandler struct {
	jwtService *jwt.JWTService
	userRepo   *user.UserRepository
}

func NewAuthHandler(
	r *http.ServeMux,
	jwtService *jwt.JWTService,
	userRepository *user.UserRepository,
) *AuthHandler {
	authHandler := &AuthHandler{
		jwtService: jwtService,
		userRepo:   userRepository,
	}

	r.HandleFunc("POST /auth/login", authHandler.Login())
	r.HandleFunc("POST /auth/register", authHandler.Register())

	return authHandler
}

func (h *AuthHandler) Login() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var dto LoginPayloadDTO

		if err := api.ParseBody(r, &dto); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		if err := dto.Validate(); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		if targetUser := h.userRepo.FindByLogin(&user.User{}, dto.Login); targetUser != nil {
			if compareOriginalPasswordWithHash(dto.Password, targetUser.Password) {
				accessToken, err := h.jwtService.Create(jwt.Payload{
					"id":    targetUser.ID,
					"login": targetUser.Login,
				})

				if err != nil {
					api.SendCustomError(w, http.StatusBadRequest, err)

					return
				}

				api.SendSuccess(w, LoginResponseDTO{
					ID:          targetUser.ID,
					Login:       targetUser.Login,
					AccessToken: accessToken,
				})
			} else {
				api.SendCustomError(w, http.StatusNotFound, ErrInvalidPassword)
			}
		} else {
			api.SendCustomError(w, http.StatusNotFound, ErrUserNotFound)
		}
	}
}

func (h *AuthHandler) Register() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var dto RegisterPayloadDTO
		var userToCreate *user.User

		if err := api.ParseBody(r, &dto); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		if err := dto.Validate(); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		hashedPassword, err := getPasswordAsHash(dto.Password)

		if err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		userToCreate = user.NewUser(
			dto.Login,
			hashedPassword,
		)

		if existsUser := h.userRepo.FindByLogin(userToCreate, userToCreate.Login); existsUser != nil {
			api.SendCustomError(w, http.StatusBadRequest, ErrUserAlreadyExists)

			return
		}

		if err := h.userRepo.Create(userToCreate); err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		accessToken, err := h.jwtService.Create(jwt.Payload{
			"id":    userToCreate.ID,
			"login": userToCreate.Login,
		})

		if err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)

			return
		}

		api.SendSuccess(w, RegisterResponseDTO{
			ID:          userToCreate.ID,
			Login:       userToCreate.Login,
			AccessToken: accessToken,
		})
	}
}
