import { t, type Dictionary } from 'intlayer';

/**
 * Risk Levels translations
 * EU AI Act risk classification labels and descriptions
 */
const riskLevelsContent = {
  key: 'riskLevels',
  content: {
    unacceptable: t({
      en: 'Unacceptable Risk',
      pt: 'Risco Inaceitável',
      es: 'Riesgo Inaceptable',
      de: 'Unannehmbares Risiko',
      fr: 'Risque inacceptable',
      it: 'Rischio inaccettabile',
    }),
    high: t({
      en: 'High Risk',
      pt: 'Alto Risco',
      es: 'Alto Riesgo',
      de: 'Hohes Risiko',
      fr: 'Risque élevé',
      it: 'Alto rischio',
    }),
    limited: t({
      en: 'Limited Risk',
      pt: 'Risco Limitado',
      es: 'Riesgo Limitado',
      de: 'Begrenztes Risiko',
      fr: 'Risque limité',
      it: 'Rischio limitato',
    }),
    minimal: t({
      en: 'Minimal Risk',
      pt: 'Risco Mínimo',
      es: 'Riesgo Mínimo',
      de: 'Minimales Risiko',
      fr: 'Risque minimal',
      it: 'Rischio minimo',
    }),
    unacceptableDesc: t({
      en: 'Prohibited under the EU AI Act',
      pt: 'Proibido pelo EU AI Act',
      es: 'Prohibido por el EU AI Act',
      de: 'Nach dem EU-KI-Gesetz verboten',
      fr: "Interdit par l'EU AI Act",
      it: "Proibito dall'EU AI Act",
    }),
    highDesc: t({
      en: 'Subject to strict compliance requirements',
      pt: 'Sujeito a requisitos rigorosos de conformidade',
      es: 'Sujeto a estrictos requisitos de cumplimiento',
      de: 'Unterliegt strengen Compliance-Anforderungen',
      fr: 'Soumis à des exigences de conformité strictes',
      it: 'Soggetto a rigorosi requisiti di conformità',
    }),
    limitedDesc: t({
      en: 'Subject to transparency obligations',
      pt: 'Sujeito a obrigações de transparência',
      es: 'Sujeto a obligaciones de transparencia',
      de: 'Unterliegt Transparenzpflichten',
      fr: 'Soumis à des obligations de transparence',
      it: 'Soggetto a obblighi di trasparenza',
    }),
    minimalDesc: t({
      en: 'No specific obligations, voluntary best practices',
      pt: 'Sem obrigações específicas, melhores práticas voluntárias',
      es: 'Sin obligaciones específicas, mejores prácticas voluntarias',
      de: 'Keine spezifischen Pflichten, freiwillige Best Practices',
      fr: "Pas d'obligations spécifiques, meilleures pratiques volontaires",
      it: 'Nessun obbligo specifico, migliori pratiche volontarie',
    }),
  },
} satisfies Dictionary;

export default riskLevelsContent;
