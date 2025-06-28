package db

import (
	"fmt"
	"link-shorter/config"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Connection struct {
	Instance *gorm.DB
}

type Deps struct {
	Config *config.Config
}

func NewConnection(deps *Deps) *Connection {
	conf := deps.Config.DataBase
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s",
		conf.Host, conf.User, conf.Password, conf.DBName, conf.Port,
	)

	// Open database connection
	connection, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Panicln(err)
	}

	// Get underlying SQL database
	sql, err := connection.DB()

	if err != nil {
		log.Panicln(err)
	}

	// Set connection pool settings
	sql.SetMaxIdleConns(10)
	sql.SetMaxOpenConns(100)
	// TODO: надо понять нужно ли это
	// sqlDB.SetConnMaxLifetime(time.Hour)

	if err := sql.Ping(); err == nil {
		stats := sql.Stats()

		log.Println("Successfully connected to database", stats.MaxOpenConnections, stats.OpenConnections)
	}

	return &Connection{
		Instance: connection,
	}
}

// Close closes the database connection
func (connection *Connection) Close() error {
	if connection != nil {
		sql, err := connection.Instance.DB()

		if err != nil {
			log.Panicln(err)
		}

		return sql.Close()
	}

	return nil
}
