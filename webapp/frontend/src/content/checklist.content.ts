import { t, type Dictionary } from 'intlayer';

/**
 * Compliance Checklist translations
 * Checklist items and progress tracking labels
 */
const checklistContent = {
  key: 'checklist',
  content: {
    title: t({
      en: 'Compliance Checklist',
      pt: 'Lista de Verificação de Conformidade',
      es: 'Lista de verificación de cumplimiento',
      de: 'Compliance-Checkliste',
      fr: 'Liste de contrôle de conformité',
      it: 'Checklist di conformità',
    }),
    phase: t({
      en: 'Phase',
      pt: 'Fase',
      es: 'Fase',
      de: 'Phase',
      fr: 'Phase',
      it: 'Fase',
    }),
    item: t({
      en: 'Item',
      pt: 'Item',
      es: 'Ítem',
      de: 'Punkt',
      fr: 'Élément',
      it: 'Elemento',
    }),
    required: t({
      en: 'Required',
      pt: 'Obrigatório',
      es: 'Obligatorio',
      de: 'Erforderlich',
      fr: 'Requis',
      it: 'Obbligatorio',
    }),
    completed: t({
      en: 'Completed',
      pt: 'Concluído',
      es: 'Completado',
      de: 'Abgeschlossen',
      fr: 'Terminé',
      it: 'Completato',
    }),
    notes: t({
      en: 'Notes',
      pt: 'Notas',
      es: 'Notas',
      de: 'Notizen',
      fr: 'Notes',
      it: 'Note',
    }),
    evidence: t({
      en: 'Evidence URL',
      pt: 'URL de Evidência',
      es: 'URL de evidencia',
      de: 'Nachweis-URL',
      fr: 'URL de preuve',
      it: 'URL di evidenza',
    }),
    markComplete: t({
      en: 'Mark as Complete',
      pt: 'Marcar como Concluído',
      es: 'Marcar como completado',
      de: 'Als abgeschlossen markieren',
      fr: 'Marquer comme terminé',
      it: 'Segna come completato',
    }),
    markIncomplete: t({
      en: 'Mark as Incomplete',
      pt: 'Marcar como Incompleto',
      es: 'Marcar como incompleto',
      de: 'Als unvollständig markieren',
      fr: 'Marquer comme incomplet',
      it: 'Segna come incompleto',
    }),
    progress: t({
      en: 'Progress',
      pt: 'Progresso',
      es: 'Progreso',
      de: 'Fortschritt',
      fr: 'Progrès',
      it: 'Progresso',
    }),
    allItems: t({
      en: 'All Items',
      pt: 'Todos os Itens',
      es: 'Todos los ítems',
      de: 'Alle Punkte',
      fr: 'Tous les éléments',
      it: 'Tutti gli elementi',
    }),
    pendingItems: t({
      en: 'Pending Items',
      pt: 'Itens Pendentes',
      es: 'Ítems pendientes',
      de: 'Ausstehende Punkte',
      fr: 'Éléments en attente',
      it: 'Elementi in sospeso',
    }),
    completedItems: t({
      en: 'Completed Items',
      pt: 'Itens Concluídos',
      es: 'Ítems completados',
      de: 'Abgeschlossene Punkte',
      fr: 'Éléments terminés',
      it: 'Elementi completati',
    }),
    updateSuccess: t({
      en: 'Checklist item updated',
      pt: 'Item da lista atualizado',
      es: 'Ítem de la lista actualizado',
      de: 'Checklistenpunkt aktualisiert',
      fr: 'Élément de la liste mis à jour',
      it: 'Elemento della lista aggiornato',
    }),
  },
} satisfies Dictionary;

export default checklistContent;
