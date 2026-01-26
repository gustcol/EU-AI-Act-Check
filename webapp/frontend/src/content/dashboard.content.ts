import { t, type Dictionary } from 'intlayer';

/**
 * Dashboard translations
 * Main dashboard page labels and metrics
 */
const dashboardContent = {
  key: 'dashboard',
  content: {
    title: t({
      en: 'Dashboard',
      pt: 'Painel',
      es: 'Panel',
      de: 'Dashboard',
      fr: 'Tableau de bord',
      it: 'Dashboard',
    }),
    overview: t({
      en: 'Overview',
      pt: 'Visão Geral',
      es: 'Resumen',
      de: 'Übersicht',
      fr: 'Aperçu',
      it: 'Panoramica',
    }),
    totalSystems: t({
      en: 'Total AI Systems',
      pt: 'Total de Sistemas IA',
      es: 'Total de Sistemas IA',
      de: 'Gesamte KI-Systeme',
      fr: 'Total des Systèmes IA',
      it: 'Totale Sistemi IA',
    }),
    pendingAssessments: t({
      en: 'Pending Assessments',
      pt: 'Avaliações Pendentes',
      es: 'Evaluaciones Pendientes',
      de: 'Ausstehende Bewertungen',
      fr: 'Évaluations en attente',
      it: 'Valutazioni in sospeso',
    }),
    completedAssessments: t({
      en: 'Completed Assessments',
      pt: 'Avaliações Concluídas',
      es: 'Evaluaciones Completadas',
      de: 'Abgeschlossene Bewertungen',
      fr: 'Évaluations terminées',
      it: 'Valutazioni completate',
    }),
    complianceProgress: t({
      en: 'Compliance Progress',
      pt: 'Progresso de Conformidade',
      es: 'Progreso de Cumplimiento',
      de: 'Compliance-Fortschritt',
      fr: 'Progrès de conformité',
      it: 'Progresso di conformità',
    }),
    recentActivity: t({
      en: 'Recent Activity',
      pt: 'Atividade Recente',
      es: 'Actividad Reciente',
      de: 'Letzte Aktivität',
      fr: 'Activité récente',
      it: 'Attività recente',
    }),
    quickActions: t({
      en: 'Quick Actions',
      pt: 'Ações Rápidas',
      es: 'Acciones Rápidas',
      de: 'Schnellaktionen',
      fr: 'Actions rapides',
      it: 'Azioni rapide',
    }),
    riskDistribution: t({
      en: 'Risk Distribution',
      pt: 'Distribuição de Risco',
      es: 'Distribución de Riesgo',
      de: 'Risikoverteilung',
      fr: 'Distribution des risques',
      it: 'Distribuzione del rischio',
    }),
    registerSystem: t({
      en: 'Register AI System',
      pt: 'Registrar Sistema de IA',
      es: 'Registrar Sistema de IA',
      de: 'KI-System registrieren',
      fr: 'Enregistrer un Système IA',
      it: 'Registra Sistema IA',
    }),
    startAssessment: t({
      en: 'Start Assessment',
      pt: 'Iniciar Avaliação',
      es: 'Iniciar Evaluación',
      de: 'Bewertung starten',
      fr: 'Démarrer une évaluation',
      it: 'Inizia valutazione',
    }),
  },
} satisfies Dictionary;

export default dashboardContent;
