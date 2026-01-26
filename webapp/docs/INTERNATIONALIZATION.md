# Internationalization (i18n) Guide

This document describes the internationalization setup for the EU AI Act Compliance Platform.

## Overview

The platform supports 6 European languages:
- **English (EN)** - Default language
- **Portuguese (PT)**
- **Spanish (ES)**
- **German (DE)**
- **French (FR)**
- **Italian (IT)**

## Technology Stack

| Component | Description |
|-----------|-------------|
| **i18next** | Core internationalization framework |
| **react-i18next** | React bindings for i18next |
| **Intlayer** | Translation management and content declarations |
| **@intlayer/sync-json-plugin** | Syncs content to i18next JSON format |

## Architecture

```
webapp/frontend/
├── intlayer.config.ts          # Intlayer configuration
├── scripts/
│   └── merge-locales.ts        # Script to merge namespace files
├── src/
│   ├── content/                # Content declarations (source of truth)
│   │   ├── index.ts            # Exports all content modules
│   │   ├── common.content.ts   # Common UI elements
│   │   ├── auth.content.ts     # Authentication strings
│   │   ├── nav.content.ts      # Navigation labels
│   │   ├── dashboard.content.ts
│   │   ├── systems.content.ts
│   │   ├── assessment.content.ts
│   │   ├── checklist.content.ts
│   │   ├── reports.content.ts
│   │   ├── riskLevels.content.ts
│   │   └── errors.content.ts
│   ├── locales/
│   │   ├── .intlayer/          # Intermediate files (gitignored)
│   │   │   └── {locale}/       # Namespace JSON files
│   │   ├── en.json             # Merged English translations
│   │   ├── pt.json             # Merged Portuguese translations
│   │   ├── es.json             # Merged Spanish translations
│   │   ├── de.json             # Merged German translations
│   │   ├── fr.json             # Merged French translations
│   │   └── it.json             # Merged Italian translations
│   └── i18n.ts                 # i18next initialization
```

## Translation Workflow

The translation process involves two steps:

1. **Intlayer Build**: Generates individual namespace JSON files
2. **Merge Locales**: Combines namespace files into single locale files

```mermaid
flowchart LR
    A[Content Files<br/>*.content.ts] --> B[Intlayer Build]
    B --> C[Namespace Files<br/>.intlayer/{locale}/{ns}.json]
    C --> D[Merge Script]
    D --> E[Locale Files<br/>{locale}.json]
    E --> F[i18next]
```

## Content Declaration Format

Content is declared using TypeScript files with the `.content.ts` extension:

```typescript
import { t, type Dictionary } from 'intlayer';

const myContent = {
  key: 'myNamespace',  // Becomes the JSON filename
  content: {
    greeting: t({
      en: 'Hello',
      pt: 'Olá',
      es: 'Hola',
      de: 'Hallo',
      fr: 'Bonjour',
      it: 'Ciao',
    }),
    // More translations...
  },
} satisfies Dictionary;

export default myContent;
```

## Commands

### Build Translations

Generates i18next-compatible JSON files from content declarations:

```bash
npm run translate
# or
npm run intlayer:build
```

### Fill Missing Translations (AI-Powered)

Automatically fills missing translations using AI:

```bash
npm run translate:fill
# or
npm run intlayer:fill
```

> **Note**: Requires an AI provider API key configured in `intlayer.config.ts`

### Watch Mode (Development)

Automatically rebuilds when content files change:

```bash
npm run intlayer:watch
```

## Adding New Translations

### 1. Add to Existing Content File

Edit the appropriate `.content.ts` file:

```typescript
// src/content/common.content.ts
const commonContent = {
  key: 'common',
  content: {
    // Add new translation key
    newButton: t({
      en: 'New Button',
      pt: 'Novo Botão',
      es: 'Nuevo Botón',
      de: 'Neue Schaltfläche',
      fr: 'Nouveau Bouton',
      it: 'Nuovo Pulsante',
    }),
  },
};
```

### 2. Create New Content File

For new sections, create a new `.content.ts` file:

```typescript
// src/content/newSection.content.ts
import { t, type Dictionary } from 'intlayer';

const newSectionContent = {
  key: 'newSection',
  content: {
    title: t({
      en: 'New Section',
      // ... other languages
    }),
  },
} satisfies Dictionary;

export default newSectionContent;
```

Then export it from `src/content/index.ts`:

```typescript
export { default as newSection } from './newSection.content';
```

### 3. Build and Update

```bash
npm run translate
```

## Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>{t('dashboard.overview')}</p>
    </div>
  );
}
```

## AI Translation Configuration

To enable AI-powered translation filling, configure the AI provider in `intlayer.config.ts`:

```typescript
const config: IntlayerConfig = {
  // ... other config
  ai: {
    provider: 'openai',  // or 'anthropic', 'google'
    model: 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
  },
};
```

Supported providers:
- **OpenAI**: GPT-4, GPT-4o, GPT-4o-mini
- **Anthropic**: Claude models
- **Google**: Gemini models

## Best Practices

1. **Keep content files organized by domain** - Each file should represent a logical section of the app

2. **Use descriptive keys** - Keys should clearly describe the content:
   ```typescript
   // Good
   createSystemButton: t({ en: 'Create AI System', ... })

   // Avoid
   btn1: t({ en: 'Create AI System', ... })
   ```

3. **Group related translations** - Keep related strings in the same content file

4. **Run build before committing** - Ensure JSON files are up to date:
   ```bash
   npm run translate && git add src/locales/
   ```

5. **Review AI translations** - Always review AI-generated translations for accuracy

## Troubleshooting

### Translations not updating

1. Clear the Intlayer cache:
   ```bash
   rm -rf .intlayer
   npm run translate
   ```

2. Restart the development server

### Missing translations in production

Ensure the build step includes translation generation:
```bash
npm run build  # Includes intlayer:build
```

### Type errors in content files

Ensure the `satisfies Dictionary` constraint is present:
```typescript
const content = {
  // ...
} satisfies Dictionary;  // Required for type safety
```

## License

Intlayer is licensed under Apache 2.0, which is compatible with this project's MIT license.

- **Intlayer**: [Apache 2.0 License](https://github.com/aymericzip/intlayer/blob/main/LICENSE)
- **i18next**: [MIT License](https://github.com/i18next/i18next/blob/master/LICENSE)

## Resources

- [Intlayer Documentation](https://intlayer.org/doc)
- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Intlayer + i18next Integration Guide](https://intlayer.org/blog/intlayer-with-next-i18next)
