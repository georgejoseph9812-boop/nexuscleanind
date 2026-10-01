import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const ComplaintCard = ({ complaint, viewMode = 'citizen' }) => {
  const formattedDate = new Date(complaint.submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const detailUrl = viewMode === 'admin' 
    ? `/admin/verification?id=${complaint.id}`
    : `/citizen/complaints/${complaint.id}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-soft-md transition-all duration-200 overflow-hidden flex flex-col group">
      
      {/* Top Banner & Image Thumbnail if available */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {complaint.beforeImage ? (
          <img
            src={complaint.beforeImage}
            alt={complaint.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
            No Image Provided
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 text-xs font-bold tracking-wider uppercase bg-white/95 text-slate-900 rounded-lg shadow-soft font-mono">
            {complaint.id}
          </span>
          <StatusBadge priority={complaint.priority} size="sm" />
        </div>

        <div className="absolute top-3 right-3">
          <StatusBadge status={complaint.status} size="sm" />
        </div>

        {complaint.verification && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Verified: {complaint.verification.score}%</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-eco-700">
            <span>{complaint.category}</span>
          </div>

          <h4 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
            {complaint.title}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{complaint.address || complaint.area}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* AI Detection Insight Snippet */}
          {complaint.aiAnalysis && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span className="font-medium text-[11px]">AI Confidence:</span>
              </div>
              <span className="font-semibold text-slate-900 text-xs font-mono">
                {complaint.aiAnalysis.confidence}%
              </span>
            </div>
          )}

          {/* Action Link */}
          <Link
            to={detailUrl}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-primary bg-primary-light hover:bg-eco-200/60 rounded-xl transition-colors"
          >
            <span>{viewMode === 'admin' ? 'Review & Verify Resolution' : 'Track Lifecycle & Timeline'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};
