import { Locales, type IntlayerConfig } from 'intlayer';

/**
 * Intlayer Configuration for EU AI Act Compliance Platform
 *
 * This configuration integrates Intlayer with the existing i18next setup.
 * Content declarations in ./src/content/ are built into dictionaries,
 * which are then merged by the merge-locales script into i18next JSON files.
 *
 * Workflow:
 * 1. `intlayer build` generates .intlayer/dictionary/{namespace}.json
 * 2. `merge-locales` script combines them into ./src/locales/{locale}.json
 *
 * @see https://intlayer.org/doc/concept/configuration
 */
const config: IntlayerConfig = {
  internationalization: {
    locales: [
      Locales.ENGLISH,
      Locales.PORTUGUESE,
      Locales.SPANISH,
      Locales.GERMAN,
      Locales.FRENCH,
      Locales.ITALIAN,
    ],
    defaultLocale: Locales.ENGLISH,
    strictMode: 'inclusive_localization',
  },
  content: {
    // Content declaration files location
    contentDir: ['./src/content'],
    // File extensions for content declarations
    fileExtensions: ['.content.ts', '.content.tsx'],
    // Watch for changes in development
    watch: process.env.NODE_ENV === 'development',
  },
  // Optional: AI-powered translation filling
  // Uncomment and configure to enable automatic translation
  // ai: {
  //   provider: 'openai',
  //   model: 'gpt-4o-mini',
  //   apiKey: process.env.OPENAI_API_KEY,
  // },
};

export default config;
