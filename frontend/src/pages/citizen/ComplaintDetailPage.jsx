import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  User, 
  Truck,
  Image as ImageIcon
} from 'lucide-react';
import { ComplaintTimeline } from '../../components/complaints/ComplaintTimeline';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { apiService } from '../../services/api';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await apiService.getComplaintById(id);
        setComplaint(res.data);
      } catch (err) {
        setError(err.message || 'Complaint not found');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return <LoadingState message="Fetching real-time complaint telemetry..." />;
  }

  if (error || !complaint) {
    return (
      <ErrorState
        title="Complaint Not Found"
        description={`We could not locate reference record #${id}.`}
        onRetry={() => navigate('/citizen/complaints')}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/citizen/complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Complaints</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl">
                {complaint.id}
              </span>
              <StatusBadge priority={complaint.priority} size="sm" />
              <StatusBadge status={complaint.status} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              {complaint.title}
            </h1>
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Logged: {new Date(complaint.submittedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Assigned Crew: <strong className="text-slate-800">{complaint.assignedTeam}</strong></span>
            </div>
          </div>
        </div>

        {/* Location & Details summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 flex flex-col">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Location & Geotag
            </span>
            <p className="font-medium text-slate-800 flex items-center gap-1.5 pb-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{complaint.address || complaint.area}</span>
            </p>
            <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-200">
              {isLoaded && complaint.coordinates ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={complaint.coordinates}
                  zoom={15}
                  options={{ disableDefaultUI: true }}
                >
                  <Marker position={complaint.coordinates} />
                </GoogleMap>
              ) : (
                <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400 text-xs">
                  Map Unavailable
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Classified Issue
            </span>
            <p className="font-medium text-slate-800">
              {complaint.category} • Ward {complaint.area}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pt-2">
          {complaint.description}
        </p>
      </div>

      {/* TIMELINE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              End-to-End Operational Lifecycle
            </h3>
            <p className="text-xs text-slate-500">
              Live progression from initial citizen dispatch to verified resolution
            </p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full">
            6 Stage Pipeline
          </span>
        </div>

        <ComplaintTimeline
          timeline={complaint.timeline}
          currentStatus={complaint.status}
        />
      </div>

      {/* BEFORE & AFTER PHOTO EVIDENCE (Required Signature Feature) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Proof-of-Resolution Evidence
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side photographic validation before and after municipal sanitation
            </p>
          </div>
          {complaint.verification && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              AI Match: {complaint.verification.score}%
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          {/* Before Photo */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Before Cleanup (Initial Citizen Report)
            </span>
            <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              {complaint.beforeImage ? (
                <img
                  src={complaint.beforeImage}
                  alt="Before cleanup"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  No Before Image
                </div>
              )}
            </div>
          </div>

          {/* After Photo */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              After Cleanup (Resolution Proof)
            </span>
            <div className="relative h-60 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              {complaint.afterImage ? (
                <img
                  src={complaint.afterImage}
                  alt="After cleanup"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-500 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                  <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-sm font-semibold text-slate-700">Awaiting resolution proof.</span>
                  <p className="text-xs text-slate-400 mt-1">
                    Cleanup crew is on site. Telemetry confirmation photo will be updated automatically upon completion.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* AI Verification Summary */}
        {complaint.verification && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Verification Summary (Prototype Intelligence)</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              "{complaint.verification.summary}"
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
