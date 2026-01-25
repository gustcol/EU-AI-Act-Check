import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, HelpCircle, Check } from 'lucide-react';
import { systemsApi, assessmentsApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';
import { AISystem, RiskAssessment, AssessmentQuestion, RiskLevel } from '../types';

export default function AssessmentPage() {
  const { systemId, assessmentId } = useParams<{ systemId: string; assessmentId?: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [responses, setResponses] = useState<Record<string, boolean | string | string[]>>({});
  const [selectedClassification, setSelectedClassification] = useState<RiskLevel>(RiskLevel.MINIMAL);

  const { data: system } = useQuery({
    queryKey: ['system', systemId],
    queryFn: async () => {
      const response = await systemsApi.getById(systemId!);
      return response.data as AISystem;
    },
    enabled: !!systemId,
  });

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      const response = await assessmentsApi.getById(assessmentId!);
      const data = response.data as RiskAssessment;
      // Load existing responses
      const existingResponses: Record<string, boolean | string | string[]> = {};
      data.responses?.forEach(r => {
        existingResponses[r.question_id] = r.answer;
      });
      setResponses(existingResponses);
      setSelectedClassification(data.preliminary_classification);
      return data;
    },
    enabled: !!assessmentId,
  });

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ['assessmentQuestions'],
    queryFn: async () => {
      const response = await assessmentsApi.getQuestions();
      return response.data as AssessmentQuestion[];
    },
  });

  const createMutation = useMutation({
    mutationFn: () => assessmentsApi.create(systemId!, selectedClassification),
    onSuccess: (response) => {
      const newAssessment = response.data as RiskAssessment;
      navigate(`/systems/${systemId}/assessment/${newAssessment.id}`, { replace: true });
      toast.success('Assessment created');
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      const responseArray = Object.entries(responses).map(([question_id, answer]) => ({
        question_id,
        answer,
      }));
      return assessmentsApi.update(assessmentId!, { responses: responseArray });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
      toast.success('Progress saved');
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const completeMutation = useMutation({
    mutationFn: (data: { final_classification: RiskLevel; justification?: string }) =>
      assessmentsApi.complete(assessmentId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment', assessmentId] });
      queryClient.invalidateQueries({ queryKey: ['system', systemId] });
      toast.success(t('assessment.assessmentComplete'));
      navigate(`/systems/${systemId}`);
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const handleResponseChange = (questionId: string, value: boolean | string | string[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleComplete = () => {
    const justification = (document.getElementById('justification') as HTMLTextAreaElement)?.value;
    completeMutation.mutate({
      final_classification: selectedClassification,
      justification,
    });
  };

  if (isLoadingAssessment || isLoadingQuestions) {
    return <LoadingSpinner fullScreen />;
  }

  // If no assessmentId, show start assessment form
  if (!assessmentId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('assessment.startAssessment')}</h1>
        </div>

        <div className="card max-w-lg">
          <h2 className="text-lg font-semibold mb-4">{system?.name}</h2>
          <p className="text-sm text-gray-600 mb-6">
            Select a preliminary risk classification to begin the assessment.
          </p>

          <div className="space-y-3 mb-6">
            {Object.values(RiskLevel).map((level) => (
              <label
                key={level}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedClassification === level
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="classification"
                  value={level}
                  checked={selectedClassification === level}
                  onChange={() => setSelectedClassification(level)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <RiskBadge level={level} />
                  <p className="mt-1 text-sm text-gray-600">
                    {t(`riskLevels.${level}Desc`)}
                  </p>
                </div>
                {selectedClassification === level && (
                  <Check className="w-5 h-5 text-primary-600" />
                )}
              </label>
            ))}
          </div>

          <button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="btn-primary w-full"
          >
            {createMutation.isPending ? t('common.loading') : t('assessment.startAssessment')}
          </button>
        </div>
      </div>
    );
  }

  // Group questions by category
  const questionsByCategory = (questions || []).reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, AssessmentQuestion[]>);

  const isCompleted = assessment?.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('assessment.questionnaireTitle')}</h1>
            <p className="text-sm text-gray-500">{system?.name}</p>
          </div>
        </div>
        <RiskBadge level={assessment?.preliminary_classification} />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
          <div key={category} className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{category}</h2>
            <div className="space-y-6">
              {categoryQuestions.map((question) => (
                <div key={question.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-sm font-medium text-gray-900">{question.question}</p>
                    {question.help_text && (
                      <div className="relative group">
                        <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                        <div className="absolute right-0 z-10 w-64 p-2 text-xs bg-gray-900 text-white rounded shadow-lg hidden group-hover:block">
                          {question.help_text}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-2">
                    {question.type === 'boolean' && (
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            checked={responses[question.id] === true}
                            onChange={() => handleResponseChange(question.id, true)}
                            disabled={isCompleted}
                            className="mr-2"
                          />
                          {t('common.yes')}
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            checked={responses[question.id] === false}
                            onChange={() => handleResponseChange(question.id, false)}
                            disabled={isCompleted}
                            className="mr-2"
                          />
                          {t('common.no')}
                        </label>
                      </div>
                    )}

                    {question.type === 'select' && question.options && (
                      <select
                        value={(responses[question.id] as string) || ''}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        disabled={isCompleted}
                        className="input max-w-md"
                      >
                        <option value="">Select an option</option>
                        {question.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {question.type === 'multiselect' && question.options && (
                      <div className="space-y-2">
                        {question.options.map((opt) => (
                          <label key={opt} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={(responses[question.id] as string[] || []).includes(opt)}
                              onChange={(e) => {
                                const current = (responses[question.id] as string[]) || [];
                                if (e.target.checked) {
                                  handleResponseChange(question.id, [...current, opt]);
                                } else {
                                  handleResponseChange(question.id, current.filter(v => v !== opt));
                                }
                              }}
                              disabled={isCompleted}
                              className="mr-2"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === 'text' && (
                      <textarea
                        value={(responses[question.id] as string) || ''}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        disabled={isCompleted}
                        rows={2}
                        className="input"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Section */}
      {!isCompleted && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">{t('assessment.completeAssessment')}</h2>

          <div className="mb-4">
            <label className="label">{t('assessment.finalClassification')}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.values(RiskLevel).map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedClassification(level)}
                  className={`p-2 text-sm rounded border transition-colors ${
                    selectedClassification === level
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <RiskBadge level={level} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="label">{t('assessment.justification')}</label>
            <textarea
              id="justification"
              rows={3}
              className="input"
              placeholder="Explain the reasoning for the final classification..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending}
              className="btn-secondary"
            >
              {updateMutation.isPending ? t('common.loading') : t('common.save')}
            </button>
            <button
              onClick={handleComplete}
              disabled={completeMutation.isPending}
              className="btn-primary"
            >
              {completeMutation.isPending ? t('common.loading') : t('assessment.completeAssessment')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
