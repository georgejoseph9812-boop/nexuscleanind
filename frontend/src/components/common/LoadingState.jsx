import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingState = ({ message = 'Loading intelligence telemetry...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-eco-200 border-t-primary animate-spin" />
        <Sparkles className="w-5 h-5 text-secondary absolute animate-pulse" />
      </div>
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <span className="text-xs text-slate-400 mt-1">Connecting to simulated telemetry node</span>
    </div>
  );
};
