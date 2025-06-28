package main

import (
	"flag"
	"fmt"
	"link-shorter/config"
	"link-shorter/db"
	"link-shorter/internal/link"
	"link-shorter/internal/stat"
	"log"
	"os/user"

	"gorm.io/gorm"
)

func main() {
	withDrop := flag.Bool("drop", false, "Drop all tables")
	flag.Parse()

	conf := config.NewConfig()
	conn := db.NewConnection(&db.Deps{
		Config: conf,
	})

	if *withDrop {
		if err := ResetDatabase(conn.Instance); err != nil {
			log.Panicln(err)
		}
	}

	if err := conn.Instance.AutoMigrate(
		&link.Link{},
		&user.User{},
		&stat.Stat{},
	); err != nil {
		log.Panicln(err)
	}
}

func ResetDatabase(db *gorm.DB) error {
	// Отключаем проверку внешних ключей
	db.Exec("SET session_replication_role = 'replica'")

	// Получаем все таблицы
	var tables []string
	db.Raw("SELECT tablename FROM pg_tables WHERE schemaname = 'public'").Scan(&tables)

	// Удаляем все таблицы
	for _, table := range tables {
		db.Exec(fmt.Sprintf("DROP TABLE IF EXISTS %s CASCADE", table))
	}

	// Включаем проверку внешних ключей
	db.Exec("SET session_replication_role = 'origin'")

	return nil
}
