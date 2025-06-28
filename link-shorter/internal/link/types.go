package link

import "link-shorter/pkg/types"

type Repository interface {
	Create(dto CreateReqestDTO) (*CreateResponseDTO, error)
	Update(dto UpdateRequestDTO) error
	Delete(linkID types.PrimaryKey) error
	FindOneByID(linkID types.PrimaryKey) (*FindOneResponseDTO, error)
	FindOneByHash(hash string) (*FindOneResponseDTO, error)
	FindAll(dto FindAllRequestDTO) (*FindAllResponseDTO, error)
}

type Service interface {
	Create(dto CreateReqestDTO) (*CreateResponseDTO, error)
	Update(dto UpdateRequestDTO) error
	Delete(dto DeleteRequestDTO) error
	FindAll(dto FindAllRequestDTO) (*FindAllResponseDTO, error)
	FindOneByID(linkID types.PrimaryKey) (*FindOneResponseDTO, error)
}
