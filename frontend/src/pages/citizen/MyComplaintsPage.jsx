import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon,
  Sparkles,
  ClipboardList
} from 'lucide-react';
import { ComplaintCard } from '../../components/complaints/ComplaintCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';

export const MyComplaintsPage = () => {
  const navigate = useNavigate();
  const { complaints } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid'); // 'grid' | 'table'

  const filters = ['All', 'Pending', 'In Progress', 'Resolved', 'High Priority'];

  const filteredComplaints = complaints.filter((c) => {
    // Priority filter
    if (activeFilter === 'High Priority') {
      if (c.priority !== 'High') return false;
    } else if (activeFilter !== 'All') {
      if (c.status !== activeFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchArea = c.area.toLowerCase().includes(q);
      const matchCategory = c.category.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchArea && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Tracked Waste Issues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status updates and end-to-end municipal resolution lifecycle
          </p>
        </div>

        <Button
          variant="primary"
          icon={PlusCircle}
          onClick={() => navigate('/citizen/report')}
        >
          Report New Issue
        </Button>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search & Layout Toggles */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, area, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewType('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewType === 'grid' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewType === 'table' ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* COMPLAINTS CONTENT */}
      {filteredComplaints.length > 0 ? (
        viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                viewMode="citizen"
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Complaint ID</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/citizen/complaints/${c.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {c.id}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {c.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {c.area}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(c.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge priority={c.priority} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-primary font-semibold hover:underline">
                          View Timeline →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="No complaints match this filter"
          description="Try selecting a different filter pill or search query, or report a new waste problem."
          actionLabel="Report Waste"
          onAction={() => navigate('/citizen/report')}
        />
      )}

    </div>
  );
};
