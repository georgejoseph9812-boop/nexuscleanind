// Mock Analytics & Recharts Datasets (Prototype Intelligence Demo Data)
export const DEMO_STATISTICS = {
  totalComplaints: 128,
  pendingComplaints: 34,
  inProgressComplaints: 21,
  resolvedComplaints: 73,
  highPriorityComplaints: 12,
  pickupRequests: 18,
  highRiskHotspots: 12,
  resolutionRate: 91, // percentage
  avgResolutionHours: 4.8,
  communityEcoScoreAvg: 78,
  isDemoData: true
};

export const COMPLAINTS_OVER_TIME = [
  { month: "Apr", reported: 85, resolved: 70, predicted: 88 },
  { month: "May", reported: 98, resolved: 86, predicted: 102 },
  { month: "Jun", reported: 114, resolved: 101, predicted: 110 },
  { month: "Jul", reported: 122, resolved: 110, predicted: 125 },
  { month: "Aug", reported: 140, resolved: 128, predicted: 135 },
  { month: "Sep", reported: 128, resolved: 116, predicted: 120 }
];

export const COMPLAINTS_BY_CATEGORY = [
  { name: "Overflowing Bin", count: 42, fill: "#0F5132" },
  { name: "Roadside Garbage", count: 28, fill: "#16A34A" },
  { name: "Illegal Dumping", count: 22, fill: "#F59E0B" },
  { name: "Missed Collection", count: 16, fill: "#0D9488" },
  { name: "Improper Segregation", count: 11, fill: "#6366F1" },
  { name: "Construction Waste", count: 9, fill: "#EF4444" }
];

export const RESOLUTION_RATE_DATA = [
  { name: "Resolved (91%)", value: 73, fill: "#10B981" },
  { name: "In Progress (16%)", value: 21, fill: "#F59E0B" },
  { name: "Pending (26%)", value: 34, fill: "#94A3B8" }
];

export const WASTE_TYPE_DISTRIBUTION = [
  { type: "Organic / Wet", percentage: 48, tons: 142, color: "#166534" },
  { type: "Recyclable Plastics", percentage: 24, tons: 71, color: "#10B981" },
  { type: "Paper & Cardboard", percentage: 14, tons: 41, color: "#3B82F6" },
  { type: "E-Waste & Batteries", percentage: 8, tons: 23, color: "#8B5CF6" },
  { type: "Inert / Construction", percentage: 6, tons: 18, color: "#F59E0B" }
];

export const COMPLAINTS_BY_AREA = [
  { area: "Civil Lines", complaints: 32, resolved: 28, risk: "High" },
  { area: "Mall Road", complaints: 26, resolved: 23, risk: "High" },
  { area: "Swaroop Nagar", complaints: 21, resolved: 18, risk: "Medium" },
  { area: "Govind Nagar", complaints: 19, resolved: 15, risk: "Medium" },
  { area: "Kakadeo", complaints: 16, resolved: 15, risk: "Low" },
  { area: "Shastri Nagar", complaints: 14, resolved: 13, risk: "Low" }
];

export const RESOLUTION_TIME_TREND = [
  { week: "W1", avgHours: 7.4, targetHours: 6 },
  { week: "W2", avgHours: 6.8, targetHours: 6 },
  { week: "W3", avgHours: 5.5, targetHours: 6 },
  { week: "W4", avgHours: 4.8, targetHours: 6 }
];

export const RECURRING_PROBLEM_ANALYSIS = [
  {
    id: "RPA-01",
    area: "Civil Lines (Metro Gate 2)",
    repeatedIssue: "Overflowing commercial food bins",
    frequency: "5 occurrences in past 14 days",
    possibleCause: "High evening food stall waste generation and insufficient collection frequency.",
    recommendedAction: "Increase evening collection capacity. Deploy two supplementary 1100L heavy-duty containers between 5 PM and 8 PM.",
    status: "Recommendation Active",
    severity: "High"
  },
  {
    id: "RPA-02",
    area: "Swaroop Nagar (Sector 4 Border)",
    repeatedIssue: "Illegal debris dumping during nighttime",
    frequency: "3 occurrences in past 21 days",
    possibleCause: "Unmonitored vacant municipal green belt with unlit approach road.",
    recommendedAction: "Install motion-activated perimeter lighting and patrol checkpoint at 10 PM.",
    status: "Under Review",
    severity: "Medium"
  },
  {
    id: "RPA-03",
    area: "Mall Road (Central Market Lane)",
    repeatedIssue: "Single-use drink cup and wrapper littering",
    frequency: "Daily post-market accumulation",
    possibleCause: "Existing dustbin volume inadequate for peak weekend shopper foot traffic.",
    recommendedAction: "Transition to high-volume solar-powered compactor bins with 80% fill sensors.",
    status: "Planned Implementation",
    severity: "High"
  }
];
