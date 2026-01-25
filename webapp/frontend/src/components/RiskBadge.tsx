import { useTranslation } from 'react-i18next';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel | undefined;
  showLabel?: boolean;
}

export default function RiskBadge({ level, showLabel = true }: RiskBadgeProps) {
  const { t } = useTranslation();

  if (!level) {
    return (
      <span className="risk-badge bg-gray-100 text-gray-800">
        {t('common.noData')}
      </span>
    );
  }

  const config: Record<RiskLevel, { class: string; key: string }> = {
    [RiskLevel.UNACCEPTABLE]: { class: 'risk-unacceptable', key: 'unacceptable' },
    [RiskLevel.HIGH]: { class: 'risk-high', key: 'high' },
    [RiskLevel.LIMITED]: { class: 'risk-limited', key: 'limited' },
    [RiskLevel.MINIMAL]: { class: 'risk-minimal', key: 'minimal' },
  };

  const { class: badgeClass, key } = config[level];

  return (
    <span className={badgeClass}>
      {showLabel ? t(`riskLevels.${key}`) : level.toUpperCase()}
    </span>
  );
}
