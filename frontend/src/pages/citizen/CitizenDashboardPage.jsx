import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  PlusCircle, 
  Truck, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';

export const CitizenDashboardPage = () => {
  const navigate = useNavigate();
  const { complaints, pickups, currentUser } = useApp();

  const myComplaints = complaints.filter(c => c.userId === currentUser?.id || c.userId === 'USR-CITIZEN-01');
  const myPickups = pickups.filter(p => p.userId === currentUser?.id || p.requesterName === currentUser?.name);

  const openComplaintsCount = myComplaints.filter((c) => c.status !== 'Resolved').length;
  const resolvedComplaintsCount = myComplaints.filter((c) => c.status === 'Resolved').length;
  const pickupCount = myPickups.length;

  const recentComplaints = myComplaints.slice(0, 3);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Good morning 👋</span>
            <span className="text-primary font-semibold">{currentUser?.name?.split(' ')[0] || 'Aarav'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ward: <strong className="text-slate-700">{currentUser?.location || 'Civil Lines, Kanpur'}</strong> • Active Community Contributor
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => navigate('/citizen/report')}
          >
            Report Waste
          </Button>

          <Button
            variant="outline"
            icon={Truck}
            onClick={() => navigate('/citizen/pickup')}
          >
            Request Pickup
          </Button>
        </div>
      </div>

      {/* DASHBOARD STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Eco Score Card */}
        <StatCard
          title="Community Eco Score"
          value="78/100"
          subtitle="Tier II: Eco Guardian"
          badgeText="+18% this month"
          icon={Award}
          onClick={() => navigate('/citizen/eco-score')}
        />

        {/* Open Complaints */}
        <StatCard
          title="Open Complaints"
          value={openComplaintsCount}
          subtitle="Awaiting resolution or verified"
          icon={Clock}
          onClick={() => navigate('/citizen/complaints')}
        />

        {/* Resolved Complaints */}
        <StatCard
          title="Resolved Complaints"
          value={resolvedComplaintsCount}
          subtitle="91% municipal resolution rate"
          icon={CheckCircle2}
          onClick={() => navigate('/citizen/complaints')}
        />

        {/* Pickup Requests */}
        <StatCard
          title="Pickup Requests"
          value={pickupCount}
          subtitle="Scheduled door pickups"
          icon={Truck}
          onClick={() => navigate('/citizen/pickup')}
        />

      </div>

      {/* NEARBY WASTE ALERT */}
      {(() => {
        const { hotspots } = useApp();
        const nearbyHotspot = hotspots.find(h => h.is_prototype === false) || hotspots.find(h => h.risk === 'HIGH' || h.risk === 'CRITICAL');
        
        if (nearbyHotspot) {
          return (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white p-6 sm:p-7 shadow-soft-lg border border-rose-800/60">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0 shadow-soft">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] uppercase tracking-wider">
                        HIGH-RISK WASTE HOTSPOT
                      </span>
                      {nearbyHotspot.is_prototype === false ? (
                        <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300 font-mono">
                          Live Active Area
                        </span>
                      ) : (
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded border border-white/15 text-slate-300 font-mono">
                          Prototype Intelligence
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {nearbyHotspot.name} • {nearbyHotspot.area}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                      <span>Primary issue: <strong className="text-white">{nearbyHotspot.primary_issue || nearbyHotspot.primaryIssue}</strong></span>
                      <span className="text-rose-400">•</span>
                      <span>Reports: <strong className="text-white">{nearbyHotspot.complaints_count || nearbyHotspot.complaints}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <Link
                    to={`/citizen/report?area=${nearbyHotspot.area}&category=${nearbyHotspot.primary_issue || nearbyHotspot.primaryIssue}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-rose-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-soft"
                  >
                    <span>Report Similar Issue</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* COMMUNITY IMPACT BANNER */}
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-soft">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950">
              Community Waste Trend Notice
            </h4>
            <p className="text-xs text-emerald-800">
              "Your community's waste complaints decreased by <strong>18% this month</strong>."
            </p>
          </div>
        </div>

        <Link
          to="/citizen/eco-score"
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 shrink-0"
        >
          <span>View Eco-Score Details</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* RECENT ACTIVITY & QUICK COMPLAINTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-bold text-slate-900">
              Recent Issue Telemetry
            </h3>
            <p className="text-xs text-slate-500">
              Your recent reports and local municipal resolution progress
            </p>
          </div>

          <Link
            to="/citizen/complaints"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All ({complaints.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {complaint.id}
                  </span>
                  <StatusBadge status={complaint.status} size="sm" />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {complaint.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {complaint.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 truncate max-w-[60%]">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{complaint.area}</span>
                </span>

                <Link
                  to={`/citizen/complaints/${complaint.id}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>Track</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
