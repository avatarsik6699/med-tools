package link

import (
	"errors"
	"link-shorter/db"
	"link-shorter/pkg/service/pagination"
	"link-shorter/pkg/types"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type LinkRepository struct {
	db *db.Connection
}

func NewLinkRepository(db *db.Connection) *LinkRepository {
	return &LinkRepository{
		db: db,
	}
}

func (r *LinkRepository) Create(dto CreateReqestDTO) (*CreateResponseDTO, error) {
	var result CreateResponseDTO

	// TODO: нужно доработать создание с автомаппингом
	// r.db.Instance.Clauses(clause.Returning{}).Create(&link).Scan(&response)
	// b.Instance.Raw("INSERT INTO links (...) VALUES (...) RETURNING *").Scan(&response)
	if tx := r.db.Instance.
		Clauses(clause.Returning{}).
		Create(NewLink(dto)).
		Scan(&result); tx.Error != nil {
		return nil, tx.Error
	}

	return &result, nil
}

func (r *LinkRepository) Update(dto UpdateRequestDTO) error {
	link, err := r.FindOneByID(dto.ID)

	if err != nil {
		return err
	}

	if dto.Hash != "" {
		link.Hash = dto.Hash
	}

	if dto.URL != "" {
		link.URL = dto.URL
	}

	if tx := r.db.Instance.Save(&link); tx.Error != nil {
		return tx.Error
	}

	return nil
}

func (r *LinkRepository) Delete(linkID types.PrimaryKey) error {
	if tx := r.db.Instance.Delete(&Link{}, linkID); tx.Error != nil {
		return tx.Error
	}

	return nil
}

// TODO: мб можео объединить в один метод FindOneBy
func (r *LinkRepository) FindOneByID(linkID types.PrimaryKey) (*FindOneResponseDTO, error) {
	var result FindOneResponseDTO

	if linkID == 0 {
		return nil, ErrInvalidLinkID
	}

	if tx := r.db.Instance.
		Model(&Link{}).
		// NB: возможно это поле ненужно, поля и так смаппятся в структуру
		Select("id, url, hash, created_at, updated_at").
		Where("id = ?", linkID).
		Scan(&result); tx.Error != nil {
		if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
			return nil, ErrLinkWithIDNotFound(linkID)
		} else {
			return nil, tx.Error
		}
	}

	return &result, nil
}

// TODO: мб можео объединить в один метод FindOneBy
func (r *LinkRepository) FindOneByHash(hash string) (*FindOneResponseDTO, error) {
	var result FindOneResponseDTO

	if hash == "" {
		return nil, ErrInvalidLinkHash
	}

	if tx := r.db.Instance.
		Model(&Link{}).
		// NB: возможно это поле ненужно, поля и так смаппятся в структуру
		Select(`
			id,
			url,
			hash,
			to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
			to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
		`).
		Where(`hash = ?`, hash).
		// NB: Проблема в том, что gorm.Scan() не возвращает gorm.ErrRecordNotFound при отсутствии записей
		First(&result); tx.Error != nil {
		if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
			return nil, ErrLinkWithHashNotFound
		} else {
			return nil, tx.Error
		}
	}

	return &result, nil
}

func (r *LinkRepository) FindAll(dto FindAllRequestDTO) (*FindAllResponseDTO, error) {
	var links []FindAllItemDTO
	var count int64

	sql := r.db.Instance.
		Model(&Link{}).
		Select(`
			id,
			url,
			hash,
			to_char(created_at, 'YYYY-MM-DD HH24:MI') as created_at,
			to_char(updated_at, 'YYYY-MM-DD HH24:MI') as updated_at
		`)

	if tx := sql.Count(&count); tx.Error != nil {
		return nil, tx.Error
	}

	sql = sql.Offset(dto.GetOffset()).Limit(dto.Limit)

	if tx := sql.Scan(&links); tx.Error != nil {
		return nil, tx.Error
	}

	return &FindAllResponseDTO{
		PaginationResponseDTO: *pagination.NewPaginationResponseDTO(
			&links,
			pagination.NewPaginationMetadataDTO(dto.PaginationQueryParamsDTO, count),
		),
	}, nil
}
