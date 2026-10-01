import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, User, Mail, Lock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useApp } from '../context/AppContext';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, loginAsCitizen, loginAsAdmin, addToast } = useApp();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      navigate('/citizen');
    } catch (err) {
      // toast handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white mx-auto shadow-soft">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Join the Nexus Clean Movement
          </h2>
          <p className="text-xs text-slate-500">
            Create an account to report issues, track community cleanup, and earn Eco-Score points
          </p>
        </div>

        {/* Demo Fast Access */}
        <div className="p-4 rounded-2xl bg-eco-50 border border-eco-200 text-xs flex items-center justify-between">
          <span className="font-semibold text-eco-900">Evaluating for hackathon?</span>
          <div className="flex gap-2">
            <button
              onClick={() => { loginAsCitizen(); navigate('/citizen'); }}
              className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
            >
              Citizen Demo
            </button>
            <span className="text-eco-300">|</span>
            <button
              onClick={() => { loginAsAdmin(); navigate('/admin'); }}
              className="text-xs font-bold text-rose-800 underline hover:text-rose-950"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Aarav Sharma"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="aarav@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 8 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Location / Area / Ward"
              name="location"
              placeholder="e.g. Civil Lines, Sector 4"
              icon={MapPin}
              value={formData.location}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Register & Start
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
