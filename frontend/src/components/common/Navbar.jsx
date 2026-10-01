import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  LogOut, 
  BookOpen, 
  LayoutDashboard, 
  PlusCircle, 
  Compass,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, loginAsCitizen, loginAsAdmin, logout, resetDemo } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCitizenDemo = () => {
    loginAsCitizen();
    navigate('/citizen');
    setMobileMenuOpen(false);
  };

  const handleAdminDemo = () => {
    loginAsAdmin();
    navigate('/admin');
    setMobileMenuOpen(false);
  };

  const isCitizenArea = location.pathname.startsWith('/citizen');
  const isAdminArea = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-soft group-hover:shadow-soft-md transition-all">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                    Nexus<span className="text-secondary">Clean</span>
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-eco-800 bg-eco-100 rounded-md border border-eco-200">
                    Predictive Eco-Tech
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden md:block">
                  Don't Just Report Waste. Predict It.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors ${
                location.pathname === '/'
                  ? 'text-primary bg-primary-light font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Overview
            </Link>

            <Link
              to="/awareness"
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
                location.pathname === '/awareness'
                  ? 'text-primary bg-primary-light font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Waste Awareness</span>
            </Link>

            {currentUser?.role === 'citizen' && (
              <Link
                to="/citizen"
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
                  isCitizenArea
                    ? 'text-primary bg-primary-light font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Citizen Portal</span>
            </Link>
          )}

            {currentUser?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${
                  isAdminArea
                    ? 'text-primary bg-primary-light font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>Admin Intelligence</span>
            </Link>
          )}
          </nav>

          {/* Quick Demo Switchers & Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Clear Demo Buttons Requested in Problem Statement */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={handleCitizenDemo}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentUser?.role === 'citizen'
                    ? 'bg-white text-primary shadow-soft'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Citizen Perspective"
              >
                <User className="w-3.5 h-3.5 text-emerald-600" />
                Citizen Demo
              </button>

              <button
                type="button"
                onClick={handleAdminDemo}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-white text-rose-700 shadow-soft'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Municipal Admin Perspective"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                Admin Demo
              </button>
            </div>

            {/* Quick Action Button */}
            <Button
              size="sm"
              variant="primary"
              icon={PlusCircle}
              onClick={() => {
                if (currentUser?.role !== 'citizen') loginAsCitizen();
                navigate('/citizen/report');
              }}
            >
              Report Waste
            </Button>

            {/* User Profile or Logout */}
            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-600 hidden xl:inline">
                  {currentUser.name}
                </span>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
            <Button
              variant="outline"
              size="sm"
              icon={User}
              onClick={handleCitizenDemo}
            >
              Citizen Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={ShieldCheck}
              onClick={handleAdminDemo}
            >
              Admin Demo
            </Button>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-xl text-slate-700 hover:bg-slate-50"
            >
              Overview & Lifecycle
            </Link>
            <Link
              to="/awareness"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-xl text-slate-700 hover:bg-slate-50"
            >
              Waste Awareness & Sorting Game
            </Link>
            <Link
              to="/citizen"
              onClick={() => {
                loginAsCitizen();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-medium rounded-xl text-emerald-800 bg-emerald-50"
            >
              Citizen Dashboard
            </Link>
            <Link
              to="/admin"
              onClick={() => {
                loginAsAdmin();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-medium rounded-xl text-rose-800 bg-rose-50"
            >
              Admin Intelligence
            </Link>
          </div>

          <div className="pt-2">
            <Button
              fullWidth
              size="sm"
              icon={PlusCircle}
              onClick={() => {
                loginAsCitizen();
                navigate('/citizen/report');
                setMobileMenuOpen(false);
              }}
            >
              Report Waste Issue
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
