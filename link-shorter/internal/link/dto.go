package link

import (
	"link-shorter/pkg/api"
	"link-shorter/pkg/lib"
	"link-shorter/pkg/service/pagination"
	"link-shorter/pkg/types"
	"net/http"
)

type FullLinkResponse struct {
	ID        types.PrimaryKey `json:"id"`
	URL       string           `json:"url"`
	Hash      string           `json:"hash"`
	CreatedAt string           `json:"created_at"`
	UpdatedAt string           `json:"updated_at"`
}

/** Create DTOs */
type CreateReqestDTO struct {
	URL  string `json:"url" validate:"required,url"`
	Hash string `json:"hash" validate:"omitempty,min=1,alphanum"`
}

type CreateResponseDTO struct {
	FullLinkResponse
}

func (dto *CreateReqestDTO) Validate() error {
	return lib.Validator.Struct(dto)
}

func (dto *CreateReqestDTO) Decode(r *http.Request) error {
	if err := api.ParseBody(r, dto); err != nil {
		return err
	}

	return nil
}

/** FindAll DTOs */
type FindAllItemDTO struct {
	FullLinkResponse
}

type FindAllRequestDTO struct {
	pagination.PaginationQueryParamsDTO
}

type FindAllResponseDTO struct {
	pagination.PaginationResponseDTO[FindAllItemDTO]
}

func (dto *FindAllRequestDTO) Decode(r *http.Request) error {
	if err := dto.PaginationQueryParamsDTO.Decode(r); err != nil {
		return err
	}

	return nil
}

func (dto *FindAllRequestDTO) Validate() error {
	return lib.Validator.Struct(dto)
}

/** FindOne DTOs */
type FindOneResponseDTO struct {
	FullLinkResponse
}

/** Update DTOs */
type UpdateRequestDTO struct {
	ID   types.PrimaryKey `json:"id" validate:"required,gt=0"`
	URL  string           `json:"url" validate:"omitempty,url"`
	Hash string           `json:"hash" validate:"omitempty,min=1,alphanum"`
}

type UpdateResponseDTO struct {
	ID types.PrimaryKey `json:"id"`
}

func (dto *UpdateRequestDTO) Validate() error {
	return lib.Validator.Struct(dto)
}

func (dto *UpdateRequestDTO) Decode(r *http.Request) error {
	if err := api.ParseBody(r, dto); err != nil {
		return err
	}

	return nil
}

/** Delete DTOs */
type DeleteRequestDTO struct {
	ID types.PrimaryKey `json:"id" validate:"required,gt=0"`
}

type DeleteResponseDTO struct {
	ID types.PrimaryKey `json:"id"`
}

func (dto *DeleteRequestDTO) Validate() error {
	return lib.Validator.Struct(dto)
}

func (dto *DeleteRequestDTO) Decode(r *http.Request) error {
	id, err := api.ParsePathParam(r, "id", api.ParseUint)

	if err != nil {
		return err
	}

	dto.ID = id.Value

	return nil
}
