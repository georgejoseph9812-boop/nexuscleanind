import React from 'react';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Flag, 
  Zap, 
  Sparkles, 
  Lock 
} from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const EcoScoreCard = ({ ecoData, className = '' }) => {
  const data = ecoData || {
    total: 78,
    max: 100,
    level: "Eco Guardian (Tier II)",
    monthlyImprovement: "+18%",
    breakdown: [
      { category: "Waste Reporting", points: 20, max: 25, description: "Active & verified issue logging" },
      { category: "Proper Segregation", points: 25, max: 30, description: "Consistent door-to-door dry/wet sorting" },
      { category: "Community Participation", points: 18, max: 25, description: "Peer validations & neighborhood cleanups" },
      { category: "Awareness Activities", points: 15, max: 20, description: "Waste sorting quizzes & guides completed" }
    ],
    achievements: [
      { id: "ach-1", title: "First Reporter", description: "Logged your first verified municipal waste issue", icon: Flag, unlocked: true },
      { id: "ach-2", title: "Segregation Starter", description: "Completed 10 consecutive door-to-door sorted pickups", icon: CheckCircle2, unlocked: true },
      { id: "ach-3", title: "Community Champion", description: "Helped reduce local hotspot complaints by 15%+", icon: Award, unlocked: true }
    ]
  };

  const iconMap = {
    Flag,
    CheckCircle2,
    Award,
    ShieldCheck,
    Zap
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6 ${className}`}>
      
      {/* Top Banner: Score Display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-5">
          {/* Radial-styled Score Badge */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-eco-700 flex flex-col items-center justify-center text-white shadow-soft-md ring-8 ring-eco-50 shrink-0">
            <span className="text-3xl font-extrabold font-mono tracking-tight">
              {data.total}
            </span>
            <span className="text-[11px] font-semibold opacity-80 uppercase tracking-widest">
              / {data.max}
            </span>
            <Sparkles className="w-3.5 h-3.5 text-secondary absolute top-2 right-2 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-eco-800 bg-eco-50 px-2.5 py-1 rounded-full border border-eco-200">
              {data.level || 'Eco Guardian (Tier II)'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Community Eco Score
            </h3>
            <p className="text-xs text-slate-500">
              Transparent sustainability benchmark based on verified civic actions
            </p>
          </div>
        </div>

        {/* Community Monthly Impact Badge */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 self-start sm:self-center space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Community Impact</span>
          </div>
          <p className="text-xs font-medium text-emerald-700">
            Your community's waste complaints decreased by <strong>18% this month</strong>.
          </p>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Point Contribution Breakdown
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.breakdown.map((item) => (
            <div key={item.category} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{item.category}</span>
                <span className="font-mono font-bold text-primary">
                  {item.points} / {item.max} pts
                </span>
              </div>
              <ProgressBar
                value={item.points}
                max={item.max}
                showValue={false}
                color="primary"
                size="sm"
              />
              <p className="text-[11px] text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Badges & Milestones */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Verified Civic Badges
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.achievements.map((ach) => {
            const Icon = typeof ach.icon === 'string' ? (iconMap[ach.icon] || Award) : (ach.icon || Award);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                  ach.unlocked
                    ? 'bg-white border-eco-200/90 shadow-soft'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.unlocked
                      ? 'bg-eco-100 text-eco-800 border border-eco-200'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {ach.unlocked ? <Icon className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="overflow-hidden">
                  <h5 className="text-xs font-bold text-slate-900 truncate">
                    {ach.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 line-clamp-1">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
