import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Layers, 
  MapPin, 
  Sparkles, 
  Fuel, 
  Users, 
  AlertTriangle, 
  ArrowUpRight 
} from 'lucide-react';
import { StatCard } from '../../components/common/StatCard';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { 
  COMPLAINTS_BY_AREA, 
  RESOLUTION_TIME_TREND, 
  WASTE_TYPE_DISTRIBUTION, 
  RECURRING_PROBLEM_ANALYSIS 
} from '../../data/mockAnalytics';

export const AnalyticsPage = () => {
  const { analytics } = useApp();

  const complaintsByArea = analytics?.complaintsByArea || COMPLAINTS_BY_AREA;
  const resolutionTimeTrend = analytics?.resolutionTimeTrend || RESOLUTION_TIME_TREND;
  const recurringProblems = analytics?.recurringProblems || RECURRING_PROBLEM_ANALYSIS;

  // Pickup efficiency dataset
  const pickupEfficiencyData = [
    { zone: 'Zone 1', avgTransitHours: 1.8, targetHours: 2.5, fuelSavedLiters: 14.5 },
    { zone: 'Zone 2', avgTransitHours: 2.2, targetHours: 2.5, fuelSavedLiters: 11.2 },
    { zone: 'Zone 3', avgTransitHours: 1.5, targetHours: 2.5, fuelSavedLiters: 18.4 },
    { zone: 'Zone 4', avgTransitHours: 2.0, targetHours: 2.5, fuelSavedLiters: 12.0 }
  ];

  // Community participation dataset
  const communityParticipationData = [
    { week: 'W1', activeReporters: 42, segregationRate: 64 },
    { week: 'W2', activeReporters: 58, segregationRate: 71 },
    { week: 'W3', activeReporters: 74, segregationRate: 79 },
    { week: 'W4', activeReporters: 96, segregationRate: 86 }
  ];

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

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-secondary" />
              Strategic Analytics & Audits
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Prototype Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Municipal Operational Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cross-ward performance benchmarks, response velocity, and systemic root-cause intelligence
          </p>
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Resolution Time"
          value="4.8 hrs"
          subtitle="Down from 7.4 hrs in W1"
          change="-35% duration"
          changeType="positive"
          icon={Clock}
        />
        <StatCard
          title="Fleet Fuel Saved"
          value="56.1 L"
          subtitle="Via Dynamic Route TSP"
          change="18% reduction"
          changeType="positive"
          icon={Fuel}
        />
        <StatCard
          title="Civic Participation"
          value="96 Active"
          subtitle="Citizens logging verified actions"
          change="+42% monthly"
          changeType="positive"
          icon={Users}
        />
        <StatCard
          title="Repeat Hotspots"
          value="3 Critical"
          subtitle="Civil Lines, Swaroop Nagar, Mall Rd"
          change="Preventive target"
          changeType="neutral"
          icon={ShieldAlert}
        />
      </div>

      {/* CHARTS GRID 1: AREA & RESOLUTION SPEED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: COMPLAINTS BY AREA */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Incidents & Cleared Volumes by Ward
              </h3>
              <p className="text-xs text-slate-500">
                Reported complaints vs. resolved tickets across major municipal sectors
              </p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full">
              Ward Density
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsByArea} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="area" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="complaints" name="Total Reported" fill="#0F5132" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: AVERAGE RESOLUTION TIME TREND */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                2. Average Resolution Velocity (Hours)
              </h3>
              <p className="text-xs text-slate-500">
                Weekly turnaround time compared against the 6-hour municipal service target
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              Target Exceeded
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resolutionTimeTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line type="monotone" dataKey="avgHours" name="Actual Hours" stroke="#0F5132" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="targetHours" name="Target Ceiling (6h)" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHARTS GRID 2: FLEET EFFICIENCY & COMMUNITY PARTICIPATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 3: PICKUP EFFICIENCY */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                3. Smart Pickup Fleet Efficiency
              </h3>
              <p className="text-xs text-slate-500">
                Average transit hours and cumulative fuel liters saved per zone
              </p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
              Logistics TSP
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pickupEfficiencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="zone" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="avgTransitHours" name="Avg Transit (Hrs)" fill="#0284C7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="fuelSavedLiters" name="Fuel Saved (Liters)" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: COMMUNITY PARTICIPATION */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                4. Community Segregation & Civic Adoption
              </h3>
              <p className="text-xs text-slate-500">
                Growth in active reporters and doorstep source segregation rate (%)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
              Habit Shift
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={communityParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Area type="monotone" dataKey="activeReporters" name="Active Citizens" stroke="#0F5132" fill="#E8F5E9" strokeWidth={2} />
                <Area type="monotone" dataKey="segregationRate" name="Segregation Rate (%)" stroke="#10B981" fill="#D1FAE5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* RECURRING PROBLEM ANALYSIS (Required Signature Feature) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Recurring Problem Analysis
              </h3>
              <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Prototype Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies persistent operational bottlenecks and generates automated intervention proposals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recurringProblems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/70 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {item.id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.severity === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.severity} Priority
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Area
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {item.area}
                  </h4>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">Repeated Issue: </span>
                    <span className="text-slate-600">{item.repeatedIssue}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Frequency: </span>
                    <span className="text-slate-500 font-mono text-[11px]">{item.frequency}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block">
                    Possible Cause:
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {item.possibleCause}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-eco-50/80 border border-eco-200/80 text-xs space-y-1">
                  <span className="font-bold text-primary block">
                    Recommended Action:
                  </span>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {item.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Intervention Status:</span>
                <span className="font-semibold text-emerald-700">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
