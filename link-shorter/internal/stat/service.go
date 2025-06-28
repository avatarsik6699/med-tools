package stat

import (
	"link-shorter/internal/link"
)

type StatService struct {
	statRepository *StatRepository
	linkRepository link.Repository
}

func NewStatService(
	statRepository *StatRepository,
	linkRepository *link.LinkRepository,
) *StatService {

	service := &StatService{
		statRepository: statRepository,
		linkRepository: linkRepository,
	}

	return service
}

func (s *StatService) Create(dto CreateReqestDTO) (*CreateResponseDTO, error) {
	if err := dto.Validate(); err != nil {
		return nil, err
	}

	if _, err := s.linkRepository.FindOneByID(dto.LinkID); err != nil {
		return nil, err
	}

	createdStat, err := s.statRepository.Create(dto)

	if err != nil {
		return nil, err
	}

	return createdStat, nil
}

func (s *StatService) FindOne() {}

func (s *StatService) FindAll(dto FindAllRequestDTO) (*FindAllResponseDTO, error) {
	data, err := s.statRepository.FindAll(dto)

	if err != nil {
		return nil, err
	}

	return data, nil
}

func (s *StatService) Delete() {}
