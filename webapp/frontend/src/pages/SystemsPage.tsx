import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Plus, Search, Cpu, Eye, Trash2, X } from 'lucide-react';
import { systemsApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import RiskBadge from '../components/RiskBadge';
import { AISystem } from '../types';

interface SystemForm {
  name: string;
  description: string;
  version: string;
  intended_purpose: string;
  deployment_context?: string;
  ai_techniques?: string;
}

export default function SystemsPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SystemForm>();

  const { data: systems, isLoading } = useQuery({
    queryKey: ['systems'],
    queryFn: async () => {
      const response = await systemsApi.getAll();
      return (response.data.data || response.data) as AISystem[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: SystemForm) => systemsApi.create({
      ...data,
      ai_techniques: data.ai_techniques?.split(',').map(s => s.trim()).filter(Boolean),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
      toast.success(t('systems.createSuccess'));
      setShowModal(false);
      reset();
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => systemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systems'] });
      toast.success(t('systems.deleteSuccess'));
    },
    onError: () => {
      toast.error(t('errors.serverError'));
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm(t('systems.deleteConfirm'))) {
      deleteMutation.mutate(id);
    }
  };

  const filteredSystems = (systems || []).filter(system =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    system.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('systems.title')}</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('systems.createSystem')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Systems Grid */}
      {filteredSystems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSystems.map((system) => (
            <div key={system.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-primary-100">
                    <Cpu className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-500">v{system.version}</p>
                  </div>
                </div>
                <RiskBadge level={system.risk_level} />
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{system.description}</p>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(system.created_at).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/systems/${system.id}`}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-md"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(system.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Cpu className="w-16 h-16 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t('systems.noSystems')}</h3>
          <p className="mt-2 text-sm text-gray-500">{t('systems.createSystem')}</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
            <Plus className="w-4 h-4 mr-2" />
            {t('systems.createSystem')}
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{t('systems.createSystem')}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-md">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="p-4 space-y-4">
              <div>
                <label className="label">{t('systems.systemName')} *</label>
                <input
                  {...register('name', { required: t('common.required') })}
                  className="input"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>

              <div>
                <label className="label">{t('systems.description')} *</label>
                <textarea
                  {...register('description', { required: t('common.required') })}
                  rows={3}
                  className="input"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <label className="label">{t('systems.version')} *</label>
                <input
                  {...register('version', { required: t('common.required') })}
                  placeholder="1.0.0"
                  className="input"
                />
                {errors.version && <p className="mt-1 text-sm text-red-600">{errors.version.message}</p>}
              </div>

              <div>
                <label className="label">{t('systems.intendedPurpose')} *</label>
                <textarea
                  {...register('intended_purpose', { required: t('common.required') })}
                  rows={2}
                  className="input"
                />
                {errors.intended_purpose && <p className="mt-1 text-sm text-red-600">{errors.intended_purpose.message}</p>}
              </div>

              <div>
                <label className="label">{t('systems.deploymentContext')}</label>
                <textarea
                  {...register('deployment_context')}
                  rows={2}
                  className="input"
                />
              </div>

              <div>
                <label className="label">{t('systems.aiTechniques')}</label>
                <input
                  {...register('ai_techniques')}
                  placeholder="Machine Learning, NLP, Computer Vision"
                  className="input"
                />
                <p className="mt-1 text-xs text-gray-500">Comma-separated list</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary">
                  {createMutation.isPending ? t('common.loading') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
