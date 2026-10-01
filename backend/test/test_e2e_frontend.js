const BASE_URL = 'http://localhost:5000/api';

const runE2E = async () => {
  console.log('--- STARTING END-TO-END FLOW VERIFICATION ---');

  // 1. Health
  const health = await (await fetch(`${BASE_URL}/health`)).json();
  if (!health.success) throw new Error('Health check failed');
  console.log('✅ 1. Backend health: OK');

  // 2. Register
  const testUserEmail = `citizen.${Date.now()}@example.com`;
  const reg = await (await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Patel',
      email: testUserEmail,
      password: 'password123',
      location: 'Mall Road, Kanpur',
      area: 'Mall Road'
    })
  })).json();
  if (!reg.success || !reg.token) throw new Error('Registration failed');
  const citizenToken = reg.token;
  console.log(`✅ 2. Citizen Registration (${testUserEmail}): OK`);

  // 3. Current User Profile
  const me = await (await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  })).json();
  if (!me.success || me.user.name !== 'Priya Patel') throw new Error('Get user profile failed');
  console.log(`✅ 3. Current User Profile (Score: ${me.user.ecoScore?.total}): OK`);

  // 4. Create Complaint
  const comp = await (await fetch(`${BASE_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`
    },
    body: JSON.stringify({
      category: 'Roadside Garbage',
      description: 'Litter accumulation along Mall Road footbridge.',
      address: 'Footbridge 3, Mall Road',
      area: 'Mall Road',
      priority: 'Medium'
    })
  })).json();
  if (!comp.success || !comp.data.id) throw new Error('Create complaint failed');
  const compId = comp.data.id;
  console.log(`✅ 4. Citizen Complaint Registered (#${compId}): OK`);

  // 5. Track Complaint Detail & Lifecycle Timeline
  const compDetail = await (await fetch(`${BASE_URL}/complaints/${compId}`)).json();
  if (!compDetail.success || compDetail.data.timeline.length !== 6) throw new Error('Complaint detail failed');
  console.log(`✅ 5. Complaint Tracking Timeline (Step 1 complete): OK`);

  // 6. Request Waste Pickup
  const pickup = await (await fetch(`${BASE_URL}/pickups`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`
    },
    body: JSON.stringify({
      wasteType: 'Recyclable',
      estimatedQuantity: '6 Bags of Plastic Bottles',
      address: 'Shop 12, Mall Road Promenade',
      area: 'Mall Road',
      preferredDate: '2026-10-04',
      preferredTime: '02:00 PM - 04:00 PM'
    })
  })).json();
  if (!pickup.success || !pickup.data.id) throw new Error('Create pickup failed');
  const pickupId = pickup.data.id;
  console.log(`✅ 6. Specialized Pickup Requested (#${pickupId}): OK`);

  // 7. Check Eco-Score Updated
  const eco = await (await fetch(`${BASE_URL}/eco-score`, {
    headers: { Authorization: `Bearer ${citizenToken}` }
  })).json();
  if (!eco.success || eco.total < 50) throw new Error('Eco-Score check failed');
  console.log(`✅ 7. Eco-Score Gamification (Score: ${eco.total} - ${eco.level}): OK`);

  // 8. Admin Login
  const adminLogin = await (await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@nexusclean.org', password: 'demo123' })
  })).json();
  if (!adminLogin.success || !adminLogin.token) throw new Error('Admin login failed');
  const adminToken = adminLogin.token;
  console.log('✅ 8. Admin Control Room Login: OK');

  // 9. Admin Updates Status (Pending -> Assigned -> In Progress -> Resolved)
  const assign = await (await fetch(`${BASE_URL}/complaints/${compId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Assigned', assignedTeam: 'Mall Road Rapid Crew' })
  })).json();
  if (assign.data.status !== 'Assigned') throw new Error('Assign status failed');

  const resolved = await (await fetch(`${BASE_URL}/complaints/${compId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({ status: 'Resolved' })
  })).json();
  if (resolved.data.status !== 'Resolved' || !resolved.data.timeline[5].completed) throw new Error('Resolve failed');
  console.log(`✅ 9. Admin Lifecycle Transitions for #${compId} (Resolved): OK`);

  // 10. Admin Hotspots & Predictive Intelligence
  const hotspots = await (await fetch(`${BASE_URL}/hotspots`)).json();
  if (!hotspots.success || hotspots.data.length < 5) throw new Error('Hotspots check failed');
  console.log(`✅ 10. Predictive Hotspots Intelligence (${hotspots.data.length} clusters): OK`);

  // 11. Admin Fleet Route Recommendation
  const route = await (await fetch(`${BASE_URL}/admin/pickups/recommendations`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  })).json();
  if (!route.success || !route.data.sequence) throw new Error('Smart route failed');
  console.log(`✅ 11. Admin Smart Route Recommendation (Saved: ${route.data.fuelSaved}): OK`);

  // 12. Awareness & Interactive Challenge
  const awareness = await (await fetch(`${BASE_URL}/awareness`)).json();
  const quiz = await (await fetch(`${BASE_URL}/awareness/quiz`)).json();
  if (!awareness.success || !quiz.success) throw new Error('Awareness/Quiz check failed');
  console.log(`✅ 12. Civic Awareness & Sort Challenge (${awareness.data.length} guides, ${quiz.data.length} quiz items): OK`);

  // 13. Recharts Analytics
  const analytics = await (await fetch(`${BASE_URL}/analytics`)).json();
  if (!analytics.success || !analytics.stats || !analytics.complaintsOverTime) throw new Error('Analytics failed');
  console.log(`✅ 13. Recharts Live Datasets (Resolution Rate: ${analytics.stats.resolutionRate}%): OK`);

  console.log('\n🎉 ALL 13 END-TO-END FLOWS COMPLETED SUCCESSFULLY!');
};

runE2E().catch((err) => {
  console.error('\n❌ E2E failed:', err);
  process.exit(1);
});
