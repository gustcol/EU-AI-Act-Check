import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { systemsApi, reportsApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';
import { AISystem } from '../types';

type ReportType = 'compliance' | 'risk-assessment' | 'documentation';

export default function ReportsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const preselectedSystem = searchParams.get('system');

  const [selectedSystem, setSelectedSystem] = useState<string>(preselectedSystem || '');
  const [selectedReport, setSelectedReport] = useState<ReportType>('compliance');
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: systems, isLoading } = useQuery({
    queryKey: ['systems'],
    queryFn: async () => {
      const response = await systemsApi.getAll();
      return (response.data.data || response.data) as AISystem[];
    },
  });

  const { data: complianceReport, isLoading: isLoadingReport } = useQuery({
    queryKey: ['complianceReport', selectedSystem],
    queryFn: async () => {
      const response = await reportsApi.getCompliance(selectedSystem);
      return response.data;
    },
    enabled: !!selectedSystem && selectedReport === 'compliance',
  });

  const { data: riskReport, isLoading: isLoadingRiskReport } = useQuery({
    queryKey: ['riskReport', selectedSystem],
    queryFn: async () => {
      const response = await reportsApi.getRisk(selectedSystem);
      return response.data;
    },
    enabled: !!selectedSystem && selectedReport === 'risk-assessment',
  });

  const handleDownloadPdf = async () => {
    if (!selectedSystem) return;

    setIsDownloading(true);
    try {
      const response = await reportsApi.downloadPdf(selectedSystem, selectedReport);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedReport}-report-${selectedSystem}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch {
      toast.error(t('errors.serverError'));
    } finally {
      setIsDownloading(false);
    }
  };

  const selectedSystemData = systems?.find(s => s.id === selectedSystem);
  const report = selectedReport === 'compliance' ? complianceReport : selectedReport === 'risk-assessment' ? riskReport : null;
  const isLoadingCurrentReport = selectedReport === 'compliance' ? isLoadingReport : selectedReport === 'risk-assessment' ? isLoadingRiskReport : false;

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  const reportTypes: { value: ReportType; label: string; description: string }[] = [
    {
      value: 'compliance',
      label: t('reports.complianceReport'),
      description: 'Overview of compliance progress and checklist completion',
    },
    {
      value: 'risk-assessment',
      label: t('reports.riskReport'),
      description: 'Risk assessment history and classification details',
    },
    {
      value: 'documentation',
      label: t('reports.technicalDocumentation'),
      description: 'Complete technical documentation for conformity assessment',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h1>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">{t('reports.selectSystem')}</h2>
          {systems && systems.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {systems.map((system) => (
                <label
                  key={system.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSystem === system.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="system"
                      value={system.id}
                      checked={selectedSystem === system.id}
                      onChange={() => setSelectedSystem(system.id)}
                      className="sr-only"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{system.name}</p>
                      <p className="text-sm text-gray-500">v{system.version}</p>
                    </div>
                  </div>
                  <RiskBadge level={system.risk_level} />
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p>{t('systems.noSystems')}</p>
            </div>
          )}
        </div>

        {/* Report Type Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">{t('reports.reportType')}</h2>
          <div className="space-y-2">
            {reportTypes.map((type) => (
              <label
                key={type.value}
                className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedReport === type.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={selectedReport === type.value}
                    onChange={() => setSelectedReport(type.value)}
                    className="sr-only"
                  />
                  <FileText className="w-5 h-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Report Preview */}
      {selectedSystem && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {reportTypes.find(r => r.value === selectedReport)?.label}
            </h2>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? t('common.loading') : t('reports.downloadPDF')}
            </button>
          </div>

          {isLoadingCurrentReport ? (
            <LoadingSpinner />
          ) : report ? (
            <div className="space-y-4">
              {/* System Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{t('systems.title')}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">{t('systems.systemName')}:</span>{' '}
                    <span className="font-medium">{selectedSystemData?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('systems.version')}:</span>{' '}
                    <span className="font-medium">{selectedSystemData?.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('systems.riskLevel')}:</span>{' '}
                    <RiskBadge level={selectedSystemData?.risk_level} />
                  </div>
                  <div>
                    <span className="text-gray-500">{t('systems.status')}:</span>{' '}
                    <span className="font-medium">{selectedSystemData?.status}</span>
                  </div>
                </div>
              </div>

              {/* Compliance-specific content */}
              {selectedReport === 'compliance' && report.compliance && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{t('dashboard.complianceProgress')}</h3>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{t('checklist.progress')}</span>
                      <span>
                        {Math.round((report.compliance.completed_items / report.compliance.total_items) * 100) || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(report.compliance.completed_items / report.compliance.total_items) * 100 || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Total Items:</span>{' '}
                      <span className="font-medium">{report.compliance.total_items}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Completed:</span>{' '}
                      <span className="font-medium">{report.compliance.completed_items}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Required Items:</span>{' '}
                      <span className="font-medium">{report.compliance.required_items}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Required Completed:</span>{' '}
                      <span className="font-medium">{report.compliance.required_completed}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Risk-specific content */}
              {selectedReport === 'risk-assessment' && report.risk_summary && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Compliance Obligations</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Timeline:</strong> {report.risk_summary.timeline}
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {report.risk_summary.obligations.map((obligation: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        {obligation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-sm text-gray-500">
                {t('reports.generatedAt')}: {new Date().toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No report data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
