package lib

import (
	"fmt"
	"link-shorter/pkg/types"
	"strings"
	"testing"
	"time"

	"github.com/fatih/color"
)

func TestSha256Of(t *testing.T) {
	start := time.Now()
	color.Cyan("\n=== Running SHA256 Tests ===\n")

	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "empty_string",
			input:    "",
			expected: "e3b0c442",
		},
		{
			name:     "simple_string",
			input:    "test",
			expected: "9f86d081",
		},
	}

	for _, item := range tests {
		t.Run(item.name, func(t *testing.T) {
			result := sha256Of(item.input)
			if got := fmt.Sprintf("%x", result)[:8]; got != item.expected {
				color.Red("❌ Test failed: %s", item.name)
				color.Yellow("Input: %v", item.input)
				color.Green("Expected: %v", item.expected)
				color.Red("Got: %v", got)
				t.Fail()
			} else {
				color.Green("✅ Test passed: %s", item.name)
			}
		})
	}

	color.Cyan("Total SHA256 test time: %v\n", time.Since(start))
}

func TestBase58Encoded(t *testing.T) {
	start := time.Now()
	color.Cyan("\n=== Running Base58 Tests ===\n")

	tests := []struct {
		name     string
		input    []byte
		expected string
	}{
		{
			name:     "empty bytes",
			input:    []byte{},
			expected: "",
		},
		{
			name:     "simple number",
			input:    []byte("123"),
			expected: "38",
		},
	}

	for _, item := range tests {
		t.Run(item.name, func(t *testing.T) {
			result := base58Encoded(item.input)
			if result != item.expected {
				color.Red("❌ Test failed: %s", item.name)
				color.Yellow("Input: %v", item.input)
				color.Green("Expected: %v", item.expected)
				color.Red("Got: %v", result)
				t.Fail()
			} else {
				color.Green("✅ Test passed: %s", item.name)
			}
		})
	}

	color.Cyan("Total Base58 test time: %v\n", time.Since(start))
}

func TestGenerateShortLink(t *testing.T) {
	start := time.Now()
	color.Cyan("\n=== Running ShortLink Generation Tests ===\n")

	tests := []struct {
		name        string
		initialLink string
		userId      types.PrimaryKey
		wantLength  int
	}{
		{
			name:        "simple case",
			initialLink: "https://example.com",
			userId:      1,
			wantLength:  8,
		},
		{
			name:        "empty strings",
			initialLink: "",
			userId:      0,
			wantLength:  8,
		},
	}

	for _, item := range tests {
		t.Run(item.name, func(t *testing.T) {
			result := GenerateShortLink(item.initialLink, item.userId)

			if len(result) != item.wantLength {
				color.Red("❌ Length test failed: %s", item.name)
				color.Yellow("Expected length: %v", item.wantLength)
				color.Red("Got length: %v", len(result))
				t.Fail()
			}

			validChars := "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
			for _, char := range result {
				if !strings.ContainsRune(validChars, char) {
					color.Red("❌ Invalid character test failed: %s", item.name)
					color.Yellow("Invalid character found: %c", char)
					t.Fail()
				}
			}

			color.Green("✅ Test passed: %s", item.name)
		})
	}

	color.Cyan("Total ShortLink test time: %v\n", time.Since(start))
}

func TestGenerateShortLinkUniqueness(t *testing.T) {
	start := time.Now()
	color.Cyan("\n=== Running Uniqueness Tests ===\n")

	results := make(map[string]bool)
	iterations := 1000

	for i := 0; i < iterations; i++ {
		link := fmt.Sprintf("https://example.com/%d", i)

		result := GenerateShortLink(link, types.PrimaryKey(i))

		if results[result] {
			color.Red("❌ Uniqueness test failed")
			color.Yellow("Duplicate result found: %s", result)
			t.Fail()
		}
		results[result] = true
	}

	color.Green("✅ All %d links are unique", iterations)
	color.Cyan("Total uniqueness test time: %v\n", time.Since(start))
}
