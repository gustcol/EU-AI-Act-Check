import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initI18n(): Promise<void> {
  await i18next
    .use(Backend)
    .init({
      backend: {
        loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json')
      },
      fallbackLng: 'en',
      supportedLngs: ['en', 'pt', 'es', 'de', 'fr', 'it'],
      preload: ['en', 'pt', 'es', 'de', 'fr', 'it'],
      ns: ['common', 'errors', 'email', 'risk'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false
      }
    });
}

export function t(key: string, options?: Record<string, unknown>): string {
  return i18next.t(key, options);
}

export function changeLanguage(lang: string): Promise<void> {
  return i18next.changeLanguage(lang) as unknown as Promise<void>;
}

export { i18next };
