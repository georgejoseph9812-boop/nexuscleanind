import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-soft">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Nexus<span className="text-secondary">Clean</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              "Don't Just Report Waste. Predict It." — Moving civic sanitation from reactive reporting to intelligent hotspot forecasting and preventive collection.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-eco-50 border border-eco-200 text-eco-800 text-[11px] font-medium">
              <Shield className="w-3.5 h-3.5 text-secondary" />
              <span>Hackathon Prototype v1.0</span>
            </div>
          </div>

          {/* Product Lifecycle */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Lifecycle Model
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                DETECT — Multi-step Citizen Reporting
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                PREDICT — Geospatial Risk Hotspots
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                PREVENT — Pre-emptive Fleet Rerouting
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                COLLECT — Smart Pickups & Route Optimization
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                VERIFY — AI Before/After Audit
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Project Overview</Link>
              </li>
              <li>
                <Link to="/awareness" className="hover:text-primary transition-colors">Interactive Waste Awareness</Link>
              </li>
              <li>
                <Link to="/citizen" className="hover:text-primary transition-colors">Citizen Dashboard</Link>
              </li>
              <li>
                <Link to="/citizen/report" className="hover:text-primary transition-colors">Report Waste Issue</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary transition-colors">Admin Intelligence</Link>
              </li>
              <li>
                <Link to="/admin/predictive" className="hover:text-primary transition-colors">Predictive Hotspot Map</Link>
              </li>
            </ul>
          </div>

          {/* Prototype Notice */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 text-xs space-y-2">
            <span className="font-semibold text-slate-800 block">
              Architectural Notice
            </span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Built with React, Vite, and Lucide React. All backend and Gemini API calls are abstracted through <code className="text-primary font-mono text-[10px]">src/services/api.js</code> for instant plug-and-play backend integration.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Nexus Clean. College Hackathon Innovation Project.</p>
          <p className="flex items-center gap-1">
            Engineered for cleaner, predictive, sustainable cities
          </p>
        </div>
      </div>
    </footer>
  );
};
