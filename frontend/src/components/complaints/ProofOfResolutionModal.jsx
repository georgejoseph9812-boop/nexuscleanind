import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Image as ImageIcon 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

export const ProofOfResolutionModal = ({
  isOpen,
  onClose,
  complaint,
  onApprove,
  onRequestRecheck
}) => {
  const [activeTab, setActiveTab] = useState('sideBySide'); // 'sideBySide' | 'slider'

  if (!complaint) return null;

  const hasAfterImage = Boolean(complaint.afterImage);
  const score = complaint.verification?.score || 92;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolution Audit: #${complaint.id}`}
      subtitle={`${complaint.category} — ${complaint.address || complaint.area}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Verification Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-soft">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    AI Multimodal Resolution Audit
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 uppercase">
                    Prototype Intelligence
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {complaint.verification?.summary || "Resolution appears successful. 92% visual clearance of pavement and perimeter detected."}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-1.5 self-end sm:self-center bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-soft">
              <span className="text-xs text-slate-500 font-medium">Confidence:</span>
              <span className="text-base font-extrabold text-emerald-700 font-mono">
                {score}%
              </span>
            </div>
          </div>
        </div>

        {/* Before & After Image Split View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Before Photo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Before Cleanup
              </span>
              <span className="text-[11px] text-slate-400">Initial Citizen Upload</span>
            </div>

            <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              {complaint.beforeImage ? (
                <img
                  src={complaint.beforeImage}
                  alt="Before Cleanup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs">No Before Image</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium">
                Reported State
              </div>
            </div>
          </div>

          {/* After Photo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                After Cleanup
              </span>
              <span className="text-[11px] text-slate-400">Field Crew Resolution Submission</span>
            </div>

            <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              {complaint.afterImage ? (
                <img
                  src={complaint.afterImage}
                  alt="After Cleanup"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50 p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">Awaiting resolution proof</span>
                  <p className="text-xs text-slate-400 mt-1">
                    Field cleanup crew has not yet uploaded after-cleanup telemetry photo.
                  </p>
                </div>
              )}
              {complaint.afterImage && (
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-emerald-950/80 backdrop-blur-sm text-white text-[11px] font-medium">
                  Cleared & Sanitized
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Verification Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Visual Pavement Clearance</span>
            <span className="font-mono font-bold text-emerald-700">96%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-[96%]" />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-semibold text-slate-700">Perimeter Litter Reduction</span>
            <span className="font-mono font-bold text-emerald-700">92%</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-[92%]" />
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Submitted By: <strong>{complaint.assignedTeam || 'Rapid Response #04'}</strong></span>
            <span>Current Status: <StatusBadge status={complaint.status} size="sm" /></span>
          </div>
        </div>

        {/* Decision Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            variant="outline"
            icon={RotateCcw}
            onClick={() => {
              onRequestRecheck(complaint.id);
              onClose();
            }}
          >
            Request Recheck / Resanitize
          </Button>

          <Button
            variant="primary"
            icon={CheckCircle2}
            onClick={() => {
              onApprove(complaint.id);
              onClose();
            }}
          >
            Approve Resolution & Close Issue
          </Button>
        </div>

      </div>
    </Modal>
  );
};
