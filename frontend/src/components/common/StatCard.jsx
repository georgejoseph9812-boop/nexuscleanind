import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  badgeText,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-eco-300' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {value}
            </h3>
            {change && (
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  changeType === 'positive'
                    ? 'text-emerald-700 bg-emerald-50'
                    : changeType === 'negative'
                    ? 'text-rose-700 bg-rose-50'
                    : 'text-slate-600 bg-slate-100'
                }`}
              >
                {change}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-eco-800 flex items-center justify-center">
            <Icon className="w-5 h-5 text-eco-700" />
          </div>
        )}
      </div>

      {(subtitle || badgeText) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {badgeText && (
            <span className="font-medium text-eco-700 bg-eco-50 px-2 py-0.5 rounded-full text-[11px]">
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
