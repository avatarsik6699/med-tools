package stat

import (
	constant "link-shorter/pkg"
	"link-shorter/pkg/api"
	"link-shorter/pkg/lib"
	"link-shorter/pkg/middleware"
	"link-shorter/pkg/types"
	"net/http"
)

type StatHandler struct {
	statRepository *StatRepository
	statService    *StatService
}

func NewStatHandler(
	r *http.ServeMux,
	statRepository *StatRepository,
	statService *StatService,
) *StatHandler {
	h := &StatHandler{
		statRepository: statRepository,
		statService:    statService,
	}

	r.HandleFunc("GET /stat", middleware.WithDecoder(
		func() types.Decoder { return &FindAllRequestDTO{} },
		middleware.WithValidator[*FindAllRequestDTO](
			h.FindAll(),
		),
	))

	return h
}

func (h *StatHandler) FindAll() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		dto, _ := lib.GetContextValueByKey[*FindAllRequestDTO](r, constant.CtxDefaultDTOKey)

		data, err := h.statService.FindAll(*dto)

		if err != nil {
			api.SendCustomError(w, http.StatusNotFound, err)
		} else {
			api.SendSuccess(w, data)
		}
	}
}
