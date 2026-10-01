import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../context/AppContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginAsCitizen, loginAsAdmin, addToast } = useApp();

  const handleCitizenDemo = async () => {
    setLoading(true);
    try {
      await loginAsCitizen();
      navigate('/citizen');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemo = async () => {
    setLoading(true);
    try {
      await loginAsAdmin();
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/citizen');
      }
    } catch (err) {
      // toast handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mx-auto shadow-soft">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome to Nexus Clean
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access your citizen dashboard or municipal control room
          </p>
        </div>

        {/* DEMO LOGIN SHORTCUTS (Clearly Labelled) */}
        <div className="bg-eco-50/70 border border-eco-200/90 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-eco-900">
              ⚡ Instant Demo Profiles
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-eco-200 text-eco-800 font-semibold">
              Hackathon Judging Mode
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleCitizenDemo}
              className="p-3 rounded-2xl bg-white border border-eco-200 hover:border-primary shadow-soft hover:shadow-soft-md transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-primary">
                  Citizen Demo
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Aarav Sharma • Civil Lines
              </p>
            </button>

            <button
              type="button"
              onClick={handleAdminDemo}
              className="p-3 rounded-2xl bg-white border border-rose-200 hover:border-rose-400 shadow-soft hover:shadow-soft-md transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-rose-700">
                  Admin Demo
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Officer Verma • Zone 3
              </p>
            </button>
          </div>
        </div>

        {/* Regular Login Form (Simulated) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. citizen@nexusclean.org"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Register as Citizen
            </Link>
          </div>
        </div>

        {/* Prototype Notice */}
        <p className="text-center text-[11px] text-slate-400">
          Prototype Intelligence: Real JWT authentication and Supabase auth will be integrated via backend in the next phase.
        </p>

      </div>
    </div>
  );
};
