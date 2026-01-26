import { t, type Dictionary } from 'intlayer';

/**
 * Navigation translations
 * Labels for main navigation menu items
 */
const navContent = {
  key: 'nav',
  content: {
    dashboard: t({
      en: 'Dashboard',
      pt: 'Painel',
      es: 'Panel',
      de: 'Dashboard',
      fr: 'Tableau de bord',
      it: 'Dashboard',
    }),
    systems: t({
      en: 'AI Systems',
      pt: 'Sistemas de IA',
      es: 'Sistemas de IA',
      de: 'KI-Systeme',
      fr: 'Systèmes IA',
      it: 'Sistemi IA',
    }),
    assessments: t({
      en: 'Assessments',
      pt: 'Avaliações',
      es: 'Evaluaciones',
      de: 'Bewertungen',
      fr: 'Évaluations',
      it: 'Valutazioni',
    }),
    checklist: t({
      en: 'Checklist',
      pt: 'Lista de Verificação',
      es: 'Lista de verificación',
      de: 'Checkliste',
      fr: 'Liste de contrôle',
      it: 'Checklist',
    }),
    reports: t({
      en: 'Reports',
      pt: 'Relatórios',
      es: 'Informes',
      de: 'Berichte',
      fr: 'Rapports',
      it: 'Rapporti',
    }),
    settings: t({
      en: 'Settings',
      pt: 'Configurações',
      es: 'Configuración',
      de: 'Einstellungen',
      fr: 'Paramètres',
      it: 'Impostazioni',
    }),
  },
} satisfies Dictionary;

export default navContent;
