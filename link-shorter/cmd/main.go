package main

import (
	"link-shorter/config"
	"link-shorter/db"
	"link-shorter/internal/auth"
	"link-shorter/internal/link"
	"link-shorter/internal/stat"
	"link-shorter/internal/user"
	"link-shorter/pkg/events"
	"link-shorter/pkg/middleware"
	"link-shorter/pkg/service/jwt"
	"log"
	"net/http"
)

func main() {
	conf := config.NewConfig()
	router := http.NewServeMux()
	cn := db.NewConnection(&db.Deps{
		Config: conf,
	})

	defer cn.Close()

	// Repositories
	linkRepository := link.NewLinkRepository(cn)
	userRepository := user.NewUserRepository(cn)
	statRepository := stat.NewStatRepository(cn)

	// Services
	linkService := link.NewLinkService(linkRepository)
	jwtService := jwt.NewJwtService(conf.Auth.Secret)
	eventManager := events.NewEventManager()
	statService := stat.NewStatService(
		statRepository,
		linkRepository,
	)

	// Event handlers
	statEventHandler := stat.NewStatEventHandler(statService)

	if err := eventManager.Sub(events.EventLinkGoTo, statEventHandler); err != nil {
		log.Panicf("failed to subscribe to event %s: %v", events.EventLinkCreated, err)
	}

	// Handlers
	auth.NewAuthHandler(router, jwtService, userRepository)
	link.NewLinkHandler(router, linkService, linkRepository, jwtService, eventManager)
	stat.NewStatHandler(router, statRepository, statService)

	server := http.Server{
		Addr: ":8081",
		Handler: middleware.WithRealIP(nil)(
			middleware.WithCORS(
				middleware.WithLogging(
					router,
				),
			)),
	}

	server.ListenAndServe()
}
