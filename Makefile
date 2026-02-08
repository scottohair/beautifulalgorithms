.PHONY: all tokens web-dev web-build bridge-dev test test-web test-parity validate-parity validate-tokens clean

all: tokens web-build

# Design Tokens
tokens:
	cd design-tokens && npm run build

# Web
web-install:
	cd web && npm install

web-dev: tokens
	cd web && npm run dev

web-build: tokens
	cd web && npm run build

web-lint:
	cd web && npm run lint

# Bridge Service
bridge-install:
	cd bridge && npm install

bridge-dev:
	cd bridge && npm run dev

bridge-build:
	cd bridge && npm run build

# Testing & Validation
test: test-web validate-parity validate-tokens

test-web:
	cd web && npm test

test-parity:
	npx tsx scripts/validate-parity.js

validate-parity:
	npx tsx scripts/validate-parity.js

validate-tokens:
	node scripts/validate-tokens.js

# Setup
setup: tokens web-install bridge-install

# Clean
clean:
	cd design-tokens && npm run clean
	rm -rf web/.next web/out
	rm -rf bridge/dist
