import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Package,
  Layers
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { WASTE_TYPES } from '../../data/mockPickups';
import { useApp } from '../../context/AppContext';

export const WastePickupPage = () => {
  const navigate = useNavigate();
  const { createPickup, currentUser } = useApp();

  const [loading, setLoading] = useState(false);
  const [successPickup, setSuccessPickup] = useState(null);

  const [formData, setFormData] = useState({
    wasteType: 'Recyclable',
    estimatedQuantity: '4 Large Sacks (~20kg)',
    address: 'Flat 402, Green Valley Apartments, Civil Lines',
    area: 'Civil Lines',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    preferredTime: '10:00 AM - 12:00 PM',
    photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    requesterPhone: ''
  });

  useEffect(() => {
    if (currentUser?.phone) {
      setFormData(prev => ({ ...prev, requesterPhone: currentUser.phone }));
    }
  }, [currentUser]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createPickup({
        ...formData,
        requesterName: currentUser?.name || 'Aarav Sharma',
        requesterPhone: formData.requesterPhone || currentUser?.phone || '+91 98765 43210'
      });

      setSuccessPickup(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3 py-1 rounded-full">
          On-Demand Sanitation Logistics
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Request Waste Pickup
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Schedule doorstep pickup for bulk, recyclable, electronic, or segregated domestic waste streams.
        </p>
      </div>

      {!successPickup ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-6 sm:p-8 space-y-6">
          
          <div className="space-y-4">
            
            {/* Waste Type Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Waste Stream Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {WASTE_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, wasteType: type })}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                      formData.wasteType === type
                        ? 'border-primary bg-primary-light text-primary shadow-soft ring-2 ring-primary/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span>{type}</span>
                    <Layers className="w-3.5 h-3.5 opacity-50" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <Input
              label="Estimated Quantity / Volume"
              value={formData.estimatedQuantity}
              onChange={(e) => setFormData({ ...formData, estimatedQuantity: e.target.value })}
              placeholder="e.g. 3 Bags, 1 Old Fridge, 15kg cartons"
              icon={Package}
              required
            />

            {/* Address */}
            <Input
              label="Pickup Address (House/Street)"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Flat number, Street, Landmark"
              icon={MapPin}
              required
            />

              {/* Phone and Ward */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Phone Number"
                  value={formData.requesterPhone || ''}
                  onChange={(e) => setFormData({ ...formData, requesterPhone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  icon={CheckCircle2}
                  required
                />
  
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Ward / Area
                  </label>
                  <div className="relative">
                    <input
                      list="area-suggestions"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder="Type or select ward/area"
                      className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                      required
                    />
                    <datalist id="area-suggestions">
                      <option value="Civil Lines" />
                      <option value="Swaroop Nagar" />
                      <option value="Mall Road" />
                      <option value="Kakadeo" />
                      <option value="Govind Nagar" />
                      <option value="Shastri Nagar" />
                      <option value="Ashok Nagar" />
                    </datalist>
                  </div>
                </div>
              </div>

            {/* Date and Time Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Preferred Pickup Date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                icon={Calendar}
                required
              />

              <Select
                label="Preferred Time Slot"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                options={[
                  '08:00 AM - 10:00 AM',
                  '10:00 AM - 12:00 PM',
                  '01:00 PM - 03:00 PM',
                  '03:30 PM - 05:30 PM'
                ]}
                icon={Clock}
              />
            </div>

            {/* Photo Upload Area */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Optional Material Photo
              </label>
              
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-primary transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center gap-3">
                  <UploadCloud className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-600">
                    {formData.photo ? 'Photo attached (click to change)' : 'Upload a photo to help dispatch crew evaluate vehicle size'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/citizen')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Truck}
            >
              Submit Pickup Request
            </Button>
          </div>
        </form>
      ) : (
        /* Pickup Created Success State */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-8 sm:p-12 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto shadow-soft ring-8 ring-sky-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Pickup Scheduled
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Request Registered Successfully
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your pickup has been batched into the Dynamic Zone Fleet route algorithm.
            </p>
          </div>

          {/* Generated ID Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-sm mx-auto space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Generated Pickup ID
            </span>
            <div className="text-2xl font-mono font-extrabold text-primary">
              {successPickup.id || 'PK-2081'}
            </div>
            <div className="text-xs text-slate-600 pt-1">
              Status: <span className="font-semibold text-sky-700">{successPickup.status || 'Pickup Requested'}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Slot: {successPickup.preferredDate} ({successPickup.preferredTime})
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="primary"
              onClick={() => navigate('/citizen')}
            >
              Return to Citizen Dashboard
            </Button>
          </div>
        </div>
      )}

    </div>
  );
};
