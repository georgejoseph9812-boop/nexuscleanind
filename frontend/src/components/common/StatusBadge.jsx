import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  FileCheck2, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';

export const StatusBadge = ({ status, priority, size = 'sm', className = '' }) => {
  // If rendering a Priority badge
  if (priority) {
    const priorityConfig = {
      High: {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        label: 'High Priority'
      },
      Medium: {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        label: 'Medium Priority'
      },
      Low: {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Low Priority'
      }
    };

    const config = priorityConfig[priority] || priorityConfig.Medium;

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.bg} ${
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
        } ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    );
  }

  // If rendering a Status badge
  const statusConfig = {
    'Pending': {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
      label: 'Pending Review'
    },
    'Assigned': {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Truck,
      label: 'Team Assigned'
    },
    'In Progress': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Activity,
      label: 'In Progress'
    },
    'Resolution Submitted': {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: FileCheck2,
      label: 'Verification Pending'
    },
    'Resolved': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'Resolved'
    },
    'Pickup Requested': {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Clock,
      label: 'Pickup Requested'
    },
    'Collected': {
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: CheckCircle2,
      label: 'Collected'
    },
    'HIGH': {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ShieldAlert,
      label: 'High Risk'
    },
    'MEDIUM': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      label: 'Medium Risk'
    },
    'LOW': {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'Low Risk'
    }
  };

  const config = statusConfig[status] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
    label: status
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${config.bg} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      } ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {config.label}
    </span>
  );
};
