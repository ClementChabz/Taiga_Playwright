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

## Configuration du timeout

Le timeout par défaut est configuré dans `playwright.config.ts` :
```typescript
timeout: 300 * 1000,
```

> ⚠️ Le test 03 (création de 20 issues) est particulièrement long — ne pas descendre en dessous de 300 secondes pour ce test.

## Tests

| # | Description | Notes |
|---|-------------|-------|
| 01 | Naviguer vers les issues du projet | |
| 02 | Créer une issue | |
| 03 | Créer 20 issues depuis JSON | Timeout élevé nécessaire |
| 04 | Filtrer Type = Bug et Severity = Critical | |
| 05 | Rechercher et supprimer une issue par référence | ⚠️ Déconseillé — nécessite de connaître une référence existante. Si la ref n'existe pas, le test échoue avec le message `L'issue #X n'existe pas` |
| 06 | Créer une issue et la supprimer par référence | ✅ Préféré — autonome, crée et supprime sa propre issue |

> 💡 Le test 06 récupère automatiquement la référence de l'issue créée depuis la réponse API de Taiga (status 201), ce qui garantit un ref exact peu importe l'ordre d'exécution des tests.

## Génération des données

Les 20 issues sont générées avec Faker et stockées dans `data/issues.json`. Le fichier est déjà généré mais peut être regénéré à tout moment avec de nouvelles données aléatoires :
```bash
npx tsx data/generate-issues.ts
```

> ⚠️ Regénérer le fichier écrase les données précédentes.

## Dépendances principales

| Package | Usage |
|---------|-------|
| `@playwright/test` | Framework de tests |
| `@faker-js/faker` | Génération de données aléatoires |
| `dotenv` | Chargement des variables d'environnement |

## Structure
```
├── .auth/              # Session Playwright (gitignore)
├── .env                # Credentials (gitignore)
├── data/
│   ├── generate-issues.ts
│   └── issues.json
├── pages/              # Page Object Model
│   ├── project.page.ts
│   └── issues.page.ts
├── tests/
│   ├── auth.setup.ts   # Setup authentification
│   └── taiga.spec.ts   # Tests métier
└── playwright.config.ts
```