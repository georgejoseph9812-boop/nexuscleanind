import { databaseService } from './databaseService.js';

export const getAggregatedAnalytics = async () => {
  const complaints = await databaseService.getComplaints();
  const pickups = await databaseService.getPickups();
  const hotspots = await databaseService.getHotspots();

  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter((c) => c.status === 'Pending').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress' || c.status === 'Assigned').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const highPriorityComplaints = complaints.filter((c) => (c.priority || '').toLowerCase() === 'high' || (c.priority || '').toLowerCase() === 'critical').length;
  const highRiskHotspots = hotspots.filter((h) => h.risk === 'HIGH').length;

  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 91;

  // Complaints by category with chart color palettes
  const categoryColorMap = {
    'Overflowing Bin': '#0F5132',
    'Roadside Garbage': '#16A34A',
    'Illegal Dumping': '#F59E0B',
    'Missed Collection': '#0D9488',
    'Improper Segregation': '#6366F1',
    'Construction Waste': '#EF4444',
    'Other': '#64748B'
  };

  const categoryMap = {};
  complaints.forEach((c) => {
    const cat = c.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const complaintsByCategory = Object.keys(categoryColorMap).map((cat) => ({
    name: cat,
    count: (categoryMap[cat] || 0) + (cat === 'Overflowing Bin' ? 25 : cat === 'Roadside Garbage' ? 18 : 10),
    fill: categoryColorMap[cat]
  }));

  // Complaints by area
  const areaComplaints = [
    { area: 'Civil Lines', complaints: 32, resolved: 28, risk: 'High' },
    { area: 'Mall Road', complaints: 26, resolved: 23, risk: 'High' },
    { area: 'Swaroop Nagar', complaints: 21, resolved: 18, risk: 'Medium' },
    { area: 'Govind Nagar', complaints: 19, resolved: 15, risk: 'Medium' },
    { area: 'Kakadeo', complaints: 16, resolved: 15, risk: 'Low' },
    { area: 'Shastri Nagar', complaints: 14, resolved: 13, risk: 'Low' }
  ];

  // Resolution Rate Breakdown
  const resolutionRateData = [
    { name: `Resolved (${resolutionRate}%)`, value: resolvedComplaints + 70, fill: '#10B981' },
    { name: `In Progress (${100 - resolutionRate > 15 ? 16 : 10}%)`, value: inProgressComplaints + 18, fill: '#F59E0B' },
    { name: 'Pending (26%)', value: pendingComplaints + 30, fill: '#94A3B8' }
  ];

  // Complaints Over Time
  const complaintsOverTime = [
    { month: 'Apr', reported: 85, resolved: 70, predicted: 88 },
    { month: 'May', reported: 98, resolved: 86, predicted: 102 },
    { month: 'Jun', reported: 114, resolved: 101, predicted: 110 },
    { month: 'Jul', reported: 122, resolved: 110, predicted: 125 },
    { month: 'Aug', reported: 140, resolved: 128, predicted: 135 },
    { month: 'Sep', reported: 128, resolved: 116, predicted: 120 }
  ];

  // Waste Type Distribution
  const wasteTypeDistribution = [
    { type: 'Organic / Wet', percentage: 48, tons: 142, color: '#166534' },
    { type: 'Recyclable Plastics', percentage: 24, tons: 71, color: '#10B981' },
    { type: 'Paper & Cardboard', percentage: 14, tons: 41, color: '#3B82F6' },
    { type: 'E-Waste & Batteries', percentage: 8, tons: 23, color: '#8B5CF6' },
    { type: 'Inert / Construction', percentage: 6, tons: 18, color: '#F59E0B' }
  ];

  // Resolution Time Trend
  const resolutionTimeTrend = [
    { week: 'W1', avgHours: 7.4, targetHours: 6 },
    { week: 'W2', avgHours: 6.8, targetHours: 6 },
    { week: 'W3', avgHours: 5.5, targetHours: 6 },
    { week: 'W4', avgHours: 4.8, targetHours: 6 }
  ];

  // Recurring Problems Analysis
  const recurringProblems = [
    {
      id: 'RPA-01',
      area: 'Civil Lines (Metro Gate 2)',
      repeatedIssue: 'Overflowing commercial food bins',
      frequency: '5 occurrences in past 14 days',
      possibleCause: 'High evening food stall waste generation and insufficient collection frequency.',
      recommendedAction: 'Increase evening collection capacity. Deploy two supplementary 1100L heavy-duty containers between 5 PM and 8 PM.',
      status: 'Recommendation Active',
      severity: 'High'
    },
    {
      id: 'RPA-02',
      area: 'Swaroop Nagar (Sector 4 Border)',
      repeatedIssue: 'Illegal debris dumping during nighttime',
      frequency: '3 occurrences in past 21 days',
      possibleCause: 'Unmonitored vacant municipal green belt with unlit approach road.',
      recommendedAction: 'Install motion-activated perimeter lighting and patrol checkpoint at 10 PM.',
      status: 'Under Review',
      severity: 'Medium'
    },
    {
      id: 'RPA-03',
      area: 'Mall Road (Central Market Lane)',
      repeatedIssue: 'Single-use drink cup and wrapper littering',
      frequency: 'Daily post-market accumulation',
      possibleCause: 'Existing dustbin volume inadequate for peak weekend shopper foot traffic.',
      recommendedAction: 'Transition to high-volume solar-powered compactor bins with 80% fill sensors.',
      status: 'Planned Implementation',
      severity: 'High'
    }
  ];

  return {
    stats: {
      totalComplaints: totalComplaints + 120,
      pendingComplaints: pendingComplaints + 30,
      inProgressComplaints: inProgressComplaints + 19,
      resolvedComplaints: resolvedComplaints + 71,
      highPriorityComplaints: highPriorityComplaints + 10,
      pickupRequests: pickups.length,
      highRiskHotspots,
      resolutionRate,
      avgResolutionHours: 4.8,
      communityEcoScoreAvg: 78,
      isDemoData: true
    },
    complaintsOverTime,
    complaintsByCategory,
    resolutionRateData,
    wasteTypeDistribution,
    complaintsByArea: areaComplaints,
    resolutionTimeTrend,
    recurringProblems
  };
};
