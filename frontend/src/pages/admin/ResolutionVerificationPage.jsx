import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Calendar,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { useApp } from '../../context/AppContext';

export const ResolutionVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');

  const { complaints, updateComplaintStatus, addToast } = useApp();

  // Find all complaints with submitted proof or resolved
  const verificationQueue = complaints.filter(
    (c) => c.status === 'Resolution Submitted' || c.status === 'Resolved' || c.beforeImage
  );

  const [selectedId, setSelectedId] = useState(
    targetId || verificationQueue[0]?.id || 'NC-1042'
  );

  const selectedComplaint = complaints.find((c) => c.id === selectedId) || verificationQueue[0];

  const handleApprove = async (id) => {
    await updateComplaintStatus(id, 'Resolved', {
      verification: {
        ...(selectedComplaint?.verification || {}),
        status: 'Approved',
        approvedAt: new Date().toISOString()
      }
    });
    addToast(`Complaint #${id} approved! Citizen eco-points awarded.`, 'success');
  };

  const handleRequestRecheck = async (id) => {
    await updateComplaintStatus(id, 'In Progress', {
      verification: {
        ...(selectedComplaint?.verification || {}),
        status: 'Recheck Requested',
        notes: 'Admin flagged residual litter along perimeter curbs.'
      }
    });
    addToast(`Recheck requested for #${id}. Crew re-notified.`, 'info');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
              Automated Audit Queue
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
              Prototype Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Proof of Resolution Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare before/after photographic telemetry and sign off on field crew cleanups
          </p>
        </div>
      </div>

      {selectedComplaint ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Incident Selection Sidebar */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
              Resolution Audit Queue ({verificationQueue.length})
            </h3>

            <div className="space-y-2">
              {verificationQueue.map((item) => {
                const isSelected = item.id === selectedComplaint.id;
                const score = item.verification?.score || 92;

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-primary ring-2 ring-primary/20 shadow-soft-md'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300 shadow-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        #{item.id}
                      </span>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.area}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">AI Confidence:</span>
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {score}% Match
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Detailed Comparison Interface */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Complaint Header */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-sm text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                      #{selectedComplaint.id}
                    </span>
                    <StatusBadge priority={selectedComplaint.priority} size="sm" />
                    <StatusBadge status={selectedComplaint.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedComplaint.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedComplaint.address || selectedComplaint.area}</span>
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 self-start sm:self-center text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    AI Multimodal Audit Score
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-emerald-700">
                    {selectedComplaint.verification?.score || 92}%
                  </span>
                </div>
              </div>

              {/* AI Verification Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>AI Verification Assessment: "Resolution appears successful."</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {selectedComplaint.verification?.summary || "Resolution appears successful. 92% visual clearance of pavement and perimeter detected by simulated AI model comparison."}
                </p>
              </div>

              {/* Side-by-Side Images (Requested Signature Feature) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* BEFORE IMAGE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      BEFORE CLEANUP
                    </span>
                    <span className="text-[10px] text-slate-400">Citizen Report</span>
                  </div>

                  <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    {selectedComplaint.beforeImage ? (
                      <img
                        src={selectedComplaint.beforeImage}
                        alt="Before cleanup"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        No Before Image
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-white text-[10px] font-semibold">
                      Initial Contamination
                    </div>
                  </div>
                </div>

                {/* AFTER IMAGE */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      AFTER CLEANUP
                    </span>
                    <span className="text-[10px] text-slate-400">Field Telemetry</span>
                  </div>

                  <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    {selectedComplaint.afterImage ? (
                      <img
                        src={selectedComplaint.afterImage}
                        alt="After cleanup"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50 text-slate-500 border-2 border-dashed border-slate-200">
                        <ImageIcon className="w-8 h-8 text-amber-500 mb-1" />
                        <span className="text-xs font-semibold">Awaiting resolution proof</span>
                      </div>
                    )}
                    {selectedComplaint.afterImage && (
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-emerald-950/80 text-white text-[10px] font-semibold">
                        Cleared Pavement
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* ACTION BUTTONS (Frontend state only as requested) */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  icon={RotateCcw}
                  onClick={() => handleRequestRecheck(selectedComplaint.id)}
                >
                  Request Recheck
                </Button>

                <Button
                  variant="primary"
                  icon={CheckCircle2}
                  onClick={() => handleApprove(selectedComplaint.id)}
                >
                  Approve Resolution & Award Eco Points
                </Button>
              </div>

            </div>

          </div>

        </div>
      ) : (
        <EmptyState
          title="No verification items in queue"
          description="All submitted cleanups have been processed."
        />
      )}

    </div>
  );
};
