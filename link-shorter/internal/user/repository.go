package user

import (
	"errors"
	"link-shorter/db"
	"link-shorter/pkg/types"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *db.Connection
}

func NewUserRepository(db *db.Connection) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) Create(user *User) error {
	if tx := r.db.Instance.Create(user); tx.Error != nil {
		return tx.Error
	}

	return nil
}

func (r *UserRepository) FindByID(user *User, ID types.PrimaryKey) *User {
	tx := r.db.Instance.First(user, ID)

	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil
	}

	return user
}

func (r *UserRepository) FindByLogin(user *User, login string) *User {
	if login == "" {
		return nil
	}

	tx := r.db.Instance.Where(`"users"."login" = ?`, login).First(user)

	if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
		return nil
	}

	return user
}
