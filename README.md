# Playwright Taiga - Tests automatisés

## Prérequis

- Node.js 20+
- Un compte [Taiga](https://tree.taiga.io) avec un projet existant

## Installation
```bash
npm install
```

## Configuration

Crée un fichier `.env` à la racine du projet :
```
TAIGA_USERNAME=ton_username
TAIGA_PASSWORD=ton_mot_de_passe
TAIGA_PROJECT_SLUG=ton-slug-de-projet
```

> ⚠️ Le fichier `.env` est dans `.gitignore` — ne jamais le committer.

## Lancer les tests
```bash
# Setup authentification uniquement
npx playwright test --project=setup

# Tous les tests
npx playwright test

# Mode headed (navigateur visible)
npx playwright test --headed

# Un test spécifique
npx playwright test --headed -g "01 - Naviguer"
```

## Structure
```
├── .auth/              # Session Playwright (gitignore)
├── .env                # Credentials (gitignore)
├── pages/              # Page Object Model
│   └── project.page.ts
├── tests/
│   ├── auth.setup.ts   # Setup authentification
│   └── taiga.spec.ts   # Tests métier
└── playwright.config.ts
```