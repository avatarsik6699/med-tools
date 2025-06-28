package lib

import (
	"crypto/sha256"
	"fmt"
	"link-shorter/pkg/types"
	"log"
	"math/big"
	"os"

	"github.com/itchyny/base58-go"
)

func sha256Of(input string) []byte {
	algorithm := sha256.New()
	algorithm.Write([]byte(input))
	return algorithm.Sum(nil)
}

func base58Encoded(bytes []byte) string {
	encoding := base58.BitcoinEncoding
	encoded, err := encoding.Encode(bytes)
	if err != nil {
		log.Panicln(err.Error())
		os.Exit(1)
	}
	return string(encoded)
}

/*
Исходная ссылка: "https://example.com"
UserId: "user123"

 1. SHA-256 хеш (первые 16 символов):
    "a1b2c3d4e5f6g7h8..."

 2. После конвертации в число:
    12345678901234567890

 3. После Base58 кодирования:
    "2NEpo7TZRRrLZSi2U"

 4. После взятия первых 8 символов:
    "2NEpo7TZ"
*/
func GenerateShortLink(initialLink string, userID types.PrimaryKey) string {
	urlHashBytes := sha256Of(initialLink + fmt.Sprintf("%d", userID))
	generatedNumber := new(big.Int).SetBytes(urlHashBytes).Uint64()
	finalString := base58Encoded(fmt.Appendf(nil, "%d", generatedNumber))
	return finalString[:8]
}
