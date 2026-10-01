import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Configuration for geographic hotspot detection
const HOTSPOT_CONFIG = {
  RADIUS_KM: 0.5, // 500 meters
  COMPLAINT_THRESHOLD: 3
};

// Haversine formula for distance calculation
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
import { generateComplaintId, generatePickupId, generateUserId } from '../utils/idGenerator.js';

// Preloaded realistic seed data matching schema.sql and frontend mock data
const initialUsers = [
  {
    id: 'USR-CITIZEN-01',
    name: 'Aarav Sharma',
    email: 'citizen@nexusclean.org',
    password_hash: bcrypt.hashSync('demo123', 10),
    role: 'citizen',
    location: 'Civil Lines, Kanpur',
    area: 'Civil Lines',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    title: 'Civic Ambassador',
    department: 'Community Action',
    jurisdiction: 'Zone 3',
    created_at: '2025-05-10T10:00:00Z',
    updated_at: '2026-09-29T10:00:00Z'
  },
  {
    id: 'USR-ADMIN-01',
    name: 'Officer Sunita Verma',
    email: 'admin@nexusclean.org',
    password_hash: bcrypt.hashSync('demo123', 10),
    role: 'admin',
    location: 'Municipal HQ, Kanpur',
    area: 'Civil Lines',
    phone: '+91 94150 11223',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    title: 'Chief Sanitation & Predictive Operations Director',
    department: 'Municipal Smart Waste Directorate',
    jurisdiction: 'Zone 3 & Central Corridor',
    badgeNumber: 'MCK-9921',
    accessLevel: 'Executive Administrator',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2026-09-29T10:00:00Z'
  },
  {
    id: 'USR-COLLECTOR-01',
    name: 'Ramesh Yadav',
    email: 'collector@nexusclean.org',
    password_hash: bcrypt.hashSync('demo123', 10),
    role: 'collector',
    location: 'Dispatch Depot 4',
    area: 'Zone 3',
    phone: '+91 98390 99887',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    title: 'Field Operations Lead',
    department: 'Rapid Response Unit #04',
    jurisdiction: 'Zone 3',
    created_at: '2025-03-01T10:00:00Z',
    updated_at: '2026-09-29T10:00:00Z'
  }
];

const initialEcoScores = {
  'USR-CITIZEN-01': {
    total: 78,
    max: 100,
    level: 'Eco Guardian (Tier II)',
    monthlyImprovement: '+18%',
    breakdown: [
      { category: 'Waste Reporting', points: 20, max: 25, description: 'Active & verified issue logging' },
      { category: 'Proper Segregation', points: 25, max: 30, description: 'Consistent door-to-door dry/wet sorting' },
      { category: 'Community Participation', points: 18, max: 25, description: 'Peer validations & neighborhood cleanups' },
      { category: 'Awareness Activities', points: 15, max: 20, description: 'Waste sorting quizzes & guides completed' }
    ],
    achievements: [
      { id: 'ach-1', title: 'First Reporter', description: 'Logged your first verified municipal waste issue', icon: 'Flag', unlocked: true, date: 'May 2025' },
      { id: 'ach-2', title: 'Segregation Starter', description: 'Completed 10 consecutive door-to-door sorted pickups', icon: 'CheckCircle2', unlocked: true, date: 'Jun 2025' },
      { id: 'ach-3', title: 'Community Champion', description: 'Helped reduce local hotspot complaints by 15%+', icon: 'Award', unlocked: true, date: 'Aug 2025' },
      { id: 'ach-4', title: 'Zero Contamination', description: 'Maintain 100% clean recyclable sorting for 30 days', icon: 'ShieldCheck', unlocked: false, progress: 65 },
      { id: 'ach-5', title: 'Hotspot Spotter', description: 'Reported an issue that led to proactive route deployment', icon: 'Zap', unlocked: true, date: 'Sep 2025' }
    ]
  }
};

const initialComplaints = [
  {
    id: 'NC-1042',
    userId: 'USR-CITIZEN-01',
    title: 'Severe Commercial Bin Overflow',
    category: 'Overflowing Bin',
    description: 'Two 1100L municipal containers overflowing onto pedestrian walkway. Food waste attracting stray animals and creating foul odor.',
    address: 'Opposite Metro Station Gate 2, Civil Lines',
    area: 'Civil Lines',
    coordinates: { lat: 26.4725, lng: 80.3412 },
    priority: 'High',
    status: 'Resolution Submitted',
    submittedAt: '2026-09-28T09:15:00Z',
    assignedTeam: 'Rapid Response Unit #04',
    beforeImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=800&q=80',
    aiAnalysis: {
      detectedIssue: 'Overflowing Bin (High Density Organic & Plastic)',
      confidence: 94,
      priority: 'HIGH',
      suggestedAction: 'Schedule emergency collection within 4 hours. Increase evening bin clearance frequency.',
      materialBreakdown: { organic: '65%', recyclablePlastic: '25%', other: '10%' },
      isPrototype: true
    },
    verification: {
      status: 'Pending Admin Approval',
      score: 92,
      summary: 'Resolution appears successful. 92% visual clearance of pavement and sanitized perimeter detected by AI model comparison.',
      submittedByTeam: 'Foreman R. Sharma',
      submittedAt: '2026-09-29T14:30:00Z'
    },
    timeline: [
      { step: 1, title: 'Complaint Submitted', time: 'Sep 28, 09:15 AM', completed: true, actor: 'Citizen (You)' },
      { step: 2, title: 'Admin Reviewed', time: 'Sep 28, 09:40 AM', completed: true, actor: 'Central Dispatch' },
      { step: 3, title: 'Collection Team Assigned', time: 'Sep 28, 10:15 AM', completed: true, actor: 'Rapid Response #04' },
      { step: 4, title: 'Cleanup In Progress', time: 'Sep 29, 11:00 AM', completed: true, actor: 'Field Crew #04' },
      { step: 5, title: 'Resolution Verification', time: 'Sep 29, 02:30 PM', completed: true, current: true, actor: 'AI & Admin Approval' },
      { step: 6, title: 'Resolved', time: 'Pending Approval', completed: false, actor: 'Nexus Clean System' }
    ]
  },
  {
    id: 'NC-1043',
    userId: 'USR-CITIZEN-01',
    title: 'Illegal Dump Site on Green Belt',
    category: 'Illegal Dumping',
    description: 'Mixed debris, discarded packaging crates, and broken glass dumped near the residential park border.',
    address: 'Block C Sector 4, Swaroop Nagar',
    area: 'Swaroop Nagar',
    coordinates: { lat: 26.4812, lng: 80.3315 },
    priority: 'High',
    status: 'In Progress',
    submittedAt: '2026-09-29T08:00:00Z',
    assignedTeam: 'Zone 2 Heavy Duty Truck #11',
    beforeImage: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    afterImage: null,
    aiAnalysis: {
      detectedIssue: 'Illegal Dumping (Construction & Dry Waste)',
      confidence: 89,
      priority: 'HIGH',
      suggestedAction: 'Deploy heavy loader truck. Notify municipal zoning enforcement.',
      materialBreakdown: { packaging: '40%', rubble: '35%', nonRecyclable: '25%' },
      isPrototype: true
    },
    verification: null,
    timeline: [
      { step: 1, title: 'Complaint Submitted', time: 'Sep 29, 08:00 AM', completed: true, actor: 'Citizen Verified' },
      { step: 2, title: 'Admin Reviewed', time: 'Sep 29, 08:30 AM', completed: true, actor: 'Supervisor Gupta' },
      { step: 3, title: 'Collection Team Assigned', time: 'Sep 29, 09:15 AM', completed: true, actor: 'Zone 2 Fleet' },
      { step: 4, title: 'Cleanup In Progress', time: 'Sep 29, 11:45 AM', completed: true, current: true, actor: 'Heavy Loader Unit' },
      { step: 5, title: 'Resolution Verification', time: 'Estimated 05:00 PM', completed: false, actor: 'AI Verification' },
      { step: 6, title: 'Resolved', time: 'Pending', completed: false, actor: 'System' }
    ]
  },
  {
    id: 'NC-1044',
    userId: 'USR-CITIZEN-01',
    title: 'Roadside Littering Along Market Lane',
    category: 'Roadside Garbage',
    description: 'Single-use cups, paper food wrappers, and drink cans scattered along the 150m market walkway.',
    address: 'Near Central Book Depot, Mall Road',
    area: 'Mall Road',
    coordinates: { lat: 26.465, lng: 80.352 },
    priority: 'Medium',
    status: 'Pending',
    submittedAt: '2026-09-29T10:20:00Z',
    assignedTeam: 'Pending Dispatch',
    beforeImage: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80',
    afterImage: null,
    aiAnalysis: {
      detectedIssue: 'Roadside Garbage (Commercial Food Packaging)',
      confidence: 91,
      priority: 'MEDIUM',
      suggestedAction: 'Assign street sweeping crew during off-peak hours (2 PM - 4 PM).',
      materialBreakdown: { paperCardboard: '50%', plasticBeverage: '40%', other: '10%' },
      isPrototype: true
    },
    verification: null,
    timeline: [
      { step: 1, title: 'Complaint Submitted', time: 'Sep 29, 10:20 AM', completed: true, current: true, actor: 'Citizen' },
      { step: 2, title: 'Admin Reviewed', time: 'Awaiting Review', completed: false, actor: 'Dispatch' },
      { step: 3, title: 'Collection Team Assigned', time: '--', completed: false, actor: '--' },
      { step: 4, title: 'Cleanup In Progress', time: '--', completed: false, actor: '--' },
      { step: 5, title: 'Resolution Verification', time: '--', completed: false, actor: '--' },
      { step: 6, title: 'Resolved', time: '--', completed: false, actor: '--' }
    ]
  },
  {
    id: 'NC-1045',
    userId: 'USR-CITIZEN-01',
    title: 'Missed Morning Door-to-Door Collection',
    category: 'Missed Collection',
    description: 'Compactor van skipped Lane 4 and 5; residents left bins outside creating hazard.',
    address: 'Lane 5, Shastri Nagar',
    area: 'Shastri Nagar',
    coordinates: { lat: 26.459, lng: 80.32 },
    priority: 'Low',
    status: 'Assigned',
    submittedAt: '2026-09-29T11:45:00Z',
    assignedTeam: 'Zone 3 Van #08',
    beforeImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    afterImage: null,
    aiAnalysis: {
      detectedIssue: 'Missed Municipal Route Window',
      confidence: 95,
      priority: 'LOW',
      suggestedAction: 'Reroute nearest active auxiliary tipper van.',
      isPrototype: true
    },
    verification: null,
    timeline: [
      { step: 1, title: 'Complaint Submitted', time: 'Sep 29, 11:45 AM', completed: true, actor: 'Citizen' },
      { step: 2, title: 'Admin Reviewed', time: 'Sep 29, 12:10 PM', completed: true, actor: 'Dispatcher' },
      { step: 3, title: 'Collection Team Assigned', time: 'Sep 29, 12:30 PM', completed: true, current: true, actor: 'Zone 3 Van #08' },
      { step: 4, title: 'Cleanup In Progress', time: '--', completed: false, actor: '--' },
      { step: 5, title: 'Resolution Verification', time: '--', completed: false, actor: '--' },
      { step: 6, title: 'Resolved', time: '--', completed: false, actor: '--' }
    ]
  }
];

const initialPickups = [
  {
    id: 'PK-2081',
    userId: 'USR-CITIZEN-01',
    requesterName: 'Dr. Arvind Saxena',
    requesterPhone: '+91 98390 12345',
    wasteType: 'E-Waste',
    estimatedQuantity: '2 Broken Laptops, 1 Printer, 4 Battery Packs (~12kg)',
    address: 'Flat 402, Green Valley Apartments, Civil Lines',
    area: 'Civil Lines',
    zone: 'Zone 3',
    preferredDate: '2026-10-02',
    preferredTime: '10:00 AM - 12:00 PM',
    photo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    status: 'Pickup Requested',
    priority: 'High',
    assignedCrew: 'E-Waste Recovery Unit #02',
    createdAt: '2026-09-29T09:30:00Z'
  },
  {
    id: 'PK-2082',
    userId: 'USR-CITIZEN-01',
    requesterName: 'Pooja Malhotra',
    requesterPhone: '+91 94150 56789',
    wasteType: 'Bulk Waste',
    estimatedQuantity: '1 Discarded Wooden Dining Table, 4 Chairs',
    address: 'B-12, Sector 3, Swaroop Nagar',
    area: 'Swaroop Nagar',
    zone: 'Zone 3',
    preferredDate: '2026-10-02',
    preferredTime: '01:00 PM - 03:00 PM',
    photo: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    status: 'Assigned',
    priority: 'Medium',
    assignedCrew: 'Flatbed Truck #07',
    createdAt: '2026-09-29T10:15:00Z'
  },
  {
    id: 'PK-2083',
    userId: 'USR-CITIZEN-01',
    requesterName: 'Community Hall Committee',
    requesterPhone: '+91 98399 77881',
    wasteType: 'Recyclable',
    estimatedQuantity: '18 Large Bags of Plastic Bottles & Cardboard from College Fest',
    address: 'City Convention Ground, Mall Road',
    area: 'Mall Road',
    zone: 'Zone 3',
    preferredDate: '2026-10-02',
    preferredTime: '03:30 PM - 05:30 PM',
    photo: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    status: 'Assigned',
    priority: 'High',
    assignedCrew: 'Compactor Van #03',
    createdAt: '2026-09-29T11:00:00Z'
  },
  {
    id: 'PK-2084',
    userId: 'USR-CITIZEN-01',
    requesterName: 'Rakesh Verma',
    requesterPhone: '+91 97931 22334',
    wasteType: 'Dry',
    estimatedQuantity: 'Garden trimmings and pruned tree branches (6 sacks)',
    address: 'House 24, Lane 7, Kakadeo',
    area: 'Kakadeo',
    zone: 'Zone 3',
    preferredDate: '2026-10-03',
    preferredTime: '09:00 AM - 11:00 AM',
    photo: null,
    status: 'Pickup Requested',
    priority: 'Low',
    assignedCrew: 'Bio-Compost Van #01',
    createdAt: '2026-09-29T13:40:00Z'
  }
];

const initialHotspots = [
  {
    id: 'HS-01',
    name: 'Civil Lines Commercial Hub',
    area: 'Civil Lines',
    risk: 'HIGH',
    riskScore: 91,
    complaints: 23,
    trend: '+28%',
    trendDirection: 'up',
    primaryIssue: 'Overflowing bins',
    secondaryIssue: 'Commercial food waste',
    coordinates: { x: 38, y: 32 },
    peakHours: '5:00 PM – 8:30 PM',
    aiRecommendation: 'Increase evening collection frequency between 5 PM and 8 PM. Deploy two supplementary 1100L heavy-duty containers.',
    deepAnalysis: {
      possibleCause: 'Surge in evening street food stalls and student foot traffic combined with a 12-hour gap between municipal rounds.',
      confidence: '94% (Prototype Intelligence)',
      recurringCycle: 'Every Friday & Saturday evening',
      recommendedIntervention: 'Dynamic routing dispatch: reroute Truck #04 for an automated 6:30 PM clearance sweep.',
      preventedCostSavings: 'Estimated 3.4 hrs field crew overtime avoided weekly.'
    },
    prototype: true
  },
  {
    id: 'HS-02',
    name: 'Swaroop Nagar Residential Perimeter',
    area: 'Swaroop Nagar',
    risk: 'MEDIUM',
    riskScore: 68,
    complaints: 11,
    trend: '-8%',
    trendDirection: 'down',
    primaryIssue: 'Illegal dumping',
    secondaryIssue: 'Construction debris',
    coordinates: { x: 62, y: 25 },
    peakHours: '9:00 PM – 11:30 PM',
    aiRecommendation: 'Deploy mobile surveillance unit and install solar CCTV deterrent signage at Block C perimeter.',
    deepAnalysis: {
      possibleCause: 'Unlit vacant plot boundary attracting unauthorized nighttime renovation contractors dumping debris.',
      confidence: '88% (Prototype Intelligence)',
      recurringCycle: 'Bi-weekly mid-month',
      recommendedIntervention: 'Install perimeter barrier fencing and schedule neighborhood vigilance inspection.',
      preventedCostSavings: 'Prevents repeated heavy JCB excavator hiring costs.'
    },
    prototype: true
  },
  {
    id: 'HS-03',
    name: 'Mall Road Shopping Promenade',
    area: 'Mall Road',
    risk: 'HIGH',
    riskScore: 86,
    complaints: 19,
    trend: '+14%',
    trendDirection: 'up',
    primaryIssue: 'Roadside littering',
    secondaryIssue: 'Single-use beverage plastic',
    coordinates: { x: 50, y: 65 },
    peakHours: '3:30 PM – 7:00 PM',
    aiRecommendation: 'Install dual-stream smart sorting bins every 50 meters and engage shopkeeper association in morning cleanup pledge.',
    deepAnalysis: {
      possibleCause: 'High pedestrian density with inadequate bin volume; current dustbins fill up within 90 minutes on weekends.',
      confidence: '91% (Prototype Intelligence)',
      recurringCycle: 'Weekends & holiday afternoons',
      recommendedIntervention: 'Install solar compactor bins that notify sanitation control room at 80% capacity.',
      preventedCostSavings: 'Reduces daily manual roadside sweeping labor hours by 40%.'
    },
    prototype: true
  },
  {
    id: 'HS-04',
    name: 'Kakadeo Coaching Corridor',
    area: 'Kakadeo',
    risk: 'LOW',
    riskScore: 34,
    complaints: 5,
    trend: '-22%',
    trendDirection: 'down',
    primaryIssue: 'Missed morning collection',
    secondaryIssue: 'Pamphlet & paper waste',
    coordinates: { x: 22, y: 70 },
    peakHours: '8:00 AM – 10:00 AM',
    aiRecommendation: 'Maintain current morning door-to-door schedule. Recent route adjustment successfully reduced complaints by 22%.',
    deepAnalysis: {
      possibleCause: 'Previous driver navigation bottlenecks on narrow alleyways resolved with GPS micro-van routing.',
      confidence: '85% (Prototype Intelligence)',
      recurringCycle: 'Historically Mondays only',
      recommendedIntervention: 'Routine weekly telemetry monitoring; no emergency intervention needed.',
      preventedCostSavings: 'Achieved sustained 92% citizen satisfaction in Sector 3.'
    },
    prototype: true
  },
  {
    id: 'HS-05',
    name: 'Govind Nagar Industrial Fringe',
    area: 'Govind Nagar',
    risk: 'MEDIUM',
    riskScore: 72,
    complaints: 14,
    trend: '+6%',
    trendDirection: 'up',
    primaryIssue: 'Improper Segregation',
    secondaryIssue: 'Industrial packaging foam',
    coordinates: { x: 78, y: 80 },
    peakHours: '1:00 PM – 3:00 PM',
    aiRecommendation: 'Conduct targeted compliance audit of local small-scale workshop packaging disposal.',
    deepAnalysis: {
      possibleCause: 'Packaging waste mixed into municipal compactor due to lack of separate recyclable pickup channel.',
      confidence: '89% (Prototype Intelligence)',
      recurringCycle: 'Post-shipment weekdays',
      recommendedIntervention: 'Provide dedicated commercial cardboard baling service pickup on Tuesday and Thursday.',
      preventedCostSavings: 'Prevents mixed contamination at central recycling MRF.'
    },
    prototype: true
  }
];

const initialAwareness = [
  {
    id: 'aw-wet',
    category: 'Wet Waste',
    color: 'emerald',
    binColor: 'Green Bin',
    examples: ['Vegetable & fruit peels', 'Leftover cooked food', 'Tea leaves & coffee grounds', 'Eggshells & bones', 'Garden leaves'],
    disposalGuide: 'Store in breathable containers. Drain excess liquid. Do not line green bins with plastic bags.',
    environmentalImpact: 'Processed via community aerobic composting or anaerobic digestion into bio-gas fuel.'
  },
  {
    id: 'aw-dry',
    category: 'Dry Waste',
    color: 'sky',
    binColor: 'Blue Bin',
    examples: ['Cardboard & paper packaging', 'Clean plastic wrappers', 'Metal foil & tin cans', 'Rubber & leather scraps', 'Textile clippings'],
    disposalGuide: 'Keep clean and dry. Rinse food residues to prevent microbial contamination and pest infestation.',
    environmentalImpact: 'Mechanically segregated at Material Recovery Facilities (MRF) and baled for industrial reuse.'
  },
  {
    id: 'aw-recyclable',
    category: 'Recyclable Waste',
    color: 'teal',
    binColor: 'Teal / White Bin',
    examples: ['PET bottles', 'Aluminum drink cans', 'Glass jars', 'HDPE shampoo containers', 'Clean corrugated cartons'],
    disposalGuide: 'Flatten bottles and cartons to conserve space. Remove plastic caps where required.',
    environmentalImpact: 'Recycled directly into new manufacturing feedstocks, slashing raw resource extraction.'
  },
  {
    id: 'aw-ewaste',
    category: 'E-Waste',
    color: 'purple',
    binColor: 'Designated Depot Box',
    examples: ['Smartphones & laptops', 'Power adapters & cables', 'Broken LED bulbs', 'Circuit boards', 'Small kitchen appliances'],
    disposalGuide: 'Book an on-demand specialized pickup through Nexus Clean. Never throw in household rubbish.',
    environmentalImpact: 'Precious metals (copper, gold, silver) extracted in certified eco-dismantling plants.'
  },
  {
    id: 'aw-hazardous',
    category: 'Hazardous Waste',
    color: 'rose',
    binColor: 'Red Bin / Sealed Pack',
    examples: ['Medical syringes & bandages', 'Paint thinners & solvent cans', 'Pesticide containers', 'Expired medicines', 'Chemical bottles'],
    disposalGuide: 'Keep tightly sealed in heavy-duty containment bags clearly marked HAZARD.',
    environmentalImpact: 'Incinerated at regulated high temperatures or placed in engineered secure hazardous landfills.'
  }
];

const initialQuizItems = [
  {
    id: 'item-1',
    name: 'Plastic Water Bottle',
    category: 'Recyclable',
    icon: 'Milk',
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=400&q=80',
    fact: 'Plastic PET bottles can take up to 450 years to decompose. Empty and crush before recycling!',
    acceptedIn: ['Recyclable', 'Dry']
  },
  {
    id: 'item-2',
    name: 'Banana Peel',
    category: 'Wet',
    icon: 'Apple',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80',
    fact: 'Banana peels decompose in 2-5 weeks and enrich garden soil with potassium and nitrogen when composted.',
    acceptedIn: ['Wet']
  },
  {
    id: 'item-3',
    name: 'Lithium AA Battery',
    category: 'Hazardous',
    icon: 'BatteryCharging',
    image: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&q=80',
    fact: 'Batteries contain cadmium, lead, and acid that contaminate groundwater if dumped in ordinary landfills.',
    acceptedIn: ['Hazardous', 'E-Waste']
  },
  {
    id: 'item-4',
    name: 'Old Newspaper & Paper Bags',
    category: 'Recyclable',
    icon: 'Newspaper',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80',
    fact: 'Recycling 1 ton of newspaper saves 17 mature trees and 7,000 gallons of water.',
    acceptedIn: ['Recyclable', 'Dry']
  },
  {
    id: 'item-5',
    name: 'Empty Glass Beverage Bottle',
    category: 'Recyclable',
    icon: 'Wine',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
    fact: 'Glass is 100% recyclable indefinitely without any loss in purity or structural quality.',
    acceptedIn: ['Recyclable', 'Dry']
  },
  {
    id: 'item-6',
    name: 'Leftover Cooked Food Waste',
    category: 'Wet',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    fact: 'Municipal bio-methanation plants convert segregated kitchen food waste into clean CNG fuel and compost.',
    acceptedIn: ['Wet']
  },
  {
    id: 'item-7',
    name: 'Aerosol Deodorant Spray Can',
    category: 'Hazardous',
    icon: 'AlertTriangle',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    fact: 'Pressurized propellant containers can explode under compactor pressure; dispose through chemical collection channels.',
    acceptedIn: ['Hazardous']
  },
  {
    id: 'item-8',
    name: 'Corrugated Cardboard Box',
    category: 'Dry',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80',
    fact: 'Flattening cardboard boxes reduces collection vehicle volume by 70%, preventing unnecessary diesel emissions.',
    acceptedIn: ['Dry', 'Recyclable']
  }
];

const initialNotifications = [
  {
    id: 'NOTIF-01',
    userId: 'USR-CITIZEN-01',
    title: 'Resolution Proof Submitted',
    message: 'Resolution proof submitted for Complaint #NC-1042.',
    type: 'info',
    read: false,
    link: '/citizen/complaints/NC-1042',
    createdAt: '2026-09-29T14:30:00Z'
  },
  {
    id: 'NOTIF-02',
    userId: 'USR-CITIZEN-01',
    title: 'Eco Score Points Awarded',
    message: 'You earned +10 Eco Points for reporting verified waste issue.',
    type: 'success',
    read: false,
    link: '/citizen/eco-score',
    createdAt: '2026-09-29T11:00:00Z'
  },
  {
    id: 'NOTIF-03',
    userId: 'USR-ADMIN-01',
    title: 'High Risk Hotspot Alert',
    message: 'Hotspot HS-01 (Civil Lines) reached 91 Risk Score. Action recommended.',
    type: 'warning',
    read: false,
    link: '/admin/predictive',
    createdAt: '2026-09-29T09:00:00Z'
  }
];

class DatabaseService {
  constructor() {
    this.users = [...initialUsers];
    this.complaints = [...initialComplaints];
    this.pickups = [...initialPickups];
    this.hotspots = [...initialHotspots];
    this.ecoScores = { ...initialEcoScores };
    this.ecoActivities = [
      { id: 1, userId: 'USR-CITIZEN-01', activityType: 'waste_reporting', points: 10, description: 'Verified report NC-1042', createdAt: '2026-09-28T09:15:00Z' },
      { id: 2, userId: 'USR-CITIZEN-01', activityType: 'proper_segregation', points: 15, description: '100% clean dry/wet collection', createdAt: '2026-09-27T08:00:00Z' },
      { id: 3, userId: 'USR-CITIZEN-01', activityType: 'awareness_quiz', points: 5, description: 'Completed Waste Sorting Quiz', createdAt: '2026-09-26T16:20:00Z' }
    ];
    this.awareness = [...initialAwareness];
    this.quizItems = [...initialQuizItems];
    this.notifications = [...initialNotifications];
  }

  // --------------------------------------------------------------------------
  // USERS
  // --------------------------------------------------------------------------
  async findUserByEmail(email) {
    const demoUser = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (demoUser && (email.toLowerCase() === 'citizen@nexusclean.org' || email.toLowerCase() === 'admin@nexusclean.org')) {
      return demoUser;
    }

    if (db.isConfigured()) {
      try {
        const res = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
        if (res.rows[0]) return res.rows[0];
      } catch (e) {
        console.warn('[DatabaseService] PostgreSQL findUserByEmail fallback:', e.message);
      }
    }
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('[DatabaseService] Supabase findUserByEmail fallback:', e.message);
      }
    }
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findUserById(id) {
    const demoUser = this.users.find((u) => u.id === id);
    if (demoUser && (id === 'USR-CITIZEN-01' || id === 'USR-ADMIN-01')) {
      return demoUser;
    }

    if (db.isConfigured()) {
      try {
        const res = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        if (res.rows[0]) return res.rows[0];
      } catch (e) {
        console.warn('[DatabaseService] PostgreSQL findUserById fallback:', e.message);
      }
    }
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('[DatabaseService] Supabase findUserById fallback:', e.message);
      }
    }
    return this.users.find((u) => u.id === id) || null;
  }

  async createUser(userData) {
    const newUser = {
      id: userData.id || generateUserId(userData.role || 'citizen'),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password_hash: userData.password_hash,
      role: userData.role || 'citizen',
      location: userData.location || 'Civil Lines, Kanpur',
      area: userData.area || 'Civil Lines',
      phone: userData.phone || '+91 98765 00000',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (db.isConfigured()) {
      try {
        const queryText = `
          INSERT INTO users (id, name, email, password_hash, role, location, area, phone, avatar, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *
        `;
        const params = [
          newUser.id, newUser.name, newUser.email, newUser.password_hash,
          newUser.role, newUser.location, newUser.area, newUser.phone,
          newUser.avatar, newUser.created_at, newUser.updated_at
        ];
        const res = await db.query(queryText, params);
        if (res.rows[0]) {
          this.users.unshift(res.rows[0]);
          return res.rows[0];
        }
      } catch (e) {
        console.warn('[DatabaseService] PostgreSQL createUser fallback:', e.message);
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').insert([newUser]).select().single();
        if (!error && data) {
          this.users.unshift(data);
          return data;
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase createUser fallback:', e.message);
      }
    }

    this.users.unshift(newUser);

    // Initialize eco score for new citizen
    if (newUser.role === 'citizen') {
      this.ecoScores[newUser.id] = {
        total: 50,
        max: 100,
        level: 'Eco Starter (Tier I)',
        monthlyImprovement: '+0%',
        breakdown: [
          { category: 'Waste Reporting', points: 10, max: 25, description: 'Active & verified issue logging' },
          { category: 'Proper Segregation', points: 15, max: 30, description: 'Consistent door-to-door dry/wet sorting' },
          { category: 'Community Participation', points: 15, max: 25, description: 'Peer validations & neighborhood cleanups' },
          { category: 'Awareness Activities', points: 10, max: 20, description: 'Waste sorting quizzes & guides completed' }
        ],
        achievements: []
      };
    }

    return newUser;
  }

  // --------------------------------------------------------------------------
  // COMPLAINTS
  // --------------------------------------------------------------------------
  async getComplaints(filters = {}) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('complaints').select('*').order('created_at', { ascending: false });
        if (filters.status && filters.status !== 'All') {
          query = query.eq('status', filters.status);
        }
        if (filters.priority && filters.priority !== 'All') {
          query = query.eq('priority', filters.priority);
        }
        if (filters.category && filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }
        if (filters.area && filters.area !== 'All') {
          query = query.eq('area', filters.area);
        }
        if (filters.userId) {
          query = query.eq('user_id', filters.userId);
        }

        const { data, error } = await query;
        if (!error && data) {
          // Re-map DB snake_case to frontend camelCase
          let list = data.map(d => ({
            id: d.id,
            userId: d.user_id,
            title: d.title,
            category: d.category,
            description: d.description,
            address: d.address,
            area: d.area,
            coordinates: { lat: d.latitude, lng: d.longitude },
            priority: d.priority,
            status: d.status,
            submittedAt: d.created_at,
            assignedTeam: d.assigned_team,
            beforeImage: d.before_image,
            afterImage: d.after_image,
            aiAnalysis: d.ai_analysis,
            timeline: (() => {
              const stages = [
                { title: 'Complaint Submitted', actor: 'Citizen', statusMatches: ['Pending', 'Assigned', 'In Progress', 'Resolution Submitted', 'Resolved'] },
                { title: 'Admin Reviewed & Assigned', actor: 'Central Dispatch', statusMatches: ['Assigned', 'In Progress', 'Resolution Submitted', 'Resolved'] },
                { title: 'Collection Team En Route', actor: d.assigned_team || 'Field Crew', statusMatches: ['In Progress', 'Resolution Submitted', 'Resolved'] },
                { title: 'Cleanup In Progress', actor: d.assigned_team || 'Field Crew', statusMatches: ['Resolution Submitted', 'Resolved'] },
                { title: 'Resolution Proof Submitted', actor: d.assigned_team || 'Field Crew', statusMatches: ['Resolution Submitted', 'Resolved'] },
                { title: 'Resolved & Verified', actor: 'AI Auditor', statusMatches: ['Resolved'] }
              ];
              
              let foundCurrent = false;
              return stages.map((stage, idx) => {
                const isCompleted = stage.statusMatches.includes(d.status) && d.status !== stage.statusMatches[0] || (d.status === 'Resolved');
                const isCurrent = !isCompleted && !foundCurrent && stage.statusMatches.includes(d.status);
                if (isCurrent) foundCurrent = true;
                
                return {
                  step: idx + 1,
                  title: stage.title,
                  actor: stage.actor,
                  completed: isCompleted,
                  current: isCurrent,
                  time: isCompleted || isCurrent ? new Date(d.created_at).toLocaleDateString() : '--'
                };
              });
            })()
          }));

          if (filters.search) {
            const q = filters.search.toLowerCase();
            list = list.filter((c) =>
              (c.title && c.title.toLowerCase().includes(q)) ||
              (c.id && c.id.toLowerCase().includes(q)) ||
              (c.area && c.area.toLowerCase().includes(q)) ||
              (c.category && c.category.toLowerCase().includes(q)) ||
              (c.address && c.address.toLowerCase().includes(q))
            );
          }
          return list;
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getComplaints error:', e.message);
      }
    }

    // Fallback to local cache
    let list = [...this.complaints];
    if (filters.status && filters.status !== 'All') list = list.filter((c) => c.status.toLowerCase() === filters.status.toLowerCase());
    if (filters.priority && filters.priority !== 'All') list = list.filter((c) => c.priority.toLowerCase() === filters.priority.toLowerCase());
    if (filters.category && filters.category !== 'All') list = list.filter((c) => c.category.toLowerCase() === filters.category.toLowerCase());
    if (filters.area && filters.area !== 'All') list = list.filter((c) => c.area.toLowerCase() === filters.area.toLowerCase());
    if (filters.userId) list = list.filter((c) => c.userId === filters.userId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((c) =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q)) ||
        (c.area && c.area.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
      );
    }
    return list;
  }

  async getComplaintById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('complaints').select('*').eq('id', id).single();
        if (!error && data) {
          // Re-map DB snake_case to frontend camelCase
          return {
            id: data.id,
            userId: data.user_id,
            title: data.title,
            category: data.category,
            description: data.description,
            address: data.address,
            area: data.area,
            coordinates: { lat: data.latitude, lng: data.longitude },
            priority: data.priority,
            status: data.status,
            submittedAt: data.created_at,
            assignedTeam: data.assigned_team,
            beforeImage: data.before_image,
            afterImage: data.after_image,
            aiAnalysis: data.ai_analysis,
            timeline: (() => {
              const stages = [
                { title: 'Complaint Submitted', actor: 'Citizen', statusMatches: ['Pending', 'Assigned', 'In Progress', 'Resolution Submitted', 'Resolved'] },
                { title: 'Admin Reviewed & Assigned', actor: 'Central Dispatch', statusMatches: ['Assigned', 'In Progress', 'Resolution Submitted', 'Resolved'] },
                { title: 'Collection Team En Route', actor: data.assigned_team || 'Field Crew', statusMatches: ['In Progress', 'Resolution Submitted', 'Resolved'] },
                { title: 'Cleanup In Progress', actor: data.assigned_team || 'Field Crew', statusMatches: ['Resolution Submitted', 'Resolved'] },
                { title: 'Resolution Proof Submitted', actor: data.assigned_team || 'Field Crew', statusMatches: ['Resolution Submitted', 'Resolved'] },
                { title: 'Resolved & Verified', actor: 'AI Auditor', statusMatches: ['Resolved'] }
              ];
              
              let foundCurrent = false;
              return stages.map((stage, idx) => {
                const isCompleted = stage.statusMatches.includes(data.status) && data.status !== stage.statusMatches[0] || (data.status === 'Resolved');
                const isCurrent = !isCompleted && !foundCurrent && stage.statusMatches.includes(data.status);
                if (isCurrent) foundCurrent = true;
                
                return {
                  step: idx + 1,
                  title: stage.title,
                  actor: stage.actor,
                  completed: isCompleted,
                  current: isCurrent,
                  time: isCompleted || isCurrent ? new Date(data.created_at).toLocaleDateString() : '--'
                };
              });
            })()
          };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getComplaintById error:', e.message);
      }
    }
    return this.complaints.find((c) => c.id.toLowerCase() === id.toLowerCase()) || null;
  }

  async createComplaint(complaintData) {
    // Generate a robust unique ID to prevent Supabase constraint violations across restarts
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
    const random = Math.floor(Math.random() * 1000);
    const newId = `NC-${timestamp}${random}`;
    const newComplaint = {
      id: newId,
      userId: complaintData.userId || 'USR-CITIZEN-01',
      title: complaintData.title || `${complaintData.category} at ${complaintData.area || 'Neighborhood'}`,
      category: complaintData.category,
      description: complaintData.description || 'Reported by citizen via Nexus Clean platform.',
      address: complaintData.address || 'Street Location',
      area: complaintData.area || 'Civil Lines',
      coordinates: complaintData.coordinates || { lat: 26.4725, lng: 80.3412 },
      priority: (complaintData.priority || complaintData.aiAnalysis?.priority || 'High').charAt(0).toUpperCase() + (complaintData.priority || complaintData.aiAnalysis?.priority || 'High').slice(1).toLowerCase(),
      status: 'Pending',
      submittedAt: new Date().toISOString(),
      assignedTeam: 'Pending Dispatch',
      beforeImage: complaintData.photoUrl || complaintData.beforeImage || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      afterImage: null,
      aiAnalysis: complaintData.aiAnalysis || {
        detectedIssue: complaintData.category,
        confidence: 94,
        priority: 'HIGH',
        suggestedAction: 'Schedule inspection within 4 hours.',
        isPrototype: true
      },
      verification: null,
      timeline: [
        { step: 1, title: 'Complaint Submitted', time: 'Just now', completed: true, current: true, actor: 'Citizen' },
        { step: 2, title: 'Admin Reviewed', time: 'Pending', completed: false, actor: 'Central Dispatch' },
        { step: 3, title: 'Collection Team Assigned', time: '--', completed: false, actor: '--' },
        { step: 4, title: 'Cleanup In Progress', time: '--', completed: false, actor: '--' },
        { step: 5, title: 'Resolution Verification', time: '--', completed: false, actor: '--' },
        { step: 6, title: 'Resolved', time: '--', completed: false, actor: '--' }
      ]
    };

    if (db.isConfigured()) {
      try {
        const queryText = `
          INSERT INTO complaints (id, user_id, title, category, description, address, area, coordinates, priority, status, submitted_at, assigned_team, before_image, ai_analysis, timeline)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *
        `;
        const params = [
          newComplaint.id, newComplaint.userId, newComplaint.title, newComplaint.category,
          newComplaint.description, newComplaint.address, newComplaint.area, JSON.stringify(newComplaint.coordinates),
          newComplaint.priority, newComplaint.status, newComplaint.submittedAt, newComplaint.assignedTeam,
          newComplaint.beforeImage, JSON.stringify(newComplaint.aiAnalysis), JSON.stringify(newComplaint.timeline)
        ];
        const res = await db.query(queryText, params);
        if (res.rows[0]) {
          this.complaints.unshift(res.rows[0]);
          return res.rows[0];
        }
      } catch (e) {
        console.warn('[DatabaseService] PostgreSQL createComplaint fallback:', e.message);
      }
    }

    if (isSupabaseConfigured()) {
      try {
        const dbComplaint = {
          id: newComplaint.id,
          user_id: newComplaint.userId,
          title: newComplaint.title,
          category: newComplaint.category,
          description: newComplaint.description,
          address: newComplaint.address,
          area: newComplaint.area,
          latitude: newComplaint.coordinates?.lat || 26.4725,
          longitude: newComplaint.coordinates?.lng || 80.3412,
          priority: newComplaint.priority,
          status: newComplaint.status,
          created_at: newComplaint.submittedAt,
          assigned_team: newComplaint.assignedTeam,
          before_image: newComplaint.beforeImage,
          after_image: newComplaint.afterImage,
          ai_analysis: newComplaint.aiAnalysis
        };
        const { data, error } = await supabase.from('complaints').insert([dbComplaint]).select().single();
        if (!error && data) {
          // Insert timeline events
          if (newComplaint.timeline && newComplaint.timeline.length > 0) {
            const historyRecords = newComplaint.timeline.map((step) => ({
              complaint_id: newComplaint.id,
              step: step.step,
              title: step.title,
              status: newComplaint.status,
              time: step.time,
              actor: step.actor,
              completed: step.completed,
              current: step.current || false
            }));
            await supabase.from('complaint_status_history').insert(historyRecords);
          }
          
          // NEW HOTSPOT LOGIC
          const lat = newComplaint.coordinates?.lat || 26.4725;
          const lng = newComplaint.coordinates?.lng || 80.3412;

          try {
            // 1. Fetch all hotspots
            const { data: hotspots } = await supabase.from('hotspots').select('*');
            let matchedHotspot = null;
            let minDistance = HOTSPOT_CONFIG.RADIUS_KM;

            if (hotspots) {
              for (const hs of hotspots) {
                const dist = getDistanceFromLatLonInKm(lat, lng, hs.coord_x, hs.coord_y);
                if (dist <= minDistance) {
                  minDistance = dist;
                  matchedHotspot = hs;
                }
              }
            }

            if (matchedHotspot) {
              // Found existing hotspot
              await supabase.from('hotspot_complaints').insert([{ hotspot_id: matchedHotspot.id, complaint_id: newComplaint.id }]);
              // Update metrics
              const newCount = matchedHotspot.complaints_count + 1;
              const newScore = Math.min(100, matchedHotspot.risk_score + 2);
              let newRisk = matchedHotspot.risk;
              if (newScore >= 80) newRisk = 'CRITICAL';
              else if (newScore >= 60) newRisk = 'HIGH';

              await supabase.from('hotspots').update({
                complaints_count: newCount,
                risk_score: newScore,
                risk: newRisk,
                updated_at: new Date().toISOString()
              }).eq('id', matchedHotspot.id);

              // Notify
              await this.createNotification('USR-ADMIN-01', {
                title: 'Hotspot Escalation',
                message: `New complaint added to Hotspot ${matchedHotspot.name}. Risk Score is now ${newScore}.`,
                type: 'warning',
                link: `/admin/hotspots/${matchedHotspot.id}`
              });

            } else {
              // Check for emerging hotspot
              const { data: recentComplaints } = await supabase.from('complaints').select('*').order('created_at', { ascending: false }).limit(50);
              
              if (recentComplaints) {
                const nearbyComplaints = recentComplaints.filter(c => {
                  return getDistanceFromLatLonInKm(lat, lng, c.latitude, c.longitude) <= HOTSPOT_CONFIG.RADIUS_KM;
                });

                if (nearbyComplaints.length >= HOTSPOT_CONFIG.COMPLAINT_THRESHOLD) {
                  const complaintIds = nearbyComplaints.map(c => c.id);
                  const { data: existingLinks } = await supabase.from('hotspot_complaints').select('complaint_id').in('complaint_id', complaintIds);
                  
                  const linkedIds = new Set((existingLinks || []).map(l => l.complaint_id));
                  const unlinkedComplaints = nearbyComplaints.filter(c => !linkedIds.has(c.id));

                  if (unlinkedComplaints.length >= HOTSPOT_CONFIG.COMPLAINT_THRESHOLD) {
                    // GENERATE NEW HOTSPOT
                    const newHsId = `HS-${Math.floor(Date.now() / 1000).toString().slice(-4)}${Math.floor(Math.random() * 1000)}`;
                    
                    let categoryCounts = {};
                    unlinkedComplaints.forEach(c => {
                       categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
                    });
                    const primaryIssue = Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b);
                    
                    const avgLat = unlinkedComplaints.reduce((sum, c) => sum + Number(c.latitude), 0) / unlinkedComplaints.length;
                    const avgLng = unlinkedComplaints.reduce((sum, c) => sum + Number(c.longitude), 0) / unlinkedComplaints.length;

                    let aiRecommendation = `Deploy collection crew for ${primaryIssue}.`;
                    let riskScore = 65;
                    let risk = 'HIGH';
                    
                    try {
                      const geminiSvc = await import('./geminiService.js');
                      const aiResult = await geminiSvc.analyzeEmergingHotspot(unlinkedComplaints);
                      if (aiResult && !aiResult.isPrototype) {
                         aiRecommendation = aiResult.suggestedAction;
                         riskScore = aiResult.riskScore || 70;
                         risk = aiResult.riskLevel || 'HIGH';
                      }
                    } catch (aiErr) {
                      console.warn('Gemini dynamic hotspot generation failed:', aiErr.message);
                    }

                    const newHotspot = {
                      id: newHsId,
                      name: `Emerging Hotspot: ${newComplaint.area}`,
                      area: newComplaint.area,
                      risk: risk,
                      risk_score: riskScore,
                      complaints_count: unlinkedComplaints.length,
                      trend: '+100%',
                      trend_direction: 'up',
                      primary_issue: primaryIssue,
                      coord_x: avgLat,
                      coord_y: avgLng,
                      ai_recommendation: aiRecommendation,
                      is_prototype: false
                    };

                    await supabase.from('hotspots').insert([newHotspot]);
                    
                    const links = unlinkedComplaints.map(c => ({ hotspot_id: newHsId, complaint_id: c.id }));
                    await supabase.from('hotspot_complaints').insert(links);

                    await this.createNotification('USR-ADMIN-01', {
                      title: 'New Hotspot Detected',
                      message: `A new hotspot (${newHsId}) has emerged in ${newComplaint.area} based on recent complaints.`,
                      type: 'alert',
                      link: `/admin/hotspots/${newHsId}`
                    });
                  }
                }
              }
            }
          } catch (err) {
            console.warn('[DatabaseService] Failed to process geographic hotspot logic:', err.message);
          }
          
          // Insert into complaint_images
          if (newComplaint.beforeImage) {
            try {
              await supabase.from('complaint_images').insert([{
                complaint_id: newComplaint.id,
                image_url: newComplaint.beforeImage,
                image_type: 'before',
                uploaded_by: newComplaint.userId
              }]);
            } catch (err) {
              console.warn('[DatabaseService] Failed to insert complaint_image:', err.message);
            }
          }

          // Award +10 eco points to the reporting citizen
          if (newComplaint.userId) {
            await this.addEcoActivity(newComplaint.userId, {
              activityType: 'waste_reporting',
              points: 10,
              description: `Verified waste report ${newId} logged`
            });
            await this.createNotification(newComplaint.userId, {
              title: 'Complaint Submitted',
              message: `Your complaint #${newId} has been successfully submitted.`,
              type: 'info',
              link: `/citizen/complaints/${newId}`
            });
          }
          
          // Add camelCase back for frontend
          const frontendData = { ...newComplaint, ...data, userId: data.user_id, submittedAt: data.created_at, coordinates: { lat: data.latitude, lng: data.longitude } };
          this.complaints.unshift(frontendData);
          return frontendData;
        } else if (error) {
           console.error('[DatabaseService] Supabase createComplaint error:', error);
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase createComplaint fallback:', e.message);
      }
    }

    this.complaints.unshift(newComplaint);

    // Award +10 eco points to the reporting citizen
    if (newComplaint.userId) {
      this.addEcoActivity(newComplaint.userId, {
        activityType: 'waste_reporting',
        points: 10,
        description: `Verified waste report ${newId} logged`
      });
      this.createNotification(newComplaint.userId, {
        title: 'Complaint Submitted',
        message: `Your complaint #${newId} has been successfully submitted.`,
        type: 'info',
        link: `/citizen/complaints/${newId}`
      });
    }

    return newComplaint;
  }

  async updateComplaint(id, updates) {
    const index = this.complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    this.complaints[index] = { ...this.complaints[index], ...updates, updatedAt: new Date().toISOString() };
    return this.complaints[index];
  }

  async updateComplaintStatus(id, newStatus, additionalData = {}) {
    const complaint = await this.getComplaintById(id);
    if (!complaint) return null;

    const item = { ...complaint, status: newStatus, ...additionalData };

    // Update timeline steps dynamically
    if (newStatus === 'Assigned') {
      if (item.timeline[1]) item.timeline[1].completed = true;
      if (item.timeline[2]) {
        item.timeline[2].completed = true;
        item.timeline[2].current = true;
        item.timeline[2].time = 'Just now';
      }
    } else if (newStatus === 'In Progress') {
      if (item.timeline[1]) item.timeline[1].completed = true;
      if (item.timeline[2]) item.timeline[2].completed = true;
      if (item.timeline[3]) {
        item.timeline[3].completed = true;
        item.timeline[3].current = true;
        item.timeline[3].time = 'Just now';
      }
    } else if (newStatus === 'Resolution Submitted') {
      if (item.timeline[3]) item.timeline[3].completed = true;
      if (item.timeline[4]) {
        item.timeline[4].completed = true;
        item.timeline[4].current = true;
        item.timeline[4].time = 'Just now';
      }
    } else if (newStatus === 'Resolved') {
      item.timeline.forEach((step) => {
        step.completed = true;
        step.current = false;
      });
      if (item.timeline[5]) {
        item.timeline[5].completed = true;
        item.timeline[5].time = 'Just now';
      }
    }
    
    // Attempt Supabase update
    if (isSupabaseConfigured()) {
       try {
         const { data, error } = await supabase.from('complaints').update({ status: newStatus, after_image: item.afterImage, updated_at: new Date().toISOString() }).eq('id', id).select().single();
         if (!error) {
           // Create timeline entry for DB
           await supabase.from('complaint_status_history').insert([{
             complaint_id: id,
             step: item.timeline.findIndex(t => t.current) + 1 || 1,
             title: `Status updated to ${newStatus}`,
             status: newStatus,
             time: 'Just now',
             actor: 'System',
             completed: true,
             current: true
           }]);

           if (item.afterImage) {
             await supabase.from('complaint_images').insert([{
                complaint_id: id,
                image_url: item.afterImage,
                image_type: 'after',
                uploaded_by: item.userId
             }]);
           }

           if (item.verification) {
             await supabase.from('resolution_verifications').insert([{
                complaint_id: id,
                verified: item.verification.verified || item.verification.successful || false,
                score: item.verification.score || item.verification.verificationScore || 0,
                summary: item.verification.summary || 'No summary',
                status: 'Pending Admin Approval',
                submitted_by_team: item.assignedTeam || 'System',
                is_prototype: item.verification.isPrototype || true
             }]);
             
             // Create notification for resolution verification
             await this.createNotification('USR-ADMIN-01', {
                title: 'Resolution Verification Required',
                message: `Complaint #${id} resolution has been verified by AI and awaits admin approval.`,
                type: 'warning',
                link: `/admin/complaints/${id}`
             });
           }
         }
       } catch (e) {
         console.warn('[DatabaseService] Supabase updateComplaintStatus fallback:', e.message);
       }
    }

    const index = this.complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    this.complaints[index] = item;
    
    // Notification
    this.createNotification(item.userId, {
        title: newStatus === 'Resolved' ? 'Complaint Resolved' : 'Complaint Status Updated',
        message: `Your complaint #${id} is now: ${newStatus}.`,
        type: newStatus === 'Resolved' ? 'success' : 'info',
        link: `/citizen/complaints/${id}`
    });
    
    return item;
  }

  async deleteComplaint(id) {
    if (db.isConfigured()) {
      try {
        const res = await db.query('DELETE FROM complaints WHERE id = $1 RETURNING *', [id]);
        if (res.rows[0]) {
          this.complaints = this.complaints.filter((c) => c.id.toLowerCase() !== id.toLowerCase());
          return res.rows[0];
        }
      } catch (e) {
        console.warn('[DatabaseService] PostgreSQL deleteComplaint fallback:', e.message);
      }
    }
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('complaints').delete().eq('id', id).select().single();
        if (!error && data) {
          this.complaints = this.complaints.filter((c) => c.id.toLowerCase() !== id.toLowerCase());
          return data;
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase deleteComplaint fallback:', e.message);
      }
    }
    const idx = this.complaints.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    const [deleted] = this.complaints.splice(idx, 1);
    return deleted;
  }

  // --------------------------------------------------------------------------
  // PICKUPS
  // --------------------------------------------------------------------------
  async getPickups() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('pickup_requests').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(p => ({
            id: p.id,
            userId: p.user_id,
            requesterName: p.requester_name,
            requesterPhone: p.requester_phone,
            wasteType: p.waste_type,
            estimatedQuantity: p.estimated_quantity,
            address: p.address,
            area: p.area,
            zone: p.zone,
            preferredDate: p.preferred_date,
            preferredTime: p.preferred_time,
            photo: p.photo_url,
            status: p.status,
            priority: p.priority,
            assignedCrew: p.assigned_crew,
            createdAt: p.created_at
          }));
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getPickups error:', e.message);
      }
    }
    return [...this.pickups];
  }

  async getPickupById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('pickup_requests').select('*').eq('id', id).single();
        if (!error && data) {
          return {
            id: data.id,
            userId: data.user_id,
            requesterName: data.requester_name,
            requesterPhone: data.requester_phone,
            wasteType: data.waste_type,
            estimatedQuantity: data.estimated_quantity,
            address: data.address,
            area: data.area,
            zone: data.zone,
            preferredDate: data.preferred_date,
            preferredTime: data.preferred_time,
            photo: data.photo_url,
            status: data.status,
            priority: data.priority,
            assignedCrew: data.assigned_crew,
            createdAt: data.created_at
          };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getPickupById error:', e.message);
      }
    }
    return this.pickups.find((p) => p.id.toLowerCase() === id.toLowerCase()) || null;
  }

  async createPickup(pickupData) {
    const timestamp = Math.floor(Date.now() / 1000).toString().slice(-4);
    const random = Math.floor(Math.random() * 1000);
    const newId = `PK-${timestamp}${random}`;
    const newPickup = {
      id: newId,
      userId: pickupData.userId || 'USR-CITIZEN-01',
      requesterName: pickupData.requesterName || 'Aarav Sharma',
      requesterPhone: pickupData.requesterPhone || '+91 98765 43210',
      wasteType: pickupData.wasteType,
      estimatedQuantity: pickupData.estimatedQuantity || 'Standard Collection Sack',
      address: pickupData.address,
      area: pickupData.area || 'Civil Lines',
      zone: pickupData.zone || 'Zone 3',
      preferredDate: pickupData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: pickupData.preferredTime || '10:00 AM - 12:00 PM',
      photo: pickupData.photo || null,
      status: 'Pickup Requested',
      priority: pickupData.priority || 'Medium',
      assignedCrew: 'Central Dispatch Routing',
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const dbPickup = {
          id: newPickup.id,
          user_id: newPickup.userId,
          requester_name: newPickup.requesterName,
          requester_phone: newPickup.requesterPhone,
          waste_type: newPickup.wasteType,
          estimated_quantity: newPickup.estimatedQuantity,
          address: newPickup.address,
          area: newPickup.area,
          zone: newPickup.zone,
          preferred_date: newPickup.preferredDate,
          preferred_time: newPickup.preferredTime,
          photo_url: newPickup.photo,
          status: newPickup.status,
          priority: newPickup.priority,
          assigned_crew: newPickup.assignedCrew,
          created_at: newPickup.createdAt
        };
        const { data, error } = await supabase.from('pickup_requests').insert([dbPickup]).select().single();
        if (!error && data) {
          if (newPickup.userId) {
            await this.addEcoActivity(newPickup.userId, {
              activityType: 'proper_segregation',
              points: 5,
              description: `Scheduled bulk pickup request ${newId}`
            });
            await this.createNotification(newPickup.userId, {
              title: 'Pickup Requested',
              message: `Your pickup request #${newId} has been received.`,
              type: 'info',
              link: `/citizen/dashboard`
            });
          }
          const frontendData = { ...newPickup, id: data.id };
          this.pickups.unshift(frontendData);
          return frontendData;
        } else if (error) {
          console.error('[DatabaseService] Supabase createPickup error:', error);
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase createPickup fallback:', e.message);
      }
    }

    this.pickups.unshift(newPickup);
    if (newPickup.userId) {
      this.addEcoActivity(newPickup.userId, {
        activityType: 'proper_segregation',
        points: 5,
        description: `Scheduled bulk pickup request ${newId}`
      });
      this.createNotification(newPickup.userId, {
        title: 'Pickup Requested',
        message: `Your pickup request #${newId} has been received.`,
        type: 'info',
        link: `/citizen/dashboard`
      });
    }

    return newPickup;
  }

  async updatePickupStatus(id, newStatus, extra = {}) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('pickup_requests')
          .update({ status: newStatus, ...extra, updated_at: new Date().toISOString() })
          .eq('id', id)
          .select().single();
        if (!error && data) {
          const index = this.pickups.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());
          if (index !== -1) {
            this.pickups[index] = { ...this.pickups[index], status: newStatus, ...extra, updatedAt: new Date().toISOString() };
          }
          await this.createNotification(data.user_id, {
            title: 'Pickup Status Updated',
            message: `Your pickup request #${id} is now: ${newStatus}.`,
            type: newStatus === 'Completed' ? 'success' : 'info',
            link: `/citizen/dashboard`
          });
          return { id: data.id, status: data.status, ...extra };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase updatePickupStatus fallback:', e.message);
      }
    }

    const index = this.pickups.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    this.pickups[index] = { ...this.pickups[index], status: newStatus, ...extra, updatedAt: new Date().toISOString() };
    
    this.createNotification(this.pickups[index].userId, {
      title: 'Pickup Status Updated',
      message: `Your pickup request #${id} is now: ${newStatus}.`,
      type: newStatus === 'Completed' ? 'success' : 'info',
      link: `/citizen/dashboard`
    });

    return this.pickups[index];
  }

  async deletePickup(id) {
    if (db.isConfigured()) {
      try {
        const res = await db.query('DELETE FROM pickup_requests WHERE id = $1 RETURNING *', [id]);
        if (res.rows[0]) {
          this.pickups = this.pickups.filter((p) => p.id.toLowerCase() !== id.toLowerCase());
          return res.rows[0];
        }
      } catch (e) {
        console.warn('[DatabaseService] PostgreSQL deletePickup fallback:', e.message);
      }
    }
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('pickup_requests').delete().eq('id', id).select().single();
        if (!error && data) {
          this.pickups = this.pickups.filter((p) => p.id.toLowerCase() !== id.toLowerCase());
          return data;
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase deletePickup fallback:', e.message);
      }
    }
    const idx = this.pickups.findIndex((p) => p.id.toLowerCase() === id.toLowerCase());
    if (idx === -1) return null;
    const [deleted] = this.pickups.splice(idx, 1);
    return deleted;
  }

  // --------------------------------------------------------------------------
  // HOTSPOTS
  // --------------------------------------------------------------------------
  async seedHotspots() {
    if (!isSupabaseConfigured()) return;
    try {
      const { data: existing, error: countErr } = await supabase.from('hotspots').select('id');
      if (countErr) return;
      const existingIds = new Set(existing.map(h => h.id));

      const toInsert = [];
      for (const hs of this.hotspots) {
        if (!existingIds.has(hs.id)) {
          toInsert.push({
            id: hs.id,
            name: hs.title || hs.name || `Hotspot ${hs.id}`,
            area: hs.area || 'Unknown Area',
            risk: hs.risk || 'MEDIUM',
            risk_score: hs.riskScore || 50,
            complaints_count: hs.complaints || 0,
            trend: hs.trend || '+0%',
            trend_direction: hs.trendDirection || 'up',
            primary_issue: hs.primaryIssue || 'Mixed Waste',
            secondary_issue: hs.secondaryIssue || null,
            coord_x: hs.coordinates?.lat || hs.coordinates?.x || 26.47,
            coord_y: hs.coordinates?.lng || hs.coordinates?.y || 80.34,
            peak_hours: hs.peakHours || null,
            ai_recommendation: hs.aiRecommendation || 'Monitor area closely.',
            deep_analysis: hs.deepAnalysis || {},
            is_prototype: true
          });
        }
      }
      if (toInsert.length > 0) {
        await supabase.from('hotspots').insert(toInsert);
        console.log(`[DatabaseService] Seeded ${toInsert.length} default hotspots.`);
      }
    } catch (e) {
      console.warn('[DatabaseService] Failed to seed hotspots:', e.message);
    }
  }

  async getHotspots() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('hotspots').select('*');
        if (!error && data) {
          return data.map(h => ({
            id: h.id,
            name: h.name,
            area: h.area,
            risk: h.risk,
            riskScore: h.risk_score,
            complaints: h.complaints_count,
            trend: h.trend,
            trendDirection: h.trend_direction,
            primaryIssue: h.primary_issue,
            secondaryIssue: h.secondary_issue,
            coordinates: { x: h.coord_x, y: h.coord_y },
            peakHours: h.peak_hours,
            aiRecommendation: h.ai_recommendation,
            deepAnalysis: h.deep_analysis,
            prototype: h.is_prototype
          }));
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getHotspots error:', e.message);
      }
    }
    return [...this.hotspots];
  }

  async getHotspotById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('hotspots').select('*').eq('id', id).single();
        if (!error && data) {
          return {
            id: data.id,
            name: data.name,
            area: data.area,
            risk: data.risk,
            riskScore: data.risk_score,
            complaints: data.complaints_count,
            trend: data.trend,
            trendDirection: data.trend_direction,
            primaryIssue: data.primary_issue,
            secondaryIssue: data.secondary_issue,
            coordinates: { x: data.coord_x, y: data.coord_y },
            peakHours: data.peak_hours,
            aiRecommendation: data.ai_recommendation,
            deepAnalysis: data.deep_analysis,
            prototype: data.is_prototype
          };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getHotspotById error:', e.message);
      }
    }
    return this.hotspots.find((h) => h.id.toLowerCase() === id.toLowerCase()) || null;
  }

  async updateHotspot(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const dbUpdates = {};
        if (updates.risk) dbUpdates.risk = updates.risk;
        if (updates.riskScore) dbUpdates.risk_score = updates.riskScore;
        if (updates.complaints) dbUpdates.complaints_count = updates.complaints;
        if (updates.trend) dbUpdates.trend = updates.trend;
        if (updates.trendDirection) dbUpdates.trend_direction = updates.trendDirection;
        if (updates.aiRecommendation) dbUpdates.ai_recommendation = updates.aiRecommendation;
        if (updates.deepAnalysis) dbUpdates.deep_analysis = updates.deepAnalysis;

        dbUpdates.updated_at = new Date().toISOString();

        const { data, error } = await supabase.from('hotspots').update(dbUpdates).eq('id', id).select().single();
        if (!error && data) {
          const index = this.hotspots.findIndex((h) => h.id.toLowerCase() === id.toLowerCase());
          if (index !== -1) {
            this.hotspots[index] = { ...this.hotspots[index], ...updates };
          }
          return { id, ...updates };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase updateHotspot error:', e.message);
      }
    }

    const index = this.hotspots.findIndex((h) => h.id.toLowerCase() === id.toLowerCase());
    if (index === -1) return null;

    this.hotspots[index] = { ...this.hotspots[index], ...updates };
    return this.hotspots[index];
  }

  // --------------------------------------------------------------------------
  // ECO SCORE & ACTIVITIES
  // --------------------------------------------------------------------------
  async getEcoScore(userId = 'USR-CITIZEN-01') {
    const defaultScore = {
      total: 50,
      max: 100,
      level: 'Eco Starter (Tier I)',
      monthlyImprovement: '+0%',
      breakdown: [
        { category: 'Waste Reporting', points: 10, max: 25, description: 'Active & verified issue logging' },
        { category: 'Proper Segregation', points: 15, max: 30, description: 'Consistent door-to-door dry/wet sorting' },
        { category: 'Community Participation', points: 15, max: 25, description: 'Peer validations & neighborhood cleanups' },
        { category: 'Awareness Activities', points: 10, max: 20, description: 'Waste sorting quizzes & guides completed' }
      ],
      achievements: [
        { id: 'ach-1', title: 'First Reporter', description: 'Logged your first verified municipal waste issue', icon: 'Flag', unlocked: true, date: 'Initial Signup' }
      ]
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('eco_scores').select('*').eq('user_id', userId).single();
        if (!error && data) {
          return {
            total: data.total,
            max: data.max,
            level: data.level,
            monthlyImprovement: data.monthly_improvement,
            breakdown: data.breakdown,
            achievements: data.achievements
          };
        } else if (error && error.code === 'PGRST116') {
          // No rows found, insert default
          const dbScore = {
            user_id: userId,
            total: defaultScore.total,
            max: defaultScore.max,
            level: defaultScore.level,
            monthly_improvement: defaultScore.monthlyImprovement,
            breakdown: defaultScore.breakdown,
            achievements: defaultScore.achievements
          };
          await supabase.from('eco_scores').insert([dbScore]);
          return defaultScore;
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getEcoScore error:', e.message);
      }
    }

    const existing = this.ecoScores[userId];
    if (existing) return existing;

    this.ecoScores[userId] = defaultScore;
    return defaultScore;
  }

  async addEcoActivity(userId, activity) {
    const current = await this.getEcoScore(userId);
    const newTotal = Math.min(100, current.total + activity.points);
    let newLevel = 'Eco Starter (Tier I)';
    if (newTotal >= 85) newLevel = 'Eco Hero (Tier III)';
    else if (newTotal >= 70) newLevel = 'Eco Guardian (Tier II)';

    if (isSupabaseConfigured()) {
      try {
        const dbActivity = {
          user_id: userId,
          activity_type: activity.activityType,
          points: activity.points,
          description: activity.description,
          reference_id: activity.referenceId || null
        };
        const { data, error } = await supabase.from('eco_activities').insert([dbActivity]).select().single();
        if (!error && data) {
          // Update eco_scores
          await supabase.from('eco_scores').update({
            total: newTotal,
            level: newLevel,
            updated_at: new Date().toISOString()
          }).eq('user_id', userId);
          
          this.createNotification(userId, {
            title: 'Eco Score Points Awarded',
            message: `You earned +${activity.points} Eco Points for ${activity.activityType.replace('_', ' ')}.`,
            type: 'success',
            link: `/citizen/eco-score`
          });
          
          return {
            id: data.id,
            userId: data.user_id,
            activityType: data.activity_type,
            points: data.points,
            description: data.description,
            createdAt: data.created_at
          };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase addEcoActivity error:', e.message);
      }
    }

    const record = {
      id: this.ecoActivities.length + 1,
      userId,
      activityType: activity.activityType,
      points: activity.points,
      description: activity.description,
      createdAt: new Date().toISOString()
    };
    this.ecoActivities.unshift(record);

    current.total = newTotal;
    current.level = newLevel;

    this.createNotification(userId, {
      title: 'Eco Score Points Awarded',
      message: `You earned +${activity.points} Eco Points for ${activity.activityType.replace('_', ' ')}.`,
      type: 'success',
      link: `/citizen/eco-score`
    });

    return record;
  }

  // --------------------------------------------------------------------------
  // AWARENESS & QUIZ
  // --------------------------------------------------------------------------
  async getAwareness() {
    return [...this.awareness];
  }

  async getQuizItems() {
    return [...this.quizItems];
  }

  // --------------------------------------------------------------------------
  // NOTIFICATIONS
  // --------------------------------------------------------------------------
  async getNotifications(userId) {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (userId) {
          query = query.eq('user_id', userId);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data.map(n => ({
            id: n.id,
            userId: n.user_id,
            title: n.title,
            message: n.message,
            type: n.type,
            read: n.is_read,
            link: n.link,
            createdAt: n.created_at
          }));
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase getNotifications error:', e.message);
      }
    }
    
    if (userId) {
      return this.notifications.filter((n) => n.userId === userId || n.userId === 'all');
    }
    return [...this.notifications];
  }

  async markNotificationRead(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('notifications')
          .update({ is_read: true })
          .eq('id', id)
          .select().single();
        if (!error && data) {
          const index = this.notifications.findIndex((n) => n.id === id);
          if (index !== -1) this.notifications[index].read = true;
          return { ...data, read: data.is_read };
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase markNotificationRead error:', e.message);
      }
    }

    const index = this.notifications.findIndex((n) => n.id === id);
    if (index !== -1) {
      this.notifications[index].read = true;
      return this.notifications[index];
    }
    return null;
  }
  
  async createNotification(userId, notificationData) {
    const newNotification = {
      id: `NOTIF-${Date.now()}`, // Fallback ID for in-memory
      userId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      read: false,
      link: notificationData.link || null,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      try {
        const dbNotif = {
          user_id: newNotification.userId,
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          is_read: newNotification.read,
          link: newNotification.link
        };
        const { data, error } = await supabase.from('notifications').insert([dbNotif]).select().single();
        if (!error && data) {
          const frontendData = { ...newNotification, id: data.id, createdAt: data.created_at };
          this.notifications.unshift(frontendData);
          return frontendData;
        } else if (error) {
          console.error('[DatabaseService] Supabase createNotification error:', error);
        }
      } catch (e) {
        console.warn('[DatabaseService] Supabase createNotification fallback:', e.message);
      }
    }

    this.notifications.unshift(newNotification);
    return newNotification;
  }
}

export const databaseService = new DatabaseService();
