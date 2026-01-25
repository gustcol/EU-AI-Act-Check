import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Cpu, ClipboardCheck, FileText, Plus, ArrowRight } from 'lucide-react';
import { reportsApi, systemsApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';
import { RiskLevel, AISystem } from '../types';

const RISK_COLORS = {
  [RiskLevel.UNACCEPTABLE]: '#dc2626',
  [RiskLevel.HIGH]: '#f97316',
  [RiskLevel.LIMITED]: '#eab308',
  [RiskLevel.MINIMAL]: '#22c55e',
};

export default function DashboardPage() {
  const { t } = useTranslation();

  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await reportsApi.getDashboard();
      return response.data;
    },
  });

  const { data: systemsData, isLoading: isLoadingSystems } = useQuery({
    queryKey: ['systems'],
    queryFn: async () => {
      const response = await systemsApi.getAll();
      return (response.data.data || response.data) as AISystem[];
    },
  });

  if (isLoadingDashboard || isLoadingSystems) {
    return <LoadingSpinner fullScreen />;
  }

  const stats = dashboardData || {
    total_systems: systemsData?.length || 0,
    systems_by_risk: {},
    pending_assessments: 0,
    completed_assessments: 0,
    compliance_progress: 0,
  };

  const riskDistribution = Object.entries(stats.systems_by_risk || {}).map(([level, count]) => ({
    name: t(`riskLevels.${level}`),
    value: count as number,
    level: level as RiskLevel,
  })).filter(item => item.value > 0);

  const recentSystems = (systemsData || []).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <Link to="/systems" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('dashboard.registerSystem')}
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100">
              <Cpu className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.totalSystems')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_systems}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ClipboardCheck className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.pendingAssessments')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending_assessments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <ClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.completedAssessments')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed_assessments}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.complianceProgress')}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.compliance_progress}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.riskDistribution')}</h2>
          {riskDistribution.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[entry.level]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              {t('common.noData')}
            </div>
          )}
        </div>

        {/* Recent Systems */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
            <Link to="/systems" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              {t('common.view')} <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          {recentSystems.length > 0 ? (
            <div className="space-y-3">
              {recentSystems.map((system) => (
                <Link
                  key={system.id}
                  to={`/systems/${system.id}`}
                  className="block p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{system.name}</p>
                      <p className="text-sm text-gray-500">v{system.version}</p>
                    </div>
                    <RiskBadge level={system.risk_level} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-500">
              <Cpu className="w-12 h-12 mb-2 text-gray-300" />
              <p>{t('systems.noSystems')}</p>
              <Link to="/systems" className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                {t('dashboard.registerSystem')}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/systems"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Cpu className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="font-medium text-gray-900">{t('dashboard.registerSystem')}</p>
              <p className="text-sm text-gray-500">{t('systems.createSystem')}</p>
            </div>
          </Link>

          <Link
            to="/systems"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <ClipboardCheck className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="font-medium text-gray-900">{t('dashboard.startAssessment')}</p>
              <p className="text-sm text-gray-500">{t('assessment.title')}</p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <FileText className="w-8 h-8 text-primary-600" />
            <div className="ml-4">
              <p className="font-medium text-gray-900">{t('reports.generateReport')}</p>
              <p className="text-sm text-gray-500">{t('reports.title')}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
