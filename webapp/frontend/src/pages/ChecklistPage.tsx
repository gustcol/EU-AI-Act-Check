import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, Circle, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { systemsApi, checklistApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { AISystem, ChecklistItem } from '../types';

export default function ChecklistPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const { data: system } = useQuery({
    queryKey: ['system', systemId],
    queryFn: async () => {
      const response = await systemsApi.getById(systemId!);
      return response.data as AISystem;
    },
    enabled: !!systemId,
  });

  const { data: checklist, isLoading } = useQuery({
    queryKey: ['checklist', systemId],
    queryFn: async () => {
      const response = await checklistApi.getBySystem(systemId!);
      return response.data as ChecklistItem[];
    },
    enabled: !!systemId,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { is_completed?: boolean; notes?: string; evidence_url?: string } }) =>
      checklistApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist', systemId] });
      queryClient.invalidateQueries({ queryKey: ['checklistProgress', systemId] });
      toast.success(t('checklist.updateSuccess'));
      setEditingItem(null);
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const togglePhase = (phase: string) => {
    setExpandedPhases(prev => {
      const next = new Set(prev);
      if (next.has(phase)) {
        next.delete(phase);
      } else {
        next.add(phase);
      }
      return next;
    });
  };

  const handleToggleComplete = (item: ChecklistItem) => {
    updateMutation.mutate({
      id: item.id,
      data: { is_completed: !item.is_completed },
    });
  };

  const handleSaveDetails = (itemId: string) => {
    updateMutation.mutate({
      id: itemId,
      data: { notes, evidence_url: evidenceUrl },
    });
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Group by phase
  const itemsByPhase = (checklist || []).reduce((acc, item) => {
    if (!acc[item.phase]) acc[item.phase] = [];
    acc[item.phase].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const phases = Object.keys(itemsByPhase).sort();

  // Calculate progress
  const totalItems = checklist?.length || 0;
  const completedItems = checklist?.filter(i => i.is_completed).length || 0;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('checklist.title')}</h1>
            <p className="text-sm text-gray-500">{system?.name}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{t('checklist.progress')}</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {completedItems} / {totalItems} {t('checklist.completedItems').toLowerCase()}
        </p>
      </div>

      {/* Checklist by Phase */}
      {phases.length > 0 ? (
        <div className="space-y-4">
          {phases.map((phase) => {
            const phaseItems = itemsByPhase[phase];
            const phaseCompleted = phaseItems.filter(i => i.is_completed).length;
            const isExpanded = expandedPhases.has(phase);

            return (
              <div key={phase} className="card">
                <button
                  onClick={() => togglePhase(phase)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 mr-2" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 mr-2" />
                    )}
                    <h2 className="text-lg font-semibold text-gray-900">{phase}</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {phaseCompleted} / {phaseItems.length}
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-4 space-y-3">
                    {phaseItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border ${
                          item.is_completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleToggleComplete(item)}
                            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border ${
                              item.is_completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-primary-500'
                            }`}
                          >
                            {item.is_completed && <Check className="w-4 h-4" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${item.is_completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                              {item.item_text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                item.is_required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {item.is_required ? t('checklist.required') : t('common.optional')}
                              </span>
                              <span className="text-xs text-gray-500">{item.category}</span>
                            </div>

                            {/* Notes and Evidence */}
                            {editingItem === item.id ? (
                              <div className="mt-3 space-y-2">
                                <div>
                                  <label className="text-xs text-gray-500">{t('checklist.notes')}</label>
                                  <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    className="input text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">{t('checklist.evidence')}</label>
                                  <input
                                    type="url"
                                    value={evidenceUrl}
                                    onChange={(e) => setEvidenceUrl(e.target.value)}
                                    className="input text-sm"
                                    placeholder="https://..."
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSaveDetails(item.id)}
                                    className="btn-primary text-xs py-1"
                                  >
                                    {t('common.save')}
                                  </button>
                                  <button
                                    onClick={() => setEditingItem(null)}
                                    className="btn-secondary text-xs py-1"
                                  >
                                    {t('common.cancel')}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-2">
                                {item.notes && (
                                  <p className="text-xs text-gray-500 mb-1">
                                    <strong>{t('checklist.notes')}:</strong> {item.notes}
                                  </p>
                                )}
                                {item.evidence_url && (
                                  <a
                                    href={item.evidence_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {t('checklist.evidence')}
                                  </a>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingItem(item.id);
                                    setNotes(item.notes || '');
                                    setEvidenceUrl(item.evidence_url || '');
                                  }}
                                  className="text-xs text-gray-400 hover:text-gray-600 mt-1"
                                >
                                  Add notes/evidence
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Circle className="w-16 h-16 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No checklist items</h3>
          <p className="mt-2 text-sm text-gray-500">
            Generate a checklist from the system detail page
          </p>
        </div>
      )}
    </div>
  );
}
