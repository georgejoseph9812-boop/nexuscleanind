import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { EcoScoreCard } from '../../components/gamification/EcoScoreCard';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';

export const EcoScorePage = () => {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-2">
            <Award className="w-3.5 h-3.5 text-secondary" />
            <span>Civic Gamification & Impact Index</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Community Eco Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your verified civic sanitation participation and earn municipal green recognition.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon={BookOpen}
            onClick={() => navigate('/awareness')}
          >
            Waste Quizzes
          </Button>

          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => navigate('/citizen/report')}
          >
            Report Issue (+10 pts)
          </Button>
        </div>
      </div>

      {/* Main Professional Eco Score Card */}
      <EcoScoreCard ecoData={currentUser?.ecoScore} />

      {/* HOW TO EARN POINTS SECTION (Mature & Professional) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-5">
        <h3 className="text-base font-bold text-slate-900">
          How Your Eco-Score is Computed
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">1. Waste Issue Reporting</span>
              <span className="font-mono font-bold text-emerald-700">+10 pts per verified report</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Awarded when you submit a geotagged issue that is verified and cleared by municipal field teams.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">2. Proper Source Segregation</span>
              <span className="font-mono font-bold text-emerald-700">+15 pts weekly streak</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Door-to-door collection vans log contamination-free dry/wet segregation at your doorstep barcode.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">3. Hotspot Prevention Spotting</span>
              <span className="font-mono font-bold text-emerald-700">+20 pts per hotspot prevented</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Awarded when your advance report allows the municipality to deploy preventive collection before overflow occurs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">4. Interactive Awareness Quizzes</span>
              <span className="font-mono font-bold text-emerald-700">+5 pts per quiz completion</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Completing educational modules and the "Sort the Waste" interactive challenge boosts awareness index.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
