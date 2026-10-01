import React from 'react';
import { Sparkles, AlertCircle, CheckCircle, Clock, Cpu } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const AIAnalysisCard = ({ analysis, className = '' }) => {
  if (!analysis) return null;

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-7 shadow-soft-lg border border-emerald-800/40 ${className}`}>
      
      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-secondary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-emerald-800/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary/20 border border-secondary/40 flex items-center justify-center text-secondary shadow-soft">
            <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white tracking-tight">
                AI Waste Analysis
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-900/80 text-emerald-300 rounded-md border border-emerald-700/60 uppercase tracking-wide">
                Vision Model
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Autonomous Multimodal Image Feature Extraction
            </p>
          </div>
        </div>

        {/* Confidence Pill */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
          <span className="text-xs text-slate-300 font-medium">Confidence:</span>
          <span className="text-sm font-extrabold text-secondary font-mono">
            {analysis.confidence || 94}%
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 py-5">
        
        {/* Detected Classification */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Detected Issue
          </span>
          <p className="text-base font-bold text-white">
            {analysis.detectedIssue || 'Overflowing Bin'}
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="text-xs text-slate-300">Classified Priority:</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {analysis.priority || 'HIGH'}
            </span>
          </div>
        </div>

        {/* Suggested Preventive Action */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Suggested Action
          </span>
          <p className="text-sm font-semibold text-emerald-300 leading-snug">
            "{analysis.suggestedAction || 'Schedule collection within 4 hours.'}"
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-secondary" />
            <span>Target response window: Under 4 hrs</span>
          </div>
        </div>

      </div>

      {/* Material Breakdown if present */}
      {analysis.materialBreakdown && (
        <div className="relative z-10 pb-4 space-y-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Estimated Material Composition
          </span>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(analysis.materialBreakdown).map(([material, pct]) => (
              <div key={material} className="p-2 rounded-xl bg-white/5 border border-white/5 text-center">
                <span className="text-xs font-mono font-bold text-white block">{pct}</span>
                <span className="text-[10px] text-slate-400 capitalize truncate block">
                  {material.replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Prototype Label */}
      <div className="relative z-10 pt-4 border-t border-emerald-800/40 flex items-center justify-between text-xs text-emerald-400/80">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-secondary shrink-0" />
          <span className="font-medium text-[11px]">
            Prototype Intelligence — Gemini multimodal integration will be connected via <code className="font-mono text-white/80">/api/ai/analyze-waste</code>.
          </span>
        </div>
      </div>

    </div>
  );
};
