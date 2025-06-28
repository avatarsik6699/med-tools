package link

import (
	"link-shorter/pkg/lib"
	"link-shorter/pkg/types"
	"math/rand"

	"gorm.io/gorm"
)

type Link struct {
	gorm.Model
	URL  string `json:"url"`
	Hash string `json:"hash" gorm:"uniqueIndex"`
}

func NewLink(dto CreateReqestDTO) *Link {
	if dto.Hash == "" {
		dto.Hash = lib.GenerateShortLink(dto.URL, types.PrimaryKey(rand.Int()))
	}

	return &Link{
		URL:  dto.URL,
		Hash: dto.Hash,
	}
}
