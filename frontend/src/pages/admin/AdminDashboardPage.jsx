import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  Layers, 
  ArrowUpRight, 
  ChevronRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { 
  DEMO_STATISTICS, 
  COMPLAINTS_OVER_TIME, 
  COMPLAINTS_BY_CATEGORY, 
  RESOLUTION_RATE_DATA, 
  WASTE_TYPE_DISTRIBUTION 
} from '../../data/mockAnalytics';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { complaints, hotspots, pickups, analytics } = useApp();

  const stats = analytics?.stats || DEMO_STATISTICS;
  const complaintsOverTime = analytics?.complaintsOverTime || COMPLAINTS_OVER_TIME;
  const complaintsByCategory = analytics?.complaintsByCategory || COMPLAINTS_BY_CATEGORY;
  const resolutionRateData = analytics?.resolutionRateData || RESOLUTION_RATE_DATA;
  const wasteTypeDistribution = analytics?.wasteTypeDistribution || WASTE_TYPE_DISTRIBUTION;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-soft text-xs space-y-1 border border-slate-700">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
              {entry.name}: <span className="font-mono font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const pendingVerificationList = complaints.filter(
    (c) => c.status === 'Resolution Submitted' || c.status === 'In Progress'
  ).slice(0, 4);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
              Municipal Command Central
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Prototype Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Nexus Clean — Admin Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time municipal telemetry, predictive risk forecasts, and automated fleet dispatch
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon={TrendingUp}
            onClick={() => navigate('/admin/predictive')}
          >
            Predictive Hotspot Map
          </Button>

          <Button
            variant="primary"
            icon={CheckCircle2}
            onClick={() => navigate('/admin/verification')}
          >
            Verify Cleanup Proofs
          </Button>
        </div>
      </div>

      {/* CORE MUNICIPAL STATISTICS (Required Prompt Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Complaints"
          value={stats.totalComplaints}
          subtitle="All-time logged"
          icon={Layers}
        />
        <StatCard
          title="Pending"
          value={stats.pendingComplaints}
          subtitle="Awaiting review"
          icon={Clock}
          change="+4 today"
          changeType="neutral"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressComplaints}
          subtitle="Crews on site"
          icon={Truck}
        />
        <StatCard
          title="Resolved"
          value={stats.resolvedComplaints}
          subtitle="Verified clean"
          icon={CheckCircle2}
          change={`${stats.resolutionRate}%`}
          changeType="positive"
        />
        <StatCard
          title="High Priority"
          value={stats.highPriorityComplaints}
          subtitle="Urgent action"
          icon={ShieldAlert}
          change="Critical"
          changeType="negative"
        />
        <StatCard
          title="Pickup Requests"
          value={stats.pickupRequests}
          subtitle="On-demand fleet"
          icon={Truck}
        />
      </div>

      {/* NEXUS PREDICTION CARD */}
      {(() => {
        // Prefer dynamic emerging hotspots (not prototype), otherwise fall back to highest risk mock hotspot
        const emergingHotspot = hotspots.find(h => h.is_prototype === false) || hotspots.find(h => h.risk === 'HIGH' || h.risk === 'CRITICAL');
        
        if (emergingHotspot) {
          return (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border border-sky-800/60 shadow-soft-lg flex flex-col md:flex-row items-start justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex-1 space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-400 bg-sky-950/80 px-2.5 py-1 rounded-lg border border-sky-800 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5" />
                    Nexus Prediction
                  </span>
                  {emergingHotspot.is_prototype === false ? (
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                      Live Emerging Hotspot
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                      Prototype Model
                    </span>
                  )}
                </div>
                
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {emergingHotspot.is_prototype === false ? 'Emerging Hotspot Detected' : 'High Risk Area Identified'}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Area</div>
                      <div className="font-bold text-sky-100">{emergingHotspot.area || emergingHotspot.name}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reports</div>
                      <div className="font-bold text-white">{emergingHotspot.complaints_count || emergingHotspot.complaints || 0}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Primary Issue</div>
                      <div className="font-bold text-rose-300">{emergingHotspot.primary_issue || emergingHotspot.primaryIssue}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Risk & Trend</div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <StatusBadge status={emergingHotspot.risk} size="sm" />
                        <span className="text-xs text-sky-300">{emergingHotspot.trend}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="text-[11px] text-sky-400 uppercase tracking-wider font-bold mb-1">Recommended Action</div>
                  <p className="text-sm text-slate-300">
                    {emergingHotspot.ai_recommendation || emergingHotspot.aiRecommendation || 'Schedule preventive inspection and deploy targeted collection crew.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 relative z-10 w-full md:w-auto">
                <Button
                  variant="primary"
                  icon={ArrowUpRight}
                  iconPosition="right"
                  onClick={() => navigate('/admin/predictive')}
                  className="w-full"
                >
                  View on Smart Map
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                  onClick={() => navigate('/admin/smart-pickup')}
                >
                  Dispatch Crew
                </Button>
              </div>
            </div>
          );
        }
        
        return (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700">Nexus Prediction System Active</h4>
            <p className="text-xs text-slate-500">Monitoring real-time telemetry. No emerging high-risk hotspots detected currently.</p>
          </div>
        );
      })()}

      {/* RECHARTS DATA VISUALIZATION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: COMPLAINTS OVER TIME */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Issue Volume & Predictive Forecast Over Time
              </h3>
              <p className="text-xs text-slate-500">
                Reported incidents vs. AI predicted overflow trend
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full">
              6-Month Curve
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F5132" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0F5132" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Area type="monotone" dataKey="reported" name="Reported" stroke="#0F5132" strokeWidth={2} fillOpacity={1} fill="url(#colorReported)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" />
                <Area type="monotone" dataKey="predicted" name="AI Projected" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: COMPLAINTS BY CATEGORY */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Complaints by Incident Category
              </h3>
              <p className="text-xs text-slate-500">
                Density breakdown across municipal classifications
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              Category Distribution
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsByCategory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => val.split(' ')[0]} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Complaints" radius={[8, 8, 0, 0]}>
                  {complaintsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: RESOLUTION RATE RATIO */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. Operational Resolution Status
              </h3>
              <p className="text-xs text-slate-500">
                Proportion of closed vs. active field operations
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              91% Target Met
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resolutionRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: WASTE TYPE DISTRIBUTION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Municipal Waste Stream Composition
              </h3>
              <p className="text-xs text-slate-500">
                Estimated tonnage by material stream (Prototype AI Inference)
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
              Stream Audit
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {wasteTypeDistribution.map((item) => (
              <div key={item.type} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.type}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{item.tons} tons</strong> ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK VERIFICATION QUEUE & FIELD OPS */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Pending Resolution Proofs & Active Incidents
            </h3>
            <p className="text-xs text-slate-500">
              Field crew submissions awaiting administrator audit and AI verification signoff
            </p>
          </div>

          <Link
            to="/admin/verification"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Full Resolution Queue</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingVerificationList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={item.beforeImage || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=100&q=80'}
                  alt={item.title}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-900">{item.id}</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{item.area}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/verification')}
                className="shrink-0"
              >
                Inspect Audit
              </Button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
