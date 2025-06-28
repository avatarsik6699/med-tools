package jwt

import "github.com/golang-jwt/jwt/v5"

type JWTService struct {
	secret string
}

func NewJwtService(secret string) *JWTService {
	return &JWTService{
		secret: secret,
	}
}

func (s *JWTService) Create(claims map[string]any) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims(claims))

	return token.SignedString([]byte(s.secret))
}

func (s *JWTService) Parse(rawToken string) (Payload, bool, error) {
	parsedToken, err := jwt.Parse(rawToken, func(t *jwt.Token) (any, error) {
		return []byte(s.secret), nil
	})

	if err != nil {
		return nil, parsedToken.Valid, err
	}

	if payload, ok := parsedToken.Claims.(Payload); ok {
		return payload, parsedToken.Valid, nil
	}

	return nil, false, nil
}
