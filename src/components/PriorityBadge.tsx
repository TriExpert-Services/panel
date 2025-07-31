import React from 'react';
import { Clock } from 'lucide-react';

interface PriorityBadgeProps {
  processingTime: number;
}

export function PriorityBadge({ processingTime }: PriorityBadgeProps) {
  const getProcessingTimeConfig = (days: number) => {
    if (days <= 1) {
      return {
        label: `${days} día${days !== 1 ? 's' : ''} (Urgente)`,
        className: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (days <= 3) {
      return {
        label: `${days} días (Alta)`,
        className: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else if (days <= 7) {
      return {
        label: `${days} días (Media)`,
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    } else {
      return {
        label: `${days} días (Baja)`,
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    }
  };

  const config = getProcessingTimeConfig(processingTime);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      <Clock className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}