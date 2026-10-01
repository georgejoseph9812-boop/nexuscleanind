import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Truck, 
  ClipboardList, 
  Award, 
  MapPin, 
  ShieldAlert, 
  Navigation, 
  CheckSquare, 
  BarChart3, 
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ role = 'citizen' }) => {
  const { complaints, hotspots, pickups, currentUser, resetDemo } = useApp();
  const navigate = useNavigate();

  const citizenNav = [
    { to: '/citizen', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/citizen/report', icon: PlusCircle, label: 'Report Waste', highlight: true },
    { to: '/citizen/pickup', icon: Truck, label: 'Waste Pickup' },
    { 
      to: '/citizen/complaints', 
      icon: ClipboardList, 
      label: 'My Complaints',
      badge: complaints.filter(c => c.status !== 'Resolved').length 
    },
    { to: '/citizen/eco-score', icon: Award, label: 'Community Eco Score', scoreText: '78/100' },
    { to: '/awareness', icon: BookOpen, label: 'Waste Awareness' }
  ];

  const adminNav = [
    { to: '/admin', icon: LayoutDashboard, label: 'Admin Intelligence', end: true },
    { 
      to: '/admin/predictive', 
      icon: ShieldAlert, 
      label: 'Predictive Hotspots', 
      badge: hotspots.filter(h => h.risk === 'HIGH').length,
      badgeColor: 'bg-rose-100 text-rose-800' 
    },
    { to: '/admin/smart-pickup', icon: Navigation, label: 'Smart Pickup Fleet' },
    { 
      to: '/admin/verification', 
      icon: CheckSquare, 
      label: 'Resolution Proofs',
      badge: complaints.filter(c => c.status === 'Resolution Submitted').length,
      badgeColor: 'bg-purple-100 text-purple-800'
    },
    { to: '/admin/analytics', icon: BarChart3, label: 'Recurring Analytics' }
  ];

  const navItems = role === 'admin' ? adminNav : citizenNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex shrink-0">
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
              role === 'admin' ? 'bg-rose-500' : 'bg-emerald-500'
            }`} />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-slate-900 truncate">
              {currentUser?.name || (role === 'admin' ? 'Officer Verma' : 'Aarav Sharma')}
            </h4>
            <p className="text-xs text-slate-500 truncate capitalize">
              {role === 'admin' ? 'Operations Admin' : currentUser?.location || 'Civil Lines'}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === 'admin' ? 'Operations Intelligence' : 'Citizen Services'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                  ${isActive
                    ? role === 'admin'
                      ? 'bg-rose-50 text-rose-800 font-semibold'
                      : 'bg-primary-light text-primary font-semibold'
                    : item.highlight
                    ? 'text-primary bg-eco-50/60 hover:bg-eco-100 hover:text-primary font-medium'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-200 text-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {item.scoreText && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {item.scoreText}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Prototype Badge & Reset Helper */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900">
          <div className="flex items-center gap-1.5 mb-1 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Prototype Intelligence</span>
          </div>
          <p className="text-[11px] text-amber-800/80 leading-relaxed">
            AI classifications & hotspot forecasts use realistic simulated mock intelligence for judging.
          </p>
        </div>

        <button
          onClick={resetDemo}
          className="w-full py-2 px-3 text-xs text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          title="Reset local changes back to default demo state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>
    </aside>
  );
};
