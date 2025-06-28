package auth

import (
	"link-shorter/pkg/types"

	"github.com/go-playground/validator/v10"
)

/** ========= Create DTOs ========= */

type RegisterPayloadDTO struct {
	Login    string `json:"login" validate:"required,min=1,max=64"`
	Password string `json:"password" validate:"required,min=5"`
}

func (r *RegisterPayloadDTO) Validate() error {
	validate := validator.New()

	return validate.Struct(r)
}

type RegisterResponseDTO struct {
	ID          types.PrimaryKey `json:"id"`
	Login       string           `json:"login"`
	AccessToken string           `json:"access_token"`
}

/** ========= Login DTOs ========= */

type LoginPayloadDTO struct {
	Login    string `json:"login" validate:"required"`
	Password string `json:"password" validate:"required"`
}

func (r *LoginPayloadDTO) Validate() error {
	validate := validator.New()

	return validate.Struct(r)
}

type LoginResponseDTO struct {
	ID          types.PrimaryKey `json:"id"`
	Login       string           `json:"login"`
	AccessToken string           `json:"access_token"`
}
