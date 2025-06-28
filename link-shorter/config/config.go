package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Auth     AuthConfig
	DataBase DataBaseConfig
}

type AuthConfig struct {
	Secret string
}

type DataBaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
	TimeZone string
}

func NewConfig() *Config {
	err := godotenv.Load(".env")

	if err != nil {
		log.Panicln("Error while loading .env file. Using default conf")
	}

	return &Config{
		DataBase: DataBaseConfig{
			Port:     os.Getenv("DB_PORT"),
			Host:     os.Getenv("DB_HOST"),
			User:     os.Getenv("DB_USER"),
			Password: os.Getenv("DB_PASSWORD"),
			DBName:   os.Getenv("DB_NAME"),
			SSLMode:  os.Getenv("DB_SSL_MODE"),
			TimeZone: os.Getenv("DB_TIMEZONE"),
		},
		Auth: AuthConfig{
			Secret: os.Getenv("SECRET"),
		},
	}
}
