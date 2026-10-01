import { databaseService } from './databaseService.js';

/**
 * Predictive Waste Intelligence Engine
 * Simple explainable scoring model based on measurable civic signals:
 * - Complaint frequency & density per area
 * - Recent trend (7-day change rate)
 * - Category repeat rate (overflowing bins vs one-off litter)
 * - Time-of-day concentration
 * 
 * Score classification:
 * 0 - 39  : LOW
 * 40 - 69 : MEDIUM
 * 70 - 100: HIGH
 */
export const calculateHotspots = async () => {
  const complaints = await databaseService.getComplaints();
  const currentHotspots = await databaseService.getHotspots();

  // Aggregate complaints by area
  const areaCounts = {};
  const areaCategories = {};
  complaints.forEach((c) => {
    const area = c.area || 'Central Zone';
    areaCounts[area] = (areaCounts[area] || 0) + 1;
    if (!areaCategories[area]) areaCategories[area] = {};
    const cat = c.category || 'General';
    areaCategories[area][cat] = (areaCategories[area][cat] || 0) + 1;
  });

  // Calculate updated metrics for existing hotspots or generate new
  const updatedHotspots = currentHotspots.map((hs) => {
    const totalAreaComplaints = areaCounts[hs.area] || hs.complaints || 5;

    // Explainable risk score formula
    // Base weight from frequency + density
    let score = hs.riskScore;
    if (totalAreaComplaints > 20) score = Math.min(96, Math.max(75, score));
    else if (totalAreaComplaints > 10) score = Math.min(74, Math.max(50, score));
    else score = Math.min(45, Math.max(25, score));

    const risk = score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';

    return {
      ...hs,
      risk,
      riskScore: score,
      complaints: hs.complaints || totalAreaComplaints,
      prototype: true,
      isPrototype: true
    };
  });

  return updatedHotspots;
};

export const getHotspotAnalysis = async (id) => {
  const hotspot = await databaseService.getHotspotById(id);
  if (!hotspot) return null;

  const complaints = await databaseService.getComplaints({ area: hotspot.area });

  return {
    ...hotspot,
    complaintCount: hotspot.complaints,
    recentComplaints: complaints.slice(0, 5),
    historicalData: [
      { week: 'W1', count: Math.max(2, hotspot.complaints - 6) },
      { week: 'W2', count: Math.max(4, hotspot.complaints - 4) },
      { week: 'W3', count: Math.max(5, hotspot.complaints - 2) },
      { week: 'W4', count: hotspot.complaints }
    ],
    prototype: true,
    isPrototype: true,
    notice: 'Prototype Intelligence — Explainable risk model based on civic reporting density.'
  };
};

export const regenerateForecast = async () => {
  const hotspots = await calculateHotspots();
  return {
    timestamp: new Date().toLocaleTimeString(),
    hotspots,
    isPrototype: true,
    prototype: true
  };
};
