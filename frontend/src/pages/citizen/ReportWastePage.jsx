import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';
import { 
  Camera, 
  UploadCloud, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Image as ImageIcon, 
  Crosshair, 
  Loader2,
  Check,
  FileText
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { AIAnalysisCard } from '../../components/ai/AIAnalysisCard';
import { COMPLAINT_CATEGORIES } from '../../data/mockComplaints';
import { apiService } from '../../services/api';
import { useApp } from '../../context/AppContext';

// High quality waste presets for instant testing
const SAMPLE_PRESETS = [
  {
    name: 'Overflowing Bin',
    category: 'Overflowing Bin',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    desc: 'Two municipal 1100L bins severely overflowing with food cartons and plastic bags onto walkway.'
  },
  {
    name: 'Roadside Litter',
    category: 'Roadside Garbage',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    desc: 'Scattered takeaway containers and drink bottles across pavement near intersection.'
  },
  {
    name: 'Illegal Dumping',
    category: 'Illegal Dumping',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    desc: 'Construction debris and discarded crates dumped beside residential park wall.'
  }
];

export const ReportWastePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createComplaint, addToast } = useApp();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(SAMPLE_PRESETS[0].url);
  const [isLocating, setIsLocating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    category: searchParams.get('category') || 'Overflowing Bin',
    area: searchParams.get('area') || 'Civil Lines',
    address: 'Opposite Metro Station Gate 2, Mall Road Junction',
    description: 'Two 1100L municipal bins overflowing onto pedestrian walkway. Food waste attracting stray animals and emitting strong odor.',
    lat: 26.4725,
    lng: 80.3412
  });

  // AI Analysis Output
  const [aiAnalysis, setAiAnalysis] = useState({
    detectedIssue: 'Overflowing Bin (High Density Organic & Plastic)',
    confidence: 94,
    priority: 'HIGH',
    suggestedAction: 'Schedule collection within 4 hours. Recommend deploying secondary 1100L bin.',
    materialBreakdown: { organic: '65%', recyclablePlastic: '25%', other: '10%' },
    isPrototype: true
  });

  // Photo Upload Simulation
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        addToast('Photo uploaded successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset) => {
    setPhotoPreview(preset.url);
    setFormData((prev) => ({
      ...prev,
      category: preset.category,
      description: preset.desc
    }));
    addToast(`Selected sample: ${preset.name}`, 'info');
  };

  // Simulate Geolocation Pinning
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setFormData((prev) => ({
            ...prev,
            address: 'GPS Verified Location',
            area: 'Detected Zone',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          addToast(`Current GPS coordinates acquired (${position.coords.latitude.toFixed(4)}°, ${position.coords.longitude.toFixed(4)}°)`, 'success');
        },
        (error) => {
          setIsLocating(false);
          addToast('Could not get your location. Please check permissions.', 'error');
        }
      );
    } else {
      setIsLocating(false);
      addToast('Geolocation is not supported by your browser.', 'error');
    }
  };

  // Trigger Simulated AI Vision Analysis
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await apiService.analyzeWasteImage(formData.category);
      setAiAnalysis(result.data);
    } catch (e) {
      console.warn('AI analysis fallback:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNextFromDetails = async () => {
    setCurrentStep(4);
    await runAIAnalysis();
  };

  // Final Submission
  const handleSubmit = async () => {
    setIsAnalyzing(true);
    try {
      const complaintRecord = await createComplaint({
        category: formData.category,
        address: formData.address,
        area: formData.area,
        description: formData.description,
        photoUrl: photoPreview,
        aiAnalysis: aiAnalysis,
        latitude: formData.lat,
        longitude: formData.lng
      });

      setSubmittedComplaint(complaintRecord);
      setCurrentStep(5);
    } catch (e) {
      addToast(e.message || 'Failed to submit report. Please retry.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step Breadcrumb Navigation
  const steps = [
    { number: 1, label: 'Photo' },
    { number: 2, label: 'Location' },
    { number: 3, label: 'Details' },
    { number: 4, label: 'AI Analysis' },
    { number: 5, label: 'Confirmation' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
          Autonomous Reporting Pipeline
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Report a Waste Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Follow the 5-step guided process. Instant computer vision telemetry verifies your report.
        </p>
      </div>

      {/* STEP PROGRESS INDICATOR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-soft p-4 sm:p-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-0" />
          
          {steps.map((st) => {
            const isDone = currentStep > st.number;
            const isCurrent = currentStep === st.number;

            return (
              <div key={st.number} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    isDone
                      ? 'bg-primary text-white shadow-soft ring-4 ring-eco-50'
                      : isCurrent
                      ? 'bg-secondary text-white shadow-soft ring-4 ring-emerald-100 scale-110'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : st.number}
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-medium hidden sm:block ${
                    isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: PHOTO UPLOAD */}
      {currentStep === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Step 1: Upload Waste Issue Photo
            </h3>
            <p className="text-xs text-slate-500">
              Upload a clear photo of the waste problem. Clear lighting helps the AI classifier accurately assess the issue.
            </p>
          </div>

          {/* Drag & Drop Area */}
          <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-primary transition-colors bg-slate-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <div className="w-14 h-14 rounded-2xl bg-eco-100 text-primary flex items-center justify-center shadow-soft">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to browse or drag & drop photo here
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supports PNG, JPG, WEBP (Max 10MB)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Presets for Demo Evaluation */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-600 block">
              Or pick an instant demo photo preset:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    photoPreview === preset.url
                      ? 'border-primary bg-eco-50 ring-2 ring-primary/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      Sample Image
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview */}
          {photoPreview && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Selected Photo Preview
              </span>
              <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={photoPreview}
                  alt="Waste Problem Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-white text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Ready for Multimodal Vision Analysis</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              disabled={!photoPreview}
              onClick={() => setCurrentStep(2)}
            >
              Proceed to Location
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: LOCATION */}
      {currentStep === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Step 2: Pin Location & Ward
            </h3>
            <p className="text-xs text-slate-500">
              Precise location enables automated route clustering for nearby sanitation trucks.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Specific Street Address / Landmark"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Near Metro Gate 2, GT Road"
                  icon={MapPin}
                  required
                />
              </div>

              {/* Simulated Current Location Button */}
              <Button
                variant="outline"
                icon={Crosshair}
                loading={isLocating}
                onClick={handleUseCurrentLocation}
                className="shrink-0"
              >
                Use Current Location
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Municipal Ward / Area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                options={[
                  'Civil Lines',
                  'Swaroop Nagar',
                  'Mall Road',
                  'Kakadeo',
                  'Govind Nagar',
                  'Shastri Nagar',
                  'Ashok Nagar'
                ]}
              />

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Telemetry Coordinates
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700">
                  Lat: 26.4725° N • Long: 80.3412° E (Zone 3)
                </span>
              </div>
            </div>

            {/* Google Maps Preview */}
            <div className="relative h-48 rounded-2xl bg-slate-950 overflow-hidden border border-slate-200">
              {isLoaded && !loadError ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: formData.lat, lng: formData.lng }}
                  zoom={15}
                  options={{ disableDefaultUI: true }}
                >
                  <OverlayView
                    position={{ lat: formData.lat, lng: formData.lng }}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10 pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-soft-lg ring-4 ring-emerald-500/40 animate-bounce">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm text-white whitespace-nowrap">
                        {formData.area} • Geotagged
                      </span>
                    </div>
                  </OverlayView>
                </GoogleMap>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                  {loadError ? 'Map loading error' : 'Loading Map...'}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => setCurrentStep(1)}
            >
              Back
            </Button>

            <Button
              variant="primary"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => setCurrentStep(3)}
            >
              Continue to Details
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: ISSUE DETAILS */}
      {currentStep === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              Step 3: Issue Classification & Details
            </h3>
            <p className="text-xs text-slate-500">
              Select the best-matching category. Our AI vision model will also double-check this in the next step.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition-all text-left ${
                      formData.category === cat
                        ? 'border-primary bg-primary-light text-primary shadow-soft ring-2 ring-primary/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Detailed Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the severity, duration, or any safety hazards..."
                className="w-full rounded-2xl border border-slate-200 p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              icon={ArrowLeft}
              onClick={() => setCurrentStep(2)}
            >
              Back
            </Button>

            <Button
              variant="primary"
              icon={Sparkles}
              iconPosition="right"
              onClick={handleNextFromDetails}
            >
              Run AI Vision Analysis
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: AI ANALYSIS */}
      {currentStep === 4 && (
        <div className="space-y-6">
          {isAnalyzing ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-eco-200 border-t-primary animate-spin mx-auto" />
              <h4 className="text-lg font-bold text-slate-900">
                Multimodal AI Processing in Progress...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Extracting pixel textures, assessing volume overflow percentage, and cross-referencing zone telemetry.
              </p>
            </div>
          ) : (
            <>
              {/* Mandatory AI Waste Analysis Card */}
              <AIAnalysisCard analysis={aiAnalysis} />

              {/* Action review row */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-slate-900">
                    Ready to Dispatch to Municipal Command?
                  </h4>
                  <p className="text-xs text-slate-500">
                    Your report will be immediately flagged for Rapid Response #04.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    icon={ArrowLeft}
                    onClick={() => setCurrentStep(3)}
                  >
                    Edit Details
                  </Button>

                  <Button
                    variant="primary"
                    icon={CheckCircle2}
                    iconPosition="right"
                    onClick={handleSubmit}
                  >
                    Confirm & Submit Complaint
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* STEP 5: SUBMISSION SUCCESS STATE */}
      {currentStep === 5 && submittedComplaint && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-8 sm:p-12 text-center space-y-6 animate-in fade-in duration-300">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Verified Submission
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Complaint Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your report has been logged into the Nexus Clean central dispatch system. An operational crew has been scheduled.
            </p>
          </div>

          {/* Generated ID Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Complaint Tracking Reference ID
            </span>
            <div className="text-2xl font-mono font-extrabold text-primary">
              {submittedComplaint.id || 'NC-1042'}
            </div>
            <p className="text-[11px] text-slate-500">
              Category: {submittedComplaint.category} • Ward: {submittedComplaint.area}
            </p>
          </div>

          {/* Navigation Action Buttons Required in Prompt */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              icon={FileText}
              onClick={() => navigate(`/citizen/complaints/${submittedComplaint.id || 'NC-1042'}`)}
            >
              Track Complaint Lifecycle
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/citizen')}
            >
              Back to Dashboard
            </Button>
          </div>

        </div>
      )}

    </div>
  );
};
