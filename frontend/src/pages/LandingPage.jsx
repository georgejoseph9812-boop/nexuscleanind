import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  TrendingUp, 
  Cpu, 
  Truck, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  ChevronRight, 
  AlertTriangle,
  Layers,
  BarChart3,
  User,
  Shield
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { DEMO_STATISTICS } from '../data/mockAnalytics';
import { useApp } from '../context/AppContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loginAsCitizen, loginAsAdmin, analytics } = useApp();
  const stats = analytics?.stats || DEMO_STATISTICS;

  const handleStartReporting = () => {
    loginAsCitizen();
    navigate('/citizen/report');
  };

  const handleExploreDashboard = () => {
    loginAsAdmin();
    navigate('/admin');
  };

  // Product Lifecycle Steps
  const lifecycleSteps = [
    { title: 'DETECT', desc: 'Citizen issue logging with instant computer vision verification', color: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
    { title: 'ANALYZE', desc: 'Extract material composition, priority, and response timeframe', color: 'bg-teal-600', text: 'text-teal-700', bg: 'bg-teal-50' },
    { title: 'PREDICT', desc: 'Geospatial ML detects recurring accumulation patterns & hotspots', color: 'bg-primary', text: 'text-primary', bg: 'bg-eco-100' },
    { title: 'PREVENT', desc: 'Autonomous route scheduling before bins hit overflow capacity', color: 'bg-amber-600', text: 'text-amber-700', bg: 'bg-amber-50' },
    { title: 'COLLECT', desc: 'Dynamic fleet routing and optimized multi-stop collection', color: 'bg-sky-600', text: 'text-sky-700', bg: 'bg-sky-50' },
    { title: 'VERIFY', desc: 'Before/after visual audit with AI resolution confidence scoring', color: 'bg-purple-600', text: 'text-purple-700', bg: 'bg-purple-50' },
    { title: 'IMPROVE', desc: 'Predictive data refines municipal budgets and fleet deployment', color: 'bg-rose-600', text: 'text-rose-700', bg: 'bg-rose-50' }
  ];

  // How Nexus Clean Works
  const workflowSteps = [
    {
      step: '01',
      title: 'Citizen Reports',
      desc: 'Snaps a quick photo of an overflowing bin, roadside garbage, or dumpsite with automatic location geotagging.'
    },
    {
      step: '02',
      title: 'AI Analyzes',
      desc: 'Multimodal vision classifies waste type, calculates estimated volume, assesses priority, and flags hazardous risks.'
    },
    {
      step: '03',
      title: 'System Detects Patterns',
      desc: 'Predictive engine correlates time, density, and historical recurrence to highlight emerging municipal hotspots.'
    },
    {
      step: '04',
      title: 'Admin Takes Action',
      desc: 'Sanitation operators dispatch smart-routed crews for targeted preventive clearance before overflows escalate.'
    },
    {
      step: '05',
      title: 'Resolution Is Verified',
      desc: 'Field teams submit cleanup proof. AI and administrators verify the cleared area before awarding citizen eco-points.'
    }
  ];

  // Core Features
  const features = [
    {
      icon: Cpu,
      title: 'AI-Assisted Detection',
      tag: 'Vision Intelligence',
      desc: 'Identifies waste categories, calculates confidence scores, and determines response urgency within seconds.',
      link: '/citizen/report'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Hotspot Intelligence',
      tag: 'Signature Innovation',
      desc: 'Maps risk zones and predicts overflow probabilities up to 24 hours in advance using pattern recurrence.',
      link: '/admin/predictive'
    },
    {
      icon: Truck,
      title: 'Smart Pickup Management',
      tag: 'Dynamic Routing',
      desc: 'Algorithms compute optimized vehicle sequences (A → C → B → D), cutting transit fuel consumption by 18%.',
      link: '/admin/smart-pickup'
    },
    {
      icon: ShieldCheck,
      title: 'Proof-of-Resolution',
      tag: 'Accountability Audit',
      desc: 'Side-by-side Before/After comparison with AI-assisted sanitation verification prevents phantom cleanups.',
      link: '/admin/verification'
    },
    {
      icon: BookOpen,
      title: 'Waste Awareness',
      tag: 'Civic Education',
      desc: 'Interactive "Sort the Waste" challenge and complete material lifecycle guides cultivate citizen habit shifts.',
      link: '/awareness'
    },
    {
      icon: Award,
      title: 'Community Eco Score',
      tag: 'Civic Gamification',
      desc: 'Quantifies neighborhood cleanliness, tracks verified participation, and unlocks community milestone rewards.',
      link: '/citizen/eco-score'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-eco-50/60 via-white to-slate-50 border-b border-slate-200/60">
        
        {/* Ambient Eco Glow circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-eco-100/40 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-eco-200 shadow-soft text-xs font-semibold text-eco-900">
            <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
            <span>Smart Civic Infrastructure • Next-Gen Waste Management</span>
          </div>

          {/* Hero Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Don't Just Report Waste. <br />
              <span className="bg-gradient-to-r from-primary via-emerald-700 to-secondary bg-clip-text text-transparent">
                Predict It.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Nexus Clean connects citizens and administrators to detect waste problems, predict hotspots, prevent recurring issues, and build cleaner communities.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              size="lg"
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={handleStartReporting}
              className="w-full sm:w-auto shadow-soft-md"
            >
              Report Waste Issue
            </Button>

            <Button
              size="lg"
              variant="outline"
              icon={Shield}
              onClick={handleExploreDashboard}
              className="w-full sm:w-auto"
            >
              Explore Admin Intelligence
            </Button>
          </div>

          {/* Quick Demo Switch Banner */}
          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
            <span>Instant Demo Access:</span>
            <button
              onClick={() => { loginAsCitizen(); navigate('/citizen'); }}
              className="font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" /> Citizen Portal
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => { loginAsAdmin(); navigate('/admin'); }}
              className="font-semibold text-rose-700 hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Intelligence
            </button>
          </div>

          {/* DEMO STATISTICS BAR */}
          <div className="pt-10">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft-lg p-6 sm:p-8 max-w-5xl mx-auto">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100 text-xs">
                <span className="font-bold uppercase tracking-wider text-slate-400">
                  Municipal Operations Live Telemetry
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                  Simulated Prototype Dataset
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono">
                    {stats.totalComplaints}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Issues Reported
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono">
                    {stats.resolvedComplaints}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Issues Resolved
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 font-mono">
                    {stats.highRiskHotspots}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    High-Risk Hotspots
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-3xl sm:text-4xl font-extrabold text-primary font-mono">
                    {stats.resolutionRate}%
                  </div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Resolution Rate
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT LIFECYCLE MODEL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full">
            Our Architectural Innovation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            From Reactive Reporting to Predictive Prevention
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Traditional platforms only respond after garbage piles up. Nexus Clean learns municipal waste cycles to prevent overflows before they happen.
          </p>
        </div>

        {/* Lifecycle Flow Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {lifecycleSteps.map((step, idx) => (
            <div
              key={step.title}
              className={`p-4 rounded-2xl border border-slate-200/80 bg-white shadow-soft flex flex-col justify-between space-y-2 hover:border-primary/50 transition-all`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 block mb-1">
                  0{idx + 1}
                </span>
                <span className={`text-xs font-extrabold tracking-wider ${step.text}`}>
                  {step.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW NEXUS CLEAN WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-soft-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-white/10 px-3 py-1 rounded-full border border-white/10">
              Operational Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Nexus Clean Works
            </h2>
            <p className="text-sm text-slate-300">
              A continuous intelligence loop engineered to systematically eradicate recurring public waste dumps.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-6">
            {workflowSteps.map((step) => (
              <div key={step.step} className="space-y-3 p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl font-extrabold text-secondary font-mono">
                  {step.step}
                </span>
                <h4 className="text-base font-bold text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INNOVATIVE FEATURE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary-light px-3 py-1 rounded-full">
            Core Innovation Engine
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered For Hackathon Excellence
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Explore the six key modules built into this prototype.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-soft hover:shadow-soft-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-eco-50 border border-eco-200 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to={feat.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-secondary transition-colors"
                  >
                    <span>Launch Module</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-primary via-emerald-900 to-slate-950 text-white p-8 sm:p-14 text-center overflow-hidden shadow-soft-lg">
          <div className="absolute inset-0 map-grid-pattern opacity-15 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready to Transform Municipal Sanitation?
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
              Experience the future of predictive civic technology. Join citizens and administrators in pioneering clean, proactive cities.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                variant="secondary"
                icon={ArrowRight}
                iconPosition="right"
                onClick={handleStartReporting}
                className="w-full sm:w-auto shadow-soft-md"
              >
                Report Waste Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 hover:border-white"
                onClick={handleExploreDashboard}
              >
                Inspect Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
