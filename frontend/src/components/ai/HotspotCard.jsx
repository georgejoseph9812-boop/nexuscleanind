import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Compass, 
  ArrowUpRight 
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

export const HotspotCard = ({ hotspot, onSelectOnMap, isSelected = false }) => {
  const [showDeepDive, setShowDeepDive] = useState(false);

  if (!hotspot) return null;

  const isHighRisk = hotspot.risk === 'HIGH';
  const isMediumRisk = hotspot.risk === 'MEDIUM';

  return (
    <div
      className={`rounded-3xl border transition-all duration-200 overflow-hidden bg-white ${
        isSelected
          ? 'border-primary ring-2 ring-primary/20 shadow-soft-md'
          : 'border-slate-200/90 shadow-soft hover:shadow-soft-md'
      }`}
    >
      {/* Top Header */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {hotspot.id}
              </span>
              <StatusBadge status={hotspot.risk} size="sm" />
              <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Prototype Intelligence
              </span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">{hotspot.name}</h4>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-slate-400" />
              <span>Ward: <strong>{hotspot.area}</strong></span>
              <span className="text-slate-300">•</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Peak: <strong>{hotspot.peakHours}</strong></span>
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 font-bold text-base text-slate-900">
              <span>{hotspot.complaints}</span>
              <span className="text-xs text-slate-500 font-normal">complaints</span>
            </div>
            <div className="flex items-center justify-end gap-1 text-xs font-semibold mt-0.5">
              {hotspot.trendDirection === 'up' ? (
                <span className="text-rose-600 flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  {hotspot.trend}
                </span>
              ) : (
                <span className="text-emerald-600 flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {hotspot.trend}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Primary Issue & AI Recommendation */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Primary Incident Type:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg">
              {hotspot.primaryIssue}
            </span>
          </div>

          {/* AI Recommendation Highlight Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-eco-50/80 via-white to-eco-50/60 border border-eco-200/80 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>AI Preventive Recommendation</span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              "{hotspot.aiRecommendation}"
            </p>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-between pt-2">
          {onSelectOnMap && (
            <Button
              variant="outline"
              size="sm"
              icon={ArrowUpRight}
              iconPosition="right"
              onClick={() => onSelectOnMap(hotspot)}
            >
              Pin on Map
            </Button>
          )}

          <button
            onClick={() => setShowDeepDive(!showDeepDive)}
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors ml-auto"
          >
            <span>{showDeepDive ? 'Hide Hotspot Diagnostics' : 'Why is this area becoming a hotspot?'}</span>
            {showDeepDive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Deep Analysis Drawer */}
      {showDeepDive && (
        <div className="bg-slate-50 border-t border-slate-200/80 p-5 space-y-3.5 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              Diagnostic Root Cause & Predictive Impact
            </h5>
            <span className="text-[10px] font-mono text-slate-500">
              Confidence: {hotspot.deepAnalysis?.confidence || '94%'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="font-semibold text-slate-700 block mb-0.5">
                Why is this hotspot high risk?
              </span>
              <p className="text-slate-600 leading-relaxed">
                {hotspot.deepAnalysis?.possibleCause || 
                 `Risk is ${hotspot.trendDirection === 'up' ? 'increasing' : 'stable'} because ${hotspot.complaints_count || hotspot.complaints} complaints involving ${hotspot.primary_issue || hotspot.primaryIssue} were reported in the ${hotspot.area} area. This cluster indicates a systemic infrastructure or collection failure.`}
              </p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/60">
              <span className="font-semibold text-primary block mb-0.5">
                Recommended Intervention:
              </span>
              <p className="text-slate-600 leading-relaxed">
                {hotspot.deepAnalysis?.recommendedIntervention || hotspot.ai_recommendation || hotspot.aiRecommendation || 'Deploy immediate collection crew and evaluate long-term infrastructure needs.'}
              </p>
            </div>

            {hotspot.deepAnalysis?.preventedCostSavings && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-900 font-medium text-[11px] flex items-center justify-between">
                <span>Preventive Cost Benefit:</span>
                <span className="font-semibold">{hotspot.deepAnalysis.preventedCostSavings}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
