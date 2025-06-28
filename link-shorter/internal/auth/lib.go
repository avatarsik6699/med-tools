package auth

import "golang.org/x/crypto/bcrypt"

func getPasswordAsHash(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)

	return string(bytes), err
}

func compareOriginalPasswordWithHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))

	return err == nil
}
