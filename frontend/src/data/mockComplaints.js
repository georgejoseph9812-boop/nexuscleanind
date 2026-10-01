// Mock complaints dataset with realistic lifecycle data
export const INITIAL_COMPLAINTS = [
  {
    id: "NC-1042",
    title: "Severe Commercial Bin Overflow",
    category: "Overflowing Bin",
    description: "Two 1100L municipal containers overflowing onto pedestrian walkway. Food waste attracting stray animals and creating foul odor.",
    address: "Opposite Metro Station Gate 2, Civil Lines",
    area: "Civil Lines",
    coordinates: { lat: 26.4725, lng: 80.3412 },
    priority: "High",
    status: "Resolution Submitted",
    submittedAt: "2026-09-28T09:15:00Z",
    assignedTeam: "Rapid Response Unit #04",
    beforeImage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1526951521990-620dc14c214b?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      detectedIssue: "Overflowing Bin (High Density Organic & Plastic)",
      confidence: 94,
      priority: "HIGH",
      suggestedAction: "Schedule emergency collection within 4 hours. Increase evening bin clearance frequency.",
      materialBreakdown: { organic: "65%", recyclablePlastic: "25%", other: "10%" },
      isPrototype: true
    },
    verification: {
      status: "Pending Admin Approval",
      score: 92,
      summary: "Resolution appears successful. 92% visual clearance of pavement and sanitized perimeter detected by AI model comparison.",
      submittedByTeam: "Foreman R. Sharma",
      submittedAt: "2026-09-29T14:30:00Z"
    },
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 28, 09:15 AM", completed: true, actor: "Citizen (You)" },
      { step: 2, title: "Admin Reviewed", time: "Sep 28, 09:40 AM", completed: true, actor: "Central Dispatch" },
      { step: 3, title: "Collection Team Assigned", time: "Sep 28, 10:15 AM", completed: true, actor: "Rapid Response #04" },
      { step: 4, title: "Cleanup In Progress", time: "Sep 29, 11:00 AM", completed: true, actor: "Field Crew #04" },
      { step: 5, title: "Resolution Verification", time: "Sep 29, 02:30 PM", completed: true, current: true, actor: "AI & Admin Approval" },
      { step: 6, title: "Resolved", time: "Pending Approval", completed: false, actor: "Nexus Clean System" }
    ]
  },
  {
    id: "NC-1043",
    title: "Illegal Dump Site on Green Belt",
    category: "Illegal Dumping",
    description: "Mixed debris, discarded packaging crates, and broken glass dumped near the residential park border.",
    address: "Block C Sector 4, Swaroop Nagar",
    area: "Swaroop Nagar",
    coordinates: { lat: 26.4812, lng: 80.3315 },
    priority: "High",
    status: "In Progress",
    submittedAt: "2026-09-29T08:00:00Z",
    assignedTeam: "Zone 2 Heavy Duty Truck #11",
    beforeImage: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
    afterImage: null,
    aiAnalysis: {
      detectedIssue: "Illegal Dumping (Construction & Dry Waste)",
      confidence: 89,
      priority: "HIGH",
      suggestedAction: "Deploy heavy loader truck. Notify municipal zoning enforcement.",
      materialBreakdown: { packaging: "40%", rubble: "35%", nonRecyclable: "25%" },
      isPrototype: true
    },
    verification: null,
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 29, 08:00 AM", completed: true, actor: "Citizen Verified" },
      { step: 2, title: "Admin Reviewed", time: "Sep 29, 08:30 AM", completed: true, actor: "Supervisor Gupta" },
      { step: 3, title: "Collection Team Assigned", time: "Sep 29, 09:15 AM", completed: true, actor: "Zone 2 Fleet" },
      { step: 4, title: "Cleanup In Progress", time: "Sep 29, 11:45 AM", completed: true, current: true, actor: "Heavy Loader Unit" },
      { step: 5, title: "Resolution Verification", time: "Estimated Sep 29, 05:00 PM", completed: false, actor: "AI Verification" },
      { step: 6, title: "Resolved", time: "Pending", completed: false, actor: "System" }
    ]
  },
  {
    id: "NC-1044",
    title: "Roadside Littering Along Market Lane",
    category: "Roadside Garbage",
    description: "Single-use cups, paper food wrappers, and drink cans scattered along the 150m market walkway.",
    address: "Near Central Book Depot, Mall Road",
    area: "Mall Road",
    coordinates: { lat: 26.465, lng: 80.352 },
    priority: "Medium",
    status: "Pending",
    submittedAt: "2026-09-29T10:20:00Z",
    assignedTeam: "Pending Dispatch",
    beforeImage: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=800&q=80",
    afterImage: null,
    aiAnalysis: {
      detectedIssue: "Roadside Garbage (Commercial Food Packaging)",
      confidence: 91,
      priority: "MEDIUM",
      suggestedAction: "Assign street sweeping crew during off-peak hours (2 PM - 4 PM).",
      materialBreakdown: { paperCardboard: "50%", plasticBeverage: "40%", other: "10%" },
      isPrototype: true
    },
    verification: null,
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 29, 10:20 AM", completed: true, current: true, actor: "Citizen" },
      { step: 2, title: "Admin Reviewed", time: "Awaiting Review", completed: false, actor: "Dispatch" },
      { step: 3, title: "Collection Team Assigned", time: "--", completed: false, actor: "--" },
      { step: 4, title: "Cleanup In Progress", time: "--", completed: false, actor: "--" },
      { step: 5, title: "Resolution Verification", time: "--", completed: false, actor: "--" },
      { step: 6, title: "Resolved", time: "--", completed: false, actor: "--" }
    ]
  },
  {
    id: "NC-1045",
    title: "Missed Residential Collection Route",
    category: "Missed Collection",
    description: "Door-to-door waste van skipped Lane 4 and Lane 5 for two consecutive days.",
    address: "Lane 4, Teachers Colony, Kakadeo",
    area: "Kakadeo",
    coordinates: { lat: 26.488, lng: 80.301 },
    priority: "Medium",
    status: "Assigned",
    submittedAt: "2026-09-28T16:45:00Z",
    assignedTeam: "Route Van #08 (K. Singh)",
    beforeImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    afterImage: null,
    aiAnalysis: {
      detectedIssue: "Service Gap / Missed Municipal Collection",
      confidence: 96,
      priority: "MEDIUM",
      suggestedAction: "Reroute Van #08 for supplementary morning pickup round.",
      materialBreakdown: { householdSegregated: "80%", dryWaste: "20%" },
      isPrototype: true
    },
    verification: null,
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 28, 04:45 PM", completed: true, actor: "Citizen" },
      { step: 2, title: "Admin Reviewed", time: "Sep 28, 05:30 PM", completed: true, actor: "Area Inspector" },
      { step: 3, title: "Collection Team Assigned", time: "Sep 29, 07:10 AM", completed: true, current: true, actor: "Van #08" },
      { step: 4, title: "Cleanup In Progress", time: "Scheduled 11:30 AM", completed: false, actor: "Van #08" },
      { step: 5, title: "Resolution Verification", time: "--", completed: false, actor: "--" },
      { step: 6, title: "Resolved", time: "--", completed: false, actor: "--" }
    ]
  },
  {
    id: "NC-1046",
    title: "Mixed Hazardous Waste Behind Clinic",
    category: "Improper Segregation",
    description: "Medical blister packs, cotton gauze, and discarded chemical bottles mixed with regular municipal rubbish bin.",
    address: "Rear Alley, Health Center Road, Govind Nagar",
    area: "Govind Nagar",
    coordinates: { lat: 26.443, lng: 80.321 },
    priority: "High",
    status: "Resolved",
    submittedAt: "2026-09-27T11:00:00Z",
    assignedTeam: "Bio-Waste Specialty Squad #02",
    beforeImage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      detectedIssue: "Improper Segregation / Hazardous Waste Threat",
      confidence: 95,
      priority: "HIGH",
      suggestedAction: "Specialized biohazard containment required. Issue advisory notice to neighboring clinics.",
      materialBreakdown: { hazardous: "45%", recyclablePlastic: "30%", organic: "25%" },
      isPrototype: true
    },
    verification: {
      status: "Approved",
      score: 96,
      summary: "Specialized disposal verified. Hazardous material removed to certified treatment facility; area disinfected.",
      submittedByTeam: "Bio-Waste Officer V. Patel",
      submittedAt: "2026-09-27T17:15:00Z",
      approvedBy: "Chief Medical & Sanitary Officer"
    },
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 27, 11:00 AM", completed: true, actor: "Citizen" },
      { step: 2, title: "Admin Reviewed", time: "Sep 27, 11:15 AM", completed: true, actor: "Admin Priority Alert" },
      { step: 3, title: "Collection Team Assigned", time: "Sep 27, 11:45 AM", completed: true, actor: "Bio-Squad #02" },
      { step: 4, title: "Cleanup In Progress", time: "Sep 27, 02:00 PM", completed: true, actor: "Bio-Squad #02" },
      { step: 5, title: "Resolution Verification", time: "Sep 27, 05:15 PM", completed: true, actor: "AI & Sanitarian" },
      { step: 6, title: "Resolved", time: "Sep 27, 06:00 PM", completed: true, actor: "Admin Confirmed" }
    ]
  },
  {
    id: "NC-1047",
    title: "Construction Debris Spilled on Main Road",
    category: "Construction Waste",
    description: "Cement bags, broken plaster, and gravel blocking one full lane of traffic.",
    address: "Near Water Tank Junction, Shastri Nagar",
    area: "Shastri Nagar",
    coordinates: { lat: 26.479, lng: 80.298 },
    priority: "High",
    status: "Resolution Submitted",
    submittedAt: "2026-09-28T14:10:00Z",
    assignedTeam: "Zone 1 JCB & Tipper Crew",
    beforeImage: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      detectedIssue: "Construction Debris & Obstruction",
      confidence: 93,
      priority: "HIGH",
      suggestedAction: "Heavy mechanical loader required to clear traffic lane immediately.",
      materialBreakdown: { rubbleConcrete: "70%", cementPackaging: "20%", soil: "10%" },
      isPrototype: true
    },
    verification: {
      status: "Pending Admin Approval",
      score: 88,
      summary: "Debris cleared from active lane. Sidewalk swept. Awaiting admin signoff.",
      submittedByTeam: "Foreman A. Joshi",
      submittedAt: "2026-09-29T13:00:00Z"
    },
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 28, 02:10 PM", completed: true, actor: "Citizen" },
      { step: 2, title: "Admin Reviewed", time: "Sep 28, 02:30 PM", completed: true, actor: "Traffic Coordination" },
      { step: 3, title: "Collection Team Assigned", time: "Sep 28, 03:00 PM", completed: true, actor: "JCB Crew #01" },
      { step: 4, title: "Cleanup In Progress", time: "Sep 29, 09:30 AM", completed: true, actor: "JCB Crew #01" },
      { step: 5, title: "Resolution Verification", time: "Sep 29, 01:00 PM", completed: true, current: true, actor: "AI Verification" },
      { step: 6, title: "Resolved", time: "Pending Signoff", completed: false, actor: "Admin" }
    ]
  },
  {
    id: "NC-1048",
    title: "Discarded Electronic Appliances by Canal",
    category: "Other",
    description: "Old CRT monitor, compressor parts, and tangled cables dumped along the canal bank.",
    address: "Canal Ring Road, Ashok Nagar",
    area: "Ashok Nagar",
    coordinates: { lat: 26.460, lng: 80.315 },
    priority: "Medium",
    status: "Resolved",
    submittedAt: "2026-09-26T15:20:00Z",
    assignedTeam: "E-Waste Recovery Unit",
    beforeImage: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80",
    afterImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    aiAnalysis: {
      detectedIssue: "E-Waste Accumulation (Hazardous Components)",
      confidence: 90,
      priority: "MEDIUM",
      suggestedAction: "Transport to certified e-waste dismantling center.",
      materialBreakdown: { electronicCircuitry: "50%", plasticCasing: "30%", glass: "20%" },
      isPrototype: true
    },
    verification: {
      status: "Approved",
      score: 95,
      summary: "All electronic components safely retrieved and logged in e-waste registry.",
      submittedByTeam: "Officer K. Nair",
      submittedAt: "2026-09-27T10:45:00Z",
      approvedBy: "Pollution Control Admin"
    },
    timeline: [
      { step: 1, title: "Complaint Submitted", time: "Sep 26, 03:20 PM", completed: true, actor: "Citizen" },
      { step: 2, title: "Admin Reviewed", time: "Sep 26, 04:00 PM", completed: true, actor: "Dispatch" },
      { step: 3, title: "Collection Team Assigned", time: "Sep 27, 08:30 AM", completed: true, actor: "E-Waste Unit" },
      { step: 4, title: "Cleanup In Progress", time: "Sep 27, 09:15 AM", completed: true, actor: "E-Waste Unit" },
      { step: 5, title: "Resolution Verification", time: "Sep 27, 10:45 AM", completed: true, actor: "AI & Admin" },
      { step: 6, title: "Resolved", time: "Sep 27, 12:00 PM", completed: true, actor: "System" }
    ]
  }
];

export const COMPLAINT_CATEGORIES = [
  "Overflowing Bin",
  "Roadside Garbage",
  "Illegal Dumping",
  "Missed Collection",
  "Improper Segregation",
  "Construction Waste",
  "Other"
];
