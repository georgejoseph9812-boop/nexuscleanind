import { databaseService } from './databaseService.js';

export const getSmartRouteRecommendation = (pickups = []) => {
  const activePickups = pickups.filter((p) => p.status !== 'Completed' && p.status !== 'Cancelled');
  
  const sequence = [
    {
      step: 1,
      stopId: 'Stop A',
      pickupId: activePickups[0]?.id || 'PK-2081',
      area: activePickups[0]?.area || 'Civil Lines',
      location: activePickups[0]?.address || 'Flat 402, Green Valley Apts',
      type: activePickups[0]?.wasteType || 'E-Waste',
      timeWindow: '10:00 AM - 10:30 AM',
      notes: 'Fragile electronic cargo'
    },
    {
      step: 2,
      stopId: 'Stop B',
      pickupId: activePickups[2]?.id || 'PK-2083',
      area: activePickups[2]?.area || 'Mall Road',
      location: activePickups[2]?.address || 'City Convention Ground',
      type: activePickups[2]?.wasteType || 'Recyclable (18 Bags)',
      timeWindow: '10:50 AM - 11:30 AM',
      notes: 'High volume bulk clearance'
    },
    {
      step: 3,
      stopId: 'Stop C',
      pickupId: activePickups[1]?.id || 'PK-2082',
      area: activePickups[1]?.area || 'Swaroop Nagar',
      location: activePickups[1]?.address || 'Sector 3, Block B',
      type: activePickups[1]?.wasteType || 'Bulk Waste (Furniture)',
      timeWindow: '11:50 AM - 12:20 PM',
      notes: 'Requires 2 loaders'
    },
    {
      step: 4,
      stopId: 'Stop D',
      pickupId: activePickups[3]?.id || 'PK-2084',
      area: activePickups[3]?.area || 'Kakadeo',
      location: activePickups[3]?.address || 'Lane 7, House 24',
      type: activePickups[3]?.wasteType || 'Dry Garden Waste',
      timeWindow: '12:45 PM - 01:15 PM',
      notes: 'Drop off at Composting Station 2'
    }
  ];

  return {
    zone: 'Zone 3 (Central & North)',
    title: 'Optimized Dynamic Route',
    totalPickups: sequence.length,
    requestCount: sequence.length,
    estimatedDistance: '14.2 km',
    estimatedDuration: '2 hrs 45 mins',
    fuelSaved: '3.2 Liters (18% reduction)',
    sequence,
    recommendedSequence: sequence.map((s) => s.stopId),
    prototype: true,
    isPrototype: true,
    aiNotes: 'Prototype Intelligence: Sequence minimizes peak hour congestion along GT Road and groups bulk dry materials prior to final disposal depot.'
  };
};
