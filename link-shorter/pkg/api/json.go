package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type GenericPayload = any
type GenericData = any

// Response представляет стандартный JSON ответ
type Response[D GenericData] struct {
	Status string `json:"status"`
	Data   D      `json:"data,omitempty"`
	Error  string `json:"error,omitempty"`
}

// DecodeRequest декодирует JSON тело запроса в структуру
func ParseBody[P GenericPayload](r *http.Request, payload *P) error {

	if !strings.Contains(r.Header.Get("Content-Type"), "application/json") {
		return ErrInvalidContentType
	}

	decoder := json.NewDecoder(r.Body)
	decoder.UseNumber()

	if err := decoder.Decode(payload); err != nil {
		return errors.Join(ErrInvalidJSON, err)
	}

	return nil
}

// SendError отправляет JSON ответ с ошибкой
func SendDefaultError(w http.ResponseWriter, status int) {
	sendJSON(w, status, Response[GenericData]{
		Status: "error",
		Data:   nil,
		Error:  http.StatusText(status),
	})
}

// SendError отправляет JSON ответ с ошибкой + текст
func SendCustomError(w http.ResponseWriter, status int, err error) {
	sendJSON(w, status, Response[GenericData]{
		Status: "error",
		Data:   nil,
		Error:  err.Error(),
	})
}

// SendSuccess отправляет успешный JSON ответ
func SendSuccess[D GenericData](w http.ResponseWriter, data D) {
	sendJSON(w, http.StatusOK, Response[D]{
		Status: "success",
		Data:   data,
	})
}

// SendJSON отправляет JSON ответ
func sendJSON[D GenericData](w http.ResponseWriter, status int, data D) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
