package stat

import (
	"link-shorter/pkg/api"
	"link-shorter/pkg/lib"
	"link-shorter/pkg/service/pagination"
	"link-shorter/pkg/types"
	"net/http"
)

type FullStatResponse struct {
	ID        types.PrimaryKey `json:"id"`
	UserAgent string           `json:"user_agent"`
	IP        string           `json:"ip"`
	Referer   string           `json:"referer"`

	LinkID types.ForeignKey `json:"link_id"`
}

/** Create DTOs */
type CreateReqestDTO struct {
	UserAgent string `json:"user_agent" validate:"required,max=500"`
	IP        string `json:"ip" validate:"required,ip"`
	Referer   string `json:"referer" validate:"omitempty,url,max=500"`

	LinkID types.ForeignKey `json:"link_id" validate:"required"`
}

type CreateResponseDTO struct {
	FullStatResponse
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

/** Delete DTOs */
type DeleteResponseDTO struct {
	ID types.PrimaryKey `json:"id"`
}

/** FindOne DTOs */
type FindOneResponseDTO struct {
	FullStatResponse
}

/** FindAll DTOs */
// type FindAllListItemDTO struct {
// UserAgent string `json:"user_agent"`
// IP        string `json:"ip"`
// Referer   string `json:"referer"`

// Count  uint   `json:"count"`
// Period string `json:"period"`

// URL  string `json:"url"`
// Hash string `json:"hash"`
// }

type FindAllItemDTO struct {
	FullStatResponse

	URL  string `json:"url"`
	Hash string `json:"hash"`
}

type FindAllRequestDTO struct {
	pagination.PaginationQueryParamsDTO

	From string `json:"from" validate:"omitempty,datetime=2006-01-02"`
	To   string `json:"to" validate:"omitempty,datetime=2006-01-02"`
}

type FindAllResponseDTO struct {
	pagination.PaginationResponseDTO[FindAllItemDTO]
}

func (dto *FindAllRequestDTO) Decode(r *http.Request) error {
	if err := dto.PaginationQueryParamsDTO.Decode(r); err != nil {
		return err
	}

	if from, err := api.ParseQueryParam(r, "from", api.ParseDate); err != nil {
		return err
	} else {
		if !from.Value.IsZero() {
			dto.From = from.Value.Format("2006-01-02")
		}
	}

	if to, err := api.ParseQueryParam(r, "to", api.ParseDate); err != nil {
		return err
	} else {
		if !to.Value.IsZero() {
			dto.To = to.Value.Format("2006-01-02")
		}
	}

	return nil
}

func (dto *FindAllRequestDTO) Validate() error {
	return lib.Validator.Struct(dto)
}
