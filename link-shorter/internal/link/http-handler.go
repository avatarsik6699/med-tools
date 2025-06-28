package link

import (
	constant "link-shorter/pkg"
	"link-shorter/pkg/api"
	"link-shorter/pkg/events"
	"link-shorter/pkg/lib"
	"link-shorter/pkg/middleware"
	"link-shorter/pkg/service/jwt"
	"link-shorter/pkg/types"
	"net/http"
)

type LinkHandler struct {
	linkService    Service
	linkRepository Repository
	eventManager   events.EventManager
}

func NewLinkHandler(
	r *http.ServeMux,
	linkService Service,
	linkRepository Repository,
	jwtService *jwt.JWTService,
	eventManager events.EventManager,
) *LinkHandler {
	h := &LinkHandler{
		linkService:    linkService,
		linkRepository: linkRepository,
		eventManager:   eventManager,
	}

	r.HandleFunc("POST /link", middleware.WithDecoder(
		func() types.Decoder { return &CreateReqestDTO{} },
		middleware.WithValidator[*CreateReqestDTO](
			h.Create(),
		),
	))

	// r.HandleFunc("PATCH /link/{id}", middleware.WithAuth(h.Update(), jwtService))
	r.HandleFunc("PATCH /link/{id}", middleware.WithDecoder(
		func() types.Decoder { return &UpdateRequestDTO{} },
		middleware.WithValidator[*UpdateRequestDTO](
			h.Update(),
		),
	))

	r.HandleFunc("DELETE /link/{id}", middleware.WithDecoder(
		func() types.Decoder { return &DeleteRequestDTO{} },
		middleware.WithValidator[*DeleteRequestDTO](
			h.Delete(),
		),
	))

	r.HandleFunc("GET /link/goto/{hash}", h.GoTo())
	r.HandleFunc("GET /link/details/{id}", h.GoTo())
	r.HandleFunc("GET /link", middleware.WithDecoder(
		func() types.Decoder { return &FindAllRequestDTO{} },
		middleware.WithValidator[*FindAllRequestDTO](
			h.FindAll(),
		),
	))

	return h
}

func (h *LinkHandler) Create() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dto, _ := lib.GetContextValueByKey[*CreateReqestDTO](r, constant.CtxDefaultDTOKey)

		link, err := h.linkService.Create(*dto)

		if err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)
			return
		}

		api.SendSuccess(w, link)
	}
}

func (h *LinkHandler) Delete() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// TODO: Анонимные пользователи не могут удалять ссылки
		// TODO: Авторизованный пользователь не может удалить ссылку, которая ему не принадлежит
		dto, _ := lib.GetContextValueByKey[*DeleteRequestDTO](r, constant.CtxDefaultDTOKey)

		if err := h.linkService.Delete(*dto); err != nil {
			api.SendCustomError(w, http.StatusNotFound, err)
		} else {
			api.SendSuccess(w, &DeleteResponseDTO{ID: dto.ID})
		}

	}
}

func (h *LinkHandler) Update() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dto, _ := lib.GetContextValueByKey[*UpdateRequestDTO](r, constant.CtxDefaultDTOKey)
		// TODO: Анонимные пользователи не могут редактировать ссылки
		// TODO: Авторизованный пользователь не может редактировать ссылку, которая ему не принадлежит

		// userLogin := r.Context().Value(middleware.USER_LOGIN_KEY)
		// userID := r.Context().Value(middleware.USER_ID_KEY)
		if err := h.linkService.Update(*dto); err != nil {
			api.SendCustomError(w, http.StatusNotFound, err)
		} else {
			api.SendSuccess(w, &UpdateResponseDTO{ID: dto.ID})
		}

	}
}

func (h *LinkHandler) GoTo() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		hash, err := api.ParsePathParam(r, "hash", api.ParseHash)

		if err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)
			return
		}

		targetLinkToRedirect, err := h.linkRepository.FindOneByHash(hash.Value)

		if err != nil {
			api.SendCustomError(w, http.StatusNotFound, err)
		} else {
			// TODO: Need to use common method
			realIP := middleware.GetRealIP(r)

			h.eventManager.Pub(
				events.Event{
					Type: events.EventLinkGoTo,
					Payload: events.LinkGoToEvent{
						LinkID: targetLinkToRedirect.ID,
						// TODO:
						// Также стоит рассмотреть ограничение длины этих полей в базе данных для предотвращения DoS атак через очень длинные заголовки.
						// UserAgent - может быть пустым или содержать невалидные данные от ботов/скриптов, но это нормально для аналитики.
						// Referer - может быть пустым (прямые переходы, HTTPS→HTTP, privacy settings) или содержать вредоносные данные. Лучше добавить валидацию:
						UserAgent: r.UserAgent(),
						IP:        realIP,
						Referer:   r.Header.Get("Referer"),
					},
				},
			)

			http.Redirect(w, r, targetLinkToRedirect.URL, http.StatusMovedPermanently)
		}
	}
}

func (h *LinkHandler) FindOneByID() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := api.ParsePathParam(r, "id", api.ParseUint)

		if err != nil {
			api.SendCustomError(w, http.StatusBadRequest, err)
			return
		}

		targetLink, err := h.linkService.FindOneByID(id.Value)

		if err != nil {
			api.SendCustomError(w, http.StatusNotFound, err)
		} else {
			api.SendSuccess(w, targetLink)
		}
	}
}

func (h *LinkHandler) FindAll() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dto, _ := lib.GetContextValueByKey[*FindAllRequestDTO](r, constant.CtxDefaultDTOKey)

		data, err := h.linkService.FindAll(*dto)

		if err != nil {
			api.SendCustomError(w, http.StatusNotFound, err)
		} else {
			api.SendSuccess(w, data)
		}
	}
}
