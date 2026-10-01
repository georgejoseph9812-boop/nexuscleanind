import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  RotateCcw, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Compass, 
  Clock, 
  Filter, 
  AlertTriangle,
  Cpu,
  Layers
} from 'lucide-react';
import { MapPanel } from '../../components/ai/MapPanel';
import { HotspotCard } from '../../components/ai/HotspotCard';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';

export const PredictiveIntelligencePage = () => {
  const { hotspots, addToast } = useApp();
  const [selectedHotspot, setSelectedHotspot] = useState(hotspots[0] || null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'

  const handleRegenerateForecast = async () => {
    setIsRefreshing(true);
    try {
      await apiService.regenerateForecast();
      addToast('Predictive GIS Hotspot Model Updated (Telemetry Re-indexed)', 'success');
    } catch (e) {
      addToast('Error refreshing forecasts', 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredHotspots = hotspots.filter((h) => {
    if (filter === 'ALL') return true;
    return h.risk === filter;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Signature AI Innovation
            </span>
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Prototype Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Predictive Waste Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Geospatial pattern clustering, recurrence risk forecasting, and automated preventive interventions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={RotateCcw}
            loading={isRefreshing}
            onClick={handleRegenerateForecast}
          >
            Re-run Forecast Model
          </Button>
        </div>
      </div>

      {/* PROTOTYPE INTELLIGENCE BANNER */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-amber-700 shrink-0" />
          <p>
            <strong>Prototype Intelligence Notice:</strong> The simulated predictive engine analyzes historical complaint clusters, peak market hours, and municipal frequency to forecast overflows before they happen. Gemini API multimodal integration will be connected later.
          </p>
        </div>
        <span className="font-mono text-[10px] text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded shrink-0">
          Model v0.9-Demo
        </span>
      </div>

      {/* MAP VISUALIZATION PANEL */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <span>Interactive Municipal Risk Heatmap</span>
          </h2>
          <span className="text-xs text-slate-500">
            Click any beacon to inspect hot-zone diagnostics
          </span>
        </div>

        <MapPanel
          hotspots={hotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(h) => setSelectedHotspot(h)}
        />
      </div>

      {/* HOTSPOTS DETAIL LIST & FILTER */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Municipal Waste Hotspots ({filteredHotspots.length})
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by overflow risk index and recommended dispatch urgency
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs self-start sm:self-center">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  filter === lvl
                    ? 'bg-white text-slate-900 shadow-soft'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'ALL' ? 'All Risks' : `${lvl} Risk`}
              </button>
            ))}
          </div>
        </div>

        {/* Hotspot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredHotspots.map((hotspot) => (
            <HotspotCard
              key={hotspot.id}
              hotspot={hotspot}
              isSelected={selectedHotspot?.id === hotspot.id}
              onSelectOnMap={(h) => {
                setSelectedHotspot(h);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
