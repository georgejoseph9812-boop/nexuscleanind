import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Maximize2, 
  Sparkles, 
  ShieldAlert, 
  Info, 
  Navigation,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, OverlayView } from '@react-google-maps/api';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '420px',
  borderRadius: '1.5rem',
};

const center = {
  lat: 26.47,
  lng: 80.33
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
  ],
};

export const MapPanel = ({
  hotspots = [],
  selectedHotspot,
  onSelectHotspot,
  className = ''
}) => {
  const [filterRisk, setFilterRisk] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [activeLayer, setActiveLayer] = useState('heat'); // 'heat' | 'pins'

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const filteredHotspots = hotspots.filter((h) => {
    if (filterRisk === 'ALL') return true;
    return h.risk === filterRisk;
  });

  return (
    <div className={`relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-soft-lg flex flex-col ${className}`}>
      
      {/* Top Map Controls Header */}
      <div className="relative z-20 p-4 sm:p-5 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-soft">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Geospatial Predictive GIS Grid
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Prototype Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Real-time pattern forecasting & micro-hotspot clustering
            </p>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterRisk === risk
                  ? risk === 'HIGH'
                    ? 'bg-rose-600 text-white font-bold'
                    : risk === 'MEDIUM'
                    ? 'bg-amber-600 text-white font-bold'
                    : risk === 'LOW'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white text-slate-900 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>

      </div>

      {/* Simulated Map Canvas */}
      <div className="relative flex-1 min-h-[420px] sm:min-h-[480px] bg-slate-950 overflow-hidden">
        
        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-slate-900">
            Error loading Google Maps
          </div>
        )}

        {!isLoaded && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center text-white bg-slate-900">
            Loading Map...
          </div>
        )}

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            options={mapOptions}
            onClick={() => onSelectHotspot && onSelectHotspot(null)}
          >


        {/* Hotspot Beacons & Markers */}
        {filteredHotspots.map((hotspot) => {
          const isSelected = selectedHotspot?.id === hotspot.id;
          const isHigh = hotspot.risk === 'HIGH' || hotspot.risk === 'CRITICAL';
          const isMedium = hotspot.risk === 'MEDIUM';
          const lat = hotspot.coord_x || hotspot.coordinates?.lat || center.lat;
          const lng = hotspot.coord_y || hotspot.coordinates?.lng || center.lng;

          return (
            <OverlayView
              key={hotspot.id}
              position={{ lat, lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <div
                onClick={() => onSelectHotspot && onSelectHotspot(hotspot)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                {/* Radar pulse for High and Medium risks */}
                {isHigh && (
                  <div className="absolute -inset-4 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                )}
                {isMedium && (
                  <div className="absolute -inset-3 rounded-full bg-amber-500/20 animate-pulse pointer-events-none" />
                )}

                {/* Pin Target */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-200 ${
                    isSelected ? 'scale-125 z-30' : 'group-hover:scale-110'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-2xl flex items-center justify-center text-white font-bold text-xs shadow-soft-lg ring-4 ${
                      isHigh
                        ? 'bg-rose-600 ring-rose-950 border border-rose-400'
                        : isMedium
                        ? 'bg-amber-600 ring-amber-950 border border-amber-400'
                        : 'bg-emerald-600 ring-emerald-950 border border-emerald-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-white" />
                  </div>

                  {/* Floating Tooltip Label */}
                  <div
                    className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1 rounded-xl bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-semibold border border-slate-700 shadow-soft-lg pointer-events-none transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isHigh ? 'bg-rose-400' : isMedium ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      {hotspot.name}
                    </span>
                  </div>
                </div>
              </div>
            </OverlayView>
          );
        })}


        {/* Selected Hotspot Float Info Box on Map */}
        {selectedHotspot && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 sm:p-5 rounded-2xl shadow-soft-lg text-white space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {selectedHotspot.id}
                  </span>
                  <StatusBadge status={selectedHotspot.risk} size="sm" />
                </div>
                <h5 className="text-sm font-bold text-white mt-1">
                  {selectedHotspot.name}
                </h5>
                <p className="text-xs text-slate-400">
                  {selectedHotspot.primary_issue || selectedHotspot.primaryIssue} • Peak {selectedHotspot.peak_hours || selectedHotspot.peakHours || 'Evening'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-lg font-bold text-white font-mono">
                  {selectedHotspot.complaints_count || selectedHotspot.complaints}
                </span>
                <span className="block text-[10px] text-slate-400">Reports logged</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
              <span className="text-[10px] uppercase font-bold text-secondary block mb-1">
                AI Recommendation:
              </span>
              <p className="text-slate-200 font-medium">
                "{selectedHotspot.ai_recommendation || selectedHotspot.aiRecommendation}"
              </p>
            </div>
          </div>
        )}

        {/* Legend on Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20 hidden sm:flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300">
          <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 mb-0.5">
            Risk Spectrum
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span>High Risk (Overflow imminent &lt;4h)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Medium Risk (Repeat accumulation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Low Risk (Controlled / Cleared)</span>
          </div>
        </div>

        </GoogleMap>
        )}

      </div>

    </div>
  );
};
