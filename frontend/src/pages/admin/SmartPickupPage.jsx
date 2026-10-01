import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Navigation, 
  MapPin, 
  Clock, 
  Fuel, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { SMART_ROUTE_PREVIEW } from '../../data/mockPickups';

export const SmartPickupPage = () => {
  const { pickups, updatePickupStatus, smartRoute } = useApp();
  const [selectedRoute, setSelectedRoute] = useState(smartRoute || SMART_ROUTE_PREVIEW);
  const [filterType, setFilterType] = useState('All');
  const [assigningPickup, setAssigningPickup] = useState(null);

  useEffect(() => {
    if (smartRoute) setSelectedRoute(smartRoute);
  }, [smartRoute]);

  const filteredPickups = pickups.filter((p) => {
    if (filterType === 'All') return true;
    return p.wasteType === filterType;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-sky-600" />
              Dynamic Fleet Telemetry
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Prototype Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Smart Pickup Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            On-demand collection dispatch, multi-stop TSP route clustering, and load balancing
          </p>
        </div>
      </div>

      {/* SMART ROUTE PREVIEW (Required Signature Feature) */}
      <div className="rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-soft-lg p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800">
                {selectedRoute.zone}
              </span>
              <h2 className="text-lg font-bold text-white">
                {selectedRoute.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {selectedRoute.aiNotes}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>Distance: <strong className="text-white">{selectedRoute.estimatedDistance}</strong></span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duration: <strong className="text-white">{selectedRoute.estimatedDuration}</strong></span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Fuel className="w-3.5 h-3.5" />
              <span>{selectedRoute.fuelSaved}</span>
            </div>
          </div>
        </div>

        {/* Visual Route Sequence Ribbon */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Recommended TSP Vehicle Dispatch Sequence
            </span>
            <span className="font-mono text-secondary font-bold">
              Stop A → Stop B → Stop C → Stop D
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {selectedRoute.sequence.map((stop, idx) => (
              <div
                key={stop.stopId}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:bg-white/10 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">
                      {stop.pickupId}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {stop.area}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-1">
                      {stop.location}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-sky-300 font-medium">
                    <span>{stop.type}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{stop.timeWindow}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PICKUP REQUESTS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Municipal Pickup Requests ({filteredPickups.length})
            </h3>
            <p className="text-xs text-slate-500">
              Citizen requests scheduled for dedicated logistics handling
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Stream Filter:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Streams</option>
              <option value="E-Waste">E-Waste</option>
              <option value="Bulk Waste">Bulk Waste</option>
              <option value="Recyclable">Recyclable</option>
              <option value="Dry">Dry Waste</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Pickup ID</th>
                <th className="py-3.5 px-4">Requester / Location</th>
                <th className="py-3.5 px-4">Waste Stream & Volume</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Requested Time Window</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPickups.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{item.requesterName}</div>
                    <div className="text-[11px] font-medium text-slate-600 my-0.5">
                      <a href={`tel:${item.requesterPhone}`} className="hover:text-primary hover:underline flex items-center gap-1">
                        {item.requesterPhone}
                      </a>
                    </div>
                    <div className="text-[10px] text-slate-500">{item.address} ({item.area})</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {item.wasteType}
                    </span>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.estimatedQuantity}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge priority={item.priority} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    <div>{item.preferredDate}</div>
                    <div className="text-[11px] text-slate-400">{item.preferredTime}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'Pickup Requested' && (
                      <button
                        onClick={() => setAssigningPickup(item)}
                        className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 hover:bg-sky-100 font-semibold text-[11px] transition-colors"
                      >
                        Assign Crew
                      </button>
                    )}
                    {item.status === 'Assigned' && (
                      <button
                        onClick={() => updatePickupStatus(item.id, 'Collector En Route')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 font-semibold text-[11px] transition-colors"
                      >
                        Dispatch
                      </button>
                    )}
                    {item.status === 'Collector En Route' && (
                      <button
                        onClick={() => updatePickupStatus(item.id, 'Collected')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px] transition-colors"
                      >
                        Mark Collected
                      </button>
                    )}
                    {(item.status === 'Collected' || item.status === 'Completed' || item.status === 'Verified') && (
                      <span className="text-emerald-700 font-semibold flex items-center justify-end gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Collector Assignment Modal */}
      {assigningPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">Smart Collector Assignment</h3>
                <p className="text-xs text-slate-500">Pickup #{assigningPickup.id} • {assigningPickup.area}</p>
              </div>
              <button 
                onClick={() => setAssigningPickup(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span className="font-bold text-sky-900 text-sm">Suggested Collector</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Collector #07 (Ramesh Yadav)</div>
                    <div className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Closest available collector (1.2km away)</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Low current workload (2 active stops)</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      <span>Vehicle capacity matches {assigningPickup.wasteType} volume</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      updatePickupStatus(assigningPickup.id, 'Assigned', { assignedCrew: 'Collector #07 (Ramesh Yadav)' });
                      setAssigningPickup(null);
                    }}
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-soft hover:shadow-soft-lg hover:bg-primary-dark transition-all"
                  >
                    Assign
                  </button>
                </div>
              </div>
              
              <div className="border border-slate-100 rounded-2xl p-4 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">Collector #12 (Sunil Kumar)</div>
                    <div className="text-xs text-slate-500">Currently in {assigningPickup.area}, but vehicle is 85% full.</div>
                  </div>
                  <button
                    onClick={() => {
                      updatePickupStatus(assigningPickup.id, 'Assigned', { assignedCrew: 'Collector #12 (Sunil Kumar)' });
                      setAssigningPickup(null);
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
