package link

import (
	"errors"
	"link-shorter/pkg/types"
)

type LinkService struct {
	linkRepository Repository
}

func NewLinkService(
	linkRepository Repository,
) *LinkService {
	return &LinkService{
		linkRepository: linkRepository,
	}
}

func (s *LinkService) Create(dto CreateReqestDTO) (*CreateResponseDTO, error) {
	/*
		TODO: Сейчас все ссылки находятся в глобальном пространстве хеш-имен.
		Возможно стоит реализовать привязку hash-username если пользователь залогинен
		и ссылка создается как private. Тогда хеш проверяется на совпадение только в рамках
		пространства хеш-имен для конкрнтого пользователя.
	*/
	if dto.Hash != "" {
		existsLink, err := s.linkRepository.FindOneByHash(dto.Hash)

		if existsLink != nil {
			return nil, ErrLinkWithHashAlreadyExists
		}

		if err != nil && !errors.Is(err, ErrLinkWithHashNotFound) {
			return nil, err
		}
	}

	createdLink, err := s.linkRepository.Create(dto)

	if err != nil {
		return nil, err
	}

	return createdLink, nil
}

func (s *LinkService) Update(dto UpdateRequestDTO) error {
	if err := s.linkRepository.Update(dto); err != nil {
		return err
	}

	return nil
}

func (s *LinkService) Delete(dto DeleteRequestDTO) error {
	if _, err := s.linkRepository.FindOneByID(dto.ID); err != nil {
		return err
	}

	if err := s.linkRepository.Delete(dto.ID); err != nil {
		return err
	}

	return nil
}

func (s *LinkService) FindAll(dto FindAllRequestDTO) (*FindAllResponseDTO, error) {
	data, err := s.linkRepository.FindAll(dto)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func (s *LinkService) FindOneByID(linkID types.PrimaryKey) (*FindOneResponseDTO, error) {
	targetLink, err := s.linkRepository.FindOneByID(linkID)

	if err != nil {
		return nil, err
	}

	return targetLink, nil
}
