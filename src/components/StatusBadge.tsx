import React from 'react';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: 'nuevo' | 'en_proceso' | 'completado' | 'entregado';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'nuevo':
        return {
          label: t('orders.statuses.nuevo'),
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'en_proceso':
        return {
          label: t('orders.statuses.en_proceso'),
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'completado':
        return {
          label: t('orders.statuses.completado'),
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'entregado':
        return {
          label: t('orders.statuses.entregado'),
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
}