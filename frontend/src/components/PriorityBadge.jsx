import React from 'react';
import { AlertTriangle, AlertOctagon, Info, ShieldAlert } from 'lucide-react';

export const PriorityBadge = ({ priority }) => {
  const configs = {
    'Critical': {
      bg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: AlertOctagon,
      label: 'Critical'
    },
    'High': {
      bg: 'bg-orange-100 text-orange-800 border-orange-300',
      icon: ShieldAlert,
      label: 'High'
    },
    'Medium': {
      bg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      label: 'Medium'
    },
    'Low': {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: Info,
      label: 'Low'
    }
  };

  const config = configs[priority] || configs['Medium'];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${config.bg}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label} Priority</span>
    </span>
  );
};

export default PriorityBadge;
