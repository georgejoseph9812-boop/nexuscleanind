import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Recycle, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Leaf, 
  Cpu, 
  ShieldAlert,
  HelpCircle,
  Layers,
  ArrowDown
} from 'lucide-react';
import { WasteSortingGame } from '../components/gamification/WasteSortingGame';
import { WASTE_CATEGORIES_INFO, DISPOSAL_JOURNEY_STEPS } from '../data/mockAwareness';
import { apiService } from '../services/api';

export const WasteAwarenessPage = () => {
  const [categories, setCategories] = useState(WASTE_CATEGORIES_INFO);

  useEffect(() => {
    apiService.getAwareness().then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data);
      }
    }).catch(() => {});
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Interactive Civic Education & Segregation Hub</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Master Waste Segregation
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Proper segregation at the source is the single most impactful factor in preventing overflowing landfills and enabling a circular municipal economy.
        </p>
      </div>

      {/* SECTION 1: INTERACTIVE GAME */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-slate-900">
              Interactive Challenge
            </h2>
            <p className="text-xs text-slate-500">
              Test your knowledge by categorizing common items
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full">
            Earns Eco-Score Points
          </span>
        </div>

        <WasteSortingGame />
      </section>

      {/* SECTION 2: EDUCATIONAL STREAM CARDS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Disposal Stream Reference Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Learn the exact bins, examples, and handling protocols for each waste stream.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const isWet = cat.category.includes('Wet');
            const isDry = cat.category.includes('Dry');
            const isRecycle = cat.category.includes('Recyclable');
            const isEWaste = cat.category.includes('E-Waste');
            const isHazard = cat.category.includes('Hazardous');

            return (
              <div
                key={cat.category}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft hover:shadow-soft-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        {cat.binColor}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {cat.category}
                      </h3>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                      {isWet && <Leaf className="w-5 h-5 text-emerald-600" />}
                      {isDry && <Layers className="w-5 h-5 text-sky-600" />}
                      {isRecycle && <Recycle className="w-5 h-5 text-teal-600" />}
                      {isEWaste && <Cpu className="w-5 h-5 text-purple-600" />}
                      {isHazard && <ShieldAlert className="w-5 h-5 text-rose-600" />}
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Common Items:
                    </span>
                    <ul className="space-y-1">
                      {cat.examples.map((item) => (
                        <li key={item} className="text-xs text-slate-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disposal Guide */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-800 block">
                      Recommended Handling:
                    </span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {cat.disposalGuide}
                    </p>
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <strong className="text-primary block mb-0.5">Circular Impact:</strong>
                  {cat.environmentalImpact}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: WHAT HAPPENS AFTER DISPOSAL? (VISUAL JOURNEY) */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl text-white p-8 sm:p-12 lg:p-16 shadow-soft-lg space-y-10 relative overflow-hidden">
        
        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-white/10 px-3.5 py-1 rounded-full border border-white/10">
            Lifecycle Transparency
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            What Happens After Disposal?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Follow the journey of municipal waste from your doorstep to secondary recovery and circular products.
          </p>
        </div>

        {/* Visual Step Sequence */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
          {DISPOSAL_JOURNEY_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col justify-between space-y-3 hover:bg-white/10 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-secondary">
                    STAGE 0{step.step}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {step.step}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 text-[10px] font-semibold text-emerald-300 uppercase tracking-wide">
                {step.highlight}
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
