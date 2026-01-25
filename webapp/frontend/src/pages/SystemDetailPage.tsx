import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { ArrowLeft, ClipboardCheck, CheckSquare, FileText, Wand2 } from 'lucide-react';
import { systemsApi, assessmentsApi, checklistApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';
import { AISystem, RiskAssessment, RiskLevel } from '../types';

export default function SystemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: system, isLoading: isLoadingSystem } = useQuery({
    queryKey: ['system', id],
    queryFn: async () => {
      const response = await systemsApi.getById(id!);
      return response.data as AISystem;
    },
    enabled: !!id,
  });

  const { data: assessments } = useQuery({
    queryKey: ['assessments', id],
    queryFn: async () => {
      const response = await assessmentsApi.getBySystem(id!);
      return response.data as RiskAssessment[];
    },
    enabled: !!id,
  });

  const { data: checklistProgress } = useQuery({
    queryKey: ['checklistProgress', id],
    queryFn: async () => {
      const response = await checklistApi.getProgress(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const classifyMutation = useMutation({
    mutationFn: () => systemsApi.classify(id!),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['system', id] });
      const result = response.data;
      toast.success(`Classification: ${result.risk_level.toUpperCase()} (${Math.round(result.confidence * 100)}% confidence)`);
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const generateChecklistMutation = useMutation({
    mutationFn: () => checklistApi.generate(id!, system?.risk_level || RiskLevel.MINIMAL),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklistProgress', id] });
      toast.success('Checklist generated successfully');
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  if (isLoadingSystem) {
    return <LoadingSpinner fullScreen />;
  }

  if (!system) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{t('errors.notFound')}</p>
        <Link to="/systems" className="btn-primary mt-4">
          {t('common.back')}
        </Link>
      </div>
    );
  }

  const latestAssessment = assessments?.[0];
  const progress = checklistProgress || { total_items: 0, completed_items: 0 };
  const progressPercentage = progress.total_items > 0
    ? Math.round((progress.completed_items / progress.total_items) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-md">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{system.name}</h1>
          <p className="text-sm text-gray-500">v{system.version} | {system.status}</p>
        </div>
        <RiskBadge level={system.risk_level} />
      </div>

      {/* System Info Card */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">{t('systems.title')}</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">{t('systems.description')}</dt>
            <dd className="mt-1 text-sm text-gray-900">{system.description}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">{t('systems.intendedPurpose')}</dt>
            <dd className="mt-1 text-sm text-gray-900">{system.intended_purpose}</dd>
          </div>
          {system.deployment_context && (
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('systems.deploymentContext')}</dt>
              <dd className="mt-1 text-sm text-gray-900">{system.deployment_context}</dd>
            </div>
          )}
          {system.ai_techniques && system.ai_techniques.length > 0 && (
            <div>
              <dt className="text-sm font-medium text-gray-500">{t('systems.aiTechniques')}</dt>
              <dd className="mt-1 flex flex-wrap gap-1">
                {system.ai_techniques.map((tech, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {tech}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        {!system.risk_level && (
          <button
            onClick={() => classifyMutation.mutate()}
            disabled={classifyMutation.isPending}
            className="btn-primary mt-4"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {classifyMutation.isPending ? t('common.loading') : 'Auto-Classify Risk Level'}
          </button>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Assessment Card */}
        <div className="card">
          <div className="flex items-center mb-4">
            <ClipboardCheck className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">{t('assessment.title')}</h3>
          </div>
          {latestAssessment ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                {t('assessment.assessmentStatus')}: <span className="font-medium">{latestAssessment.status}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {t('assessment.preliminaryClassification')}: <RiskBadge level={latestAssessment.preliminary_classification} />
              </p>
              <Link
                to={`/systems/${id}/assessment/${latestAssessment.id}`}
                className="btn-secondary w-full"
              >
                {latestAssessment.status === 'completed'
                  ? t('assessment.viewAssessment')
                  : t('assessment.continueAssessment')}
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">{t('assessment.noAssessments')}</p>
              <Link to={`/systems/${id}/assessment`} className="btn-primary w-full">
                {t('assessment.startAssessment')}
              </Link>
            </div>
          )}
        </div>

        {/* Checklist Card */}
        <div className="card">
          <div className="flex items-center mb-4">
            <CheckSquare className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">{t('checklist.title')}</h3>
          </div>
          {progress.total_items > 0 ? (
            <div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('checklist.progress')}</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {progress.completed_items} / {progress.total_items} {t('checklist.completedItems').toLowerCase()}
              </p>
              <Link to={`/systems/${id}/checklist`} className="btn-secondary w-full">
                {t('common.view')} {t('checklist.title')}
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">No checklist generated yet</p>
              <button
                onClick={() => generateChecklistMutation.mutate()}
                disabled={generateChecklistMutation.isPending || !system.risk_level}
                className="btn-primary w-full"
              >
                {generateChecklistMutation.isPending ? t('common.loading') : 'Generate Checklist'}
              </button>
              {!system.risk_level && (
                <p className="text-xs text-gray-500 mt-2">Classify the system first to generate checklist</p>
              )}
            </div>
          )}
        </div>

        {/* Reports Card */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-primary-600" />
            <h3 className="ml-3 text-lg font-semibold">{t('reports.title')}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Generate compliance and risk assessment reports</p>
          <Link to={`/reports?system=${id}`} className="btn-secondary w-full">
            {t('reports.generateReport')}
          </Link>
        </div>
      </div>
    </div>
  );
}
