package config

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	DatabaseURL string
	Port        string
}

func Load() (*Config, error) {
	cfg := Config{}

	dbURL, err := getEnv("DATABASE_URL")
	if err != nil {
		return nil, err
	}

	port, err := getEnv("API_PORT")
	if err != nil {
		port = "8080"
	}

	if !strings.HasPrefix(port, ":") {
		port = ":" + port
	}

	cfg.DatabaseURL = dbURL
	cfg.Port = port

	return &cfg, nil
}

func getEnv(key string) (string, error) {
	value := os.Getenv(key)
	if strings.TrimSpace(value) == "" {
		return "", fmt.Errorf("Environment variable %s is not set", key)
	}
	return value, nil
}
