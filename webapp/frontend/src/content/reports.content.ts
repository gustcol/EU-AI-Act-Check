import { t, type Dictionary } from 'intlayer';

/**
 * Reports translations
 * Report generation and documentation labels
 */
const reportsContent = {
  key: 'reports',
  content: {
    title: t({
      en: 'Reports',
      pt: 'Relatórios',
      es: 'Informes',
      de: 'Berichte',
      fr: 'Rapports',
      it: 'Rapporti',
    }),
    generateReport: t({
      en: 'Generate Report',
      pt: 'Gerar Relatório',
      es: 'Generar Informe',
      de: 'Bericht erstellen',
      fr: 'Générer un rapport',
      it: 'Genera rapporto',
    }),
    complianceReport: t({
      en: 'Compliance Report',
      pt: 'Relatório de Conformidade',
      es: 'Informe de Cumplimiento',
      de: 'Compliance-Bericht',
      fr: 'Rapport de conformité',
      it: 'Rapporto di conformità',
    }),
    riskReport: t({
      en: 'Risk Assessment Report',
      pt: 'Relatório de Avaliação de Risco',
      es: 'Informe de Evaluación de Riesgo',
      de: 'Risikobewertungsbericht',
      fr: "Rapport d'évaluation des risques",
      it: 'Rapporto di valutazione del rischio',
    }),
    technicalDocumentation: t({
      en: 'Technical Documentation',
      pt: 'Documentação Técnica',
      es: 'Documentación Técnica',
      de: 'Technische Dokumentation',
      fr: 'Documentation technique',
      it: 'Documentazione tecnica',
    }),
    downloadPDF: t({
      en: 'Download PDF',
      pt: 'Baixar PDF',
      es: 'Descargar PDF',
      de: 'PDF herunterladen',
      fr: 'Télécharger PDF',
      it: 'Scarica PDF',
    }),
    generatedAt: t({
      en: 'Generated At',
      pt: 'Gerado em',
      es: 'Generado el',
      de: 'Erstellt am',
      fr: 'Généré le',
      it: 'Generato il',
    }),
    selectSystem: t({
      en: 'Select AI System',
      pt: 'Selecionar Sistema de IA',
      es: 'Seleccionar Sistema de IA',
      de: 'KI-System auswählen',
      fr: 'Sélectionner un Système IA',
      it: 'Seleziona Sistema IA',
    }),
    reportType: t({
      en: 'Report Type',
      pt: 'Tipo de Relatório',
      es: 'Tipo de Informe',
      de: 'Berichtstyp',
      fr: 'Type de rapport',
      it: 'Tipo di rapporto',
    }),
  },
} satisfies Dictionary;

export default reportsContent;
