package middleware

import (
	"context"
	"net"
	"net/http"
	"slices"
	"strings"
)

type WithRealIPContextKey string

const (
	RealIPContextKey WithRealIPContextKey = "real_ip"
)

type RealIPConfig struct {
	TrustedProxies []string // Список доверенных прокси IP
	Headers        []string // Приоритет заголовков для извлечения IP
}

func DefaultRealIPConfig() *RealIPConfig {
	return &RealIPConfig{
		TrustedProxies: []string{"127.0.0.1", "::1"},
		Headers: []string{
			"CF-Connecting-IP", // Cloudflare
			"X-Real-IP",        // Nginx/Apache
			"X-Forwarded-For",  // Стандартный
		},
	}
}

func WithRealIP(config *RealIPConfig) func(http.Handler) http.Handler {
	if config == nil {
		config = DefaultRealIPConfig()
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			realIP := extractRealIP(r, config)
			// Добавляем реальный IP в контекст для использования в handlers
			ctx := context.WithValue(r.Context(), RealIPContextKey, realIP)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func extractRealIP(r *http.Request, config *RealIPConfig) string {
	// Проверяем заголовки в порядке приоритета
	for _, header := range config.Headers {
		if ip := r.Header.Get(header); ip != "" {
			if header == "X-Forwarded-For" {
				return extractFirstValidIP(ip, config.TrustedProxies)
			}
			if isValidIP(ip) {
				return ip
			}
		}
	}

	// Fallback к RemoteAddr
	return extractIPFromRemoteAddr(r.RemoteAddr)
}

func extractFirstValidIP(forwarded string, trustedProxies []string) string {
	ips := strings.Split(forwarded, ",")

	// Ищем первый публичный IP, пропуская доверенные прокси
	for _, ip := range ips {
		ip = strings.TrimSpace(ip)
		if isValidPublicIP(ip) && !isTrustedProxy(ip, trustedProxies) {
			return ip
		}
	}

	// Если не нашли публичный, возвращаем первый валидный
	for _, ip := range ips {
		ip = strings.TrimSpace(ip)
		if isValidIP(ip) {
			return ip
		}
	}

	return ""
}

func isValidIP(ip string) bool {
	return net.ParseIP(ip) != nil
}

func isValidPublicIP(ip string) bool {
	if !isValidIP(ip) {
		return false
	}

	// Проверяем что IP не приватный
	parsedIP := net.ParseIP(ip)
	if parsedIP == nil {
		return false
	}

	// Проверяем приватные диапазоны
	privateRanges := []string{
		"10.0.0.0/8",
		"172.16.0.0/12",
		"192.168.0.0/16",
		"127.0.0.0/8",
		"::1/128",
	}

	for _, cidr := range privateRanges {
		_, network, _ := net.ParseCIDR(cidr)
		if network.Contains(parsedIP) {
			return false
		}
	}

	return true
}

func isTrustedProxy(ip string, trustedProxies []string) bool {
	return slices.Contains(trustedProxies, ip)
}

func extractIPFromRemoteAddr(remoteAddr string) string {
	// Убираем порт если есть
	if host, _, err := net.SplitHostPort(remoteAddr); err == nil {
		return host
	}

	return remoteAddr
}

// Helper функция для получения реального IP из контекста
func GetRealIP(r *http.Request) string {
	if ip, ok := r.Context().Value(RealIPContextKey).(string); ok {
		return ip
	}
	return r.RemoteAddr
}

// Доверенные прокси IP - это IP-адреса промежуточных серверов (прокси, балансировщиков нагрузки, CDN),
// через которые проходит запрос. Например:
//   - 127.0.0.1 - локальный сервер
//   - ::1 - IPv6 локальный адрес
//   - IP вашего Nginx/Apache сервера
//
// Когда запрос идет через прокси, в заголовке X-Forwarded-For может быть цепочка IP:
// "клиент, прокси1, прокси2". Мы доверяем нашим прокси и пропускаем их IP, чтобы получить
// реальный IP клиента.
//
// Приватные диапазоны - это зарезервированные IP-адреса для внутренних сетей:
//   - 10.0.0.0/8 - корпоративные сети
//   - 172.16.0.0/12 - средние сети
//   - 192.168.0.0/16 - домашние/офисные сети
//   - 127.0.0.0/8 - localhost
//
// Эти IP не могут быть "реальными" IP клиентов из интернета, поэтому мы их фильтруем
// при поиске публичного IP.
//
// Логика работы:
//   1. Проверяем заголовки в порядке приоритета
//   2. Для X-Forwarded-For ищем первый публичный IP, пропуская доверенные прокси
//   3. Если не находим публичный, берем первый валидный
//   4. Fallback на RemoteAddr
