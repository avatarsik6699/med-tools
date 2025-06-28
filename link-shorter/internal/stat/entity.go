package stat

import (
	"link-shorter/internal/link"
	"link-shorter/pkg/types"

	"gorm.io/gorm"
)

// Возможно, стоит добавить составной индекс по LinkID и CreatedAt для эффективной выборки статистики по времени
type Stat struct {
	gorm.Model

	UserAgent string `json:"user_agent" gorm:"type:text"`
	IP        string `json:"ip" gorm:"type:text"`
	Referer   string `json:"referer" gorm:"type:text"`

	LinkID types.ForeignKey `json:"link_id" gorm:"not null"`
	Link   link.Link        `gorm:"constraint:OnDelete:CASCADE;"`
}

func NewStat(
	UserAgent string,
	IP string,
	Referer string,
	LinkID types.ForeignKey,
) *Stat {
	return &Stat{
		UserAgent: UserAgent,
		IP:        IP,
		Referer:   Referer,
		LinkID:    LinkID,
	}
}
