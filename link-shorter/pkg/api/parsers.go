package api

import (
	"fmt"
	"strconv"
	"time"
)

func ParseDate(value string) (time.Time, error) {
	if value == "" {
		return time.Time{}, nil
	}

	return time.Parse("2006-01-02", value)
}

func ParseHash(value string) (string, error) {
	if value == "" {
		return "", fmt.Errorf("hash cannot be empty")
	}
	// Можно добавить дополнительные проверки, например:
	// - минимальная/максимальная длина
	// - допустимые символы
	// - формат хеша
	return value, nil
}

func ParseInt(value string) (int, error) {
	parsed, err := strconv.ParseInt(value, 10, 0)

	return int(parsed), err
}

func ParseUint64(value string) (uint64, error) {
	return strconv.ParseUint(value, 10, 64)
}

func ParseUint(value string) (uint, error) {
	parsed, err := strconv.ParseUint(value, 10, 32)

	return uint(parsed), err
}
