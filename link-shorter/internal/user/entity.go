package user

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Login    string `gorm:"type:varchar(255);unique;not null"`
	Password string `gorm:"type:varchar(255);not null"`
}

func NewUser(
	login string,
	password string,
) *User {

	return &User{
		Login:    login,
		Password: password,
	}
}
