package stat

import (
	"errors"
	"link-shorter/db"
	"link-shorter/pkg/service/pagination"
	"link-shorter/pkg/types"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type StatRepository struct {
	db *db.Connection
}

func NewStatRepository(db *db.Connection) *StatRepository {
	return &StatRepository{
		db: db,
	}
}

func (r *StatRepository) Create(dto CreateReqestDTO) (*CreateResponseDTO, error) {
	var result CreateResponseDTO

	if tx := r.db.Instance.
		Clauses(clause.Returning{}).
		Create(NewStat(dto.UserAgent, dto.IP, dto.Referer, dto.LinkID)).
		Scan(&result); tx.Error != nil {
		return nil, tx.Error
	}

	return &result, nil
}

func (r *StatRepository) FindOneByID(statID types.PrimaryKey) (*FindOneResponseDTO, error) {
	var result FindOneResponseDTO

	if statID == 0 {
		return nil, ErrInvalidStatID
	}

	if tx := r.db.Instance.
		Model(&Stat{}).
		Where("id = ?", statID).
		Scan(&result); tx.Error != nil {
		if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
			return nil, ErrStatWithIDNotFound(statID)
		} else {
			return nil, tx.Error
		}
	}

	return &result, nil
}

func (r *StatRepository) FindAll(dto FindAllRequestDTO) (*FindAllResponseDTO, error) {
	var items []FindAllItemDTO
	var count int64

	sql := r.db.Instance.
		Model(&Stat{}).
		Joins("INNER JOIN links ON stats.link_id = links.id AND links.deleted_at IS NULL")

	if dto.From != "" && dto.To != "" {
		sql = sql.Where("stats.created_at BETWEEN ? AND ?", dto.From, dto.To)
	}

	if err := sql.Count(&count).Error; err != nil {
		return nil, err
	}

	if tx := sql.
		Select("stats.*, links.url, links.hash").
		Limit(dto.Limit).
		Offset(dto.GetOffset()).
		Scan(&items); tx.Error != nil {
		return nil, tx.Error
	}

	// if tx := r.db.Instance.
	// 	Model(&Stat{}).
	// 	Joins("INNER JOIN links ON stats.link_id = links.id AND links.deleted_at IS NULL").
	// 	Select("url, hash, to_char(stats.created_at, 'YYYY-MM-DD') as period, COUNT(*) as count").
	// 	Where("stats.created_at BETWEEN ? AND ?", dto.From, dto.To).
	// 	Group("period, link_id, url, hash").
	// 	Limit(dto.Limit).
	// 	Offset(dto.GetOffset()).
	// 	Scan(&items); tx.Error != nil {
	// 	return nil, tx.Error
	// }

	return &FindAllResponseDTO{
		PaginationResponseDTO: *pagination.NewPaginationResponseDTO(
			&items,
			pagination.NewPaginationMetadataDTO(dto.PaginationQueryParamsDTO, count),
		),
	}, nil

}

func (r *StatRepository) Delete(statID types.PrimaryKey) error {
	if tx := r.db.Instance.Delete(&Stat{}, statID); tx.Error != nil {
		return tx.Error
	}

	return nil
}
