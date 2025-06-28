package pagination

import (
	"link-shorter/pkg/api"
	"link-shorter/pkg/lib"
	"net/http"
)

const (
	DefaultLimit = 10
	MaxLimit     = 100

	InitialPage = 1
)

type PaginationQueryParamsDTO struct {
	Limit int `json:"limit" validate:"omitempty,required,gte=0,lte=100"`
	Page  int `json:"page" validate:"omitempty,required,gte=1"`
}

type PaginationMetadataDTO struct {
	CurrentPage int   `json:"current_page"`
	TotalPages  int   `json:"total_pages"`
	TotalItems  int64 `json:"total_items"`
	HasNext     bool  `json:"has_next"`
	HasPrev     bool  `json:"has_prev"`
	NextPage    int   `json:"next_page,omitempty"`
	PrevPage    int   `json:"prev_page,omitempty"`
}

type PaginationResponseDTO[Item any] struct {
	Items              *[]Item               `json:"items"`
	PaginationMetadata PaginationMetadataDTO `json:"pagination_metadata"`
}

func NewPaginationResponseDTO[Item any](
	items *[]Item,
	paginationMetadata PaginationMetadataDTO,
) *PaginationResponseDTO[Item] {
	return &PaginationResponseDTO[Item]{
		Items:              items,
		PaginationMetadata: paginationMetadata,
	}
}

func NewPaginationMetadataDTO(dto PaginationQueryParamsDTO, total int64) PaginationMetadataDTO {
	totalPages := int(total) / dto.Limit

	// Проверяем есть ли остаток, который не помещается на страницу
	if int(total)%dto.Limit > 0 {
		totalPages++
	}

	response := PaginationMetadataDTO{
		CurrentPage: dto.Page,
		TotalPages:  totalPages,
		TotalItems:  total,
	}

	// Проверяем, есть ли следующая страница
	if dto.Page < totalPages {
		response.HasNext = true
		response.NextPage = dto.Page + 1
	}

	// Проверяем, есть ли предыдущая страница
	if dto.Page > InitialPage {
		response.HasPrev = true
		response.PrevPage = dto.Page - 1
	}

	return response
}

// GetOffset вычисляет offset на основе page и limit
func (dto *PaginationQueryParamsDTO) GetOffset() int {
	return (dto.Page - 1) * dto.Limit
}

func (dto *PaginationQueryParamsDTO) Decode(r *http.Request) error {
	// Получаем limit
	limit, err := api.ParseQueryParam(r, "limit", api.ParseInt)
	if err != nil {
		dto.Limit = DefaultLimit
	} else {
		dto.Limit = limit.Value
	}

	// Получаем page
	page, err := api.ParseQueryParam(r, "page", api.ParseInt)
	if err != nil {
		dto.Page = InitialPage
	} else {
		dto.Page = page.Value
	}

	return nil
}

func (dto *PaginationQueryParamsDTO) Validate() error {
	return lib.Validator.Struct(dto)
}
