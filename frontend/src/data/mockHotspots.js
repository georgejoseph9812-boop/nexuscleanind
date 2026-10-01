// Predictive Hotspots Dataset (Simulated Prototype Intelligence)
export const MOCK_HOTSPOTS = [
  {
    id: "HS-01",
    name: "Civil Lines Commercial Hub",
    area: "Civil Lines",
    risk: "HIGH",
    riskScore: 91,
    complaints: 23,
    trend: "+28%",
    trendDirection: "up",
    primaryIssue: "Overflowing bins",
    secondaryIssue: "Commercial food waste",
    coordinates: { x: 38, y: 32, lat: 26.475, lng: 80.344 },
    peakHours: "5:00 PM – 8:30 PM",
    aiRecommendation: "Increase evening collection frequency between 5 PM and 8 PM. Deploy two supplementary 1100L heavy-duty containers.",
    deepAnalysis: {
      possibleCause: "Surge in evening street food stalls and student foot traffic combined with a 12-hour gap between municipal rounds.",
      confidence: "94% (Prototype Intelligence)",
      recurringCycle: "Every Friday & Saturday evening",
      recommendedIntervention: "Dynamic routing dispatch: reroute Truck #04 for an automated 6:30 PM clearance sweep.",
      preventedCostSavings: "Estimated 3.4 hrs field crew overtime avoided weekly."
    }
  },
  {
    id: "HS-02",
    name: "Swaroop Nagar Residential Perimeter",
    area: "Swaroop Nagar",
    risk: "MEDIUM",
    riskScore: 68,
    complaints: 11,
    trend: "-8%",
    trendDirection: "down",
    primaryIssue: "Illegal dumping",
    secondaryIssue: "Construction debris",
    coordinates: { x: 62, y: 25, lat: 26.481, lng: 80.331 },
    peakHours: "9:00 PM – 11:30 PM",
    aiRecommendation: "Deploy mobile surveillance unit and install solar CCTV deterrent signage at Block C perimeter.",
    deepAnalysis: {
      possibleCause: "Unlit vacant plot boundary attracting unauthorized nighttime renovation contractors dumping debris.",
      confidence: "88% (Prototype Intelligence)",
      recurringCycle: "Bi-weekly mid-month",
      recommendedIntervention: "Install perimeter barrier fencing and schedule neighborhood vigilance inspection.",
      preventedCostSavings: "Prevents repeated heavy JCB excavator hiring costs."
    }
  },
  {
    id: "HS-03",
    name: "Mall Road Shopping Promenade",
    area: "Mall Road",
    risk: "HIGH",
    riskScore: 86,
    complaints: 19,
    trend: "+14%",
    trendDirection: "up",
    primaryIssue: "Roadside littering",
    secondaryIssue: "Single-use beverage plastic",
    coordinates: { x: 50, y: 65, lat: 26.465, lng: 80.352 },
    peakHours: "3:30 PM – 7:00 PM",
    aiRecommendation: "Install dual-stream smart sorting bins every 50 meters and engage shopkeeper association in morning cleanup pledge.",
    deepAnalysis: {
      possibleCause: "High pedestrian density with inadequate bin volume; current dustbins fill up within 90 minutes on weekends.",
      confidence: "91% (Prototype Intelligence)",
      recurringCycle: "Weekends & holiday afternoons",
      recommendedIntervention: "Install solar compactor bins that notify sanitation control room at 80% capacity.",
      preventedCostSavings: "Reduces daily manual roadside sweeping labor hours by 40%."
    }
  },
  {
    id: "HS-04",
    name: "Kakadeo Coaching Corridor",
    area: "Kakadeo",
    risk: "LOW",
    riskScore: 34,
    complaints: 5,
    trend: "-22%",
    trendDirection: "down",
    primaryIssue: "Missed morning collection",
    secondaryIssue: "Pamphlet & paper waste",
    coordinates: { x: 22, y: 70, lat: 26.488, lng: 80.301 },
    peakHours: "8:00 AM – 10:00 AM",
    aiRecommendation: "Maintain current morning door-to-door schedule. Recent route adjustment successfully reduced complaints by 22%.",
    deepAnalysis: {
      possibleCause: "Previous driver navigation bottlenecks on narrow alleyways resolved with GPS micro-van routing.",
      confidence: "85% (Prototype Intelligence)",
      recurringCycle: "Historically Mondays only",
      recommendedIntervention: "Routine weekly telemetry monitoring; no emergency intervention needed.",
      preventedCostSavings: "Achieved sustained 92% citizen satisfaction in Sector 3."
    }
  },
  {
    id: "HS-05",
    name: "Govind Nagar Industrial Fringe",
    area: "Govind Nagar",
    risk: "MEDIUM",
    riskScore: 72,
    complaints: 14,
    trend: "+6%",
    trendDirection: "up",
    primaryIssue: "Improper Segregation",
    secondaryIssue: "Industrial packaging foam",
    coordinates: { x: 78, y: 80, lat: 26.443, lng: 80.321 },
    peakHours: "1:00 PM – 3:00 PM",
    aiRecommendation: "Conduct targeted compliance audit of local small-scale workshop packaging disposal.",
    deepAnalysis: {
      possibleCause: "Packaging waste mixed into municipal compactor due to lack of separate recyclable pickup channel.",
      confidence: "89% (Prototype Intelligence)",
      recurringCycle: "Post-shipment weekdays",
      recommendedIntervention: "Provide dedicated commercial cardboard baling service pickup on Tuesday and Thursday.",
      preventedCostSavings: "Prevents mixed contamination at central recycling MRF."
    }
  }
];
