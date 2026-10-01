import app from '../src/app.js';
import http from 'http';

const runTests = async () => {
  const PORT = 5099;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`[TEST RUNNER] Test server listening on http://localhost:${PORT}`);

  const BASE_URL = `http://localhost:${PORT}/api`;
  let passedCount = 0;
  let totalTests = 0;

  const assert = (condition, message) => {
    totalTests++;
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      throw new Error(message);
    }
    passedCount++;
    console.log(`✅ PASSED: ${message}`);
  };

  try {
    // 1. Health check
    console.log('\n--- Testing Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200, 'Health check returns status 200');
    assert(healthData.success === true, 'Health check success flag is true');
    assert(healthData.message === 'Nexus Clean API is running', 'Health check message matches');

    // 2. Authentication: Register
    console.log('\n--- Testing Auth: Register Citizen ---');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Rahul Sharma',
        email: 'rahul.test@nexusclean.org',
        password: 'password123',
        location: 'Civil Lines',
        area: 'Zone 3'
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201, 'Register returns status 201');
    assert(regData.success === true, 'Register success flag is true');
    assert(Boolean(regData.token), 'JWT token returned on registration');
    assert(regData.user.name === 'Rahul Sharma', 'User name is correct');

    // 3. Authentication: Login Citizen
    console.log('\n--- Testing Auth: Login Citizen ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'citizen@nexusclean.org',
        password: 'demo123'
      })
    });
    const loginData = await loginRes.json();
    assert(loginRes.status === 200, 'Citizen login returns status 200');
    assert(loginData.success === true, 'Citizen login success is true');
    assert(Boolean(loginData.token), 'Citizen JWT token returned');
    const citizenToken = loginData.token;

    // 4. Authentication: Login Admin
    console.log('\n--- Testing Auth: Login Admin ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nexusclean.org',
        password: 'demo123'
      })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginRes.status === 200, 'Admin login returns status 200');
    assert(adminLoginData.user.role === 'admin', 'Admin role verified');
    const adminToken = adminLoginData.token;

    // 5. Current User /api/users/me
    console.log('\n--- Testing User Profile ---');
    const meRes = await fetch(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const meData = await meRes.json();
    assert(meRes.status === 200, 'Get current user returns 200');
    assert(meData.user.email === 'citizen@nexusclean.org', 'Email matches authenticated citizen');
    assert(Boolean(meData.user.ecoScore), 'User profile contains Eco Score');

    // 6. Complaints: List
    console.log('\n--- Testing Complaints List ---');
    const compListRes = await fetch(`${BASE_URL}/complaints`);
    const compListData = await compListRes.json();
    assert(compListRes.status === 200, 'Complaints list returns 200');
    assert(Array.isArray(compListData.data), 'Complaints data is an array');
    assert(compListData.data.length >= 4, 'Seed complaints are present');

    // 7. Complaints: Create
    console.log('\n--- Testing Complaint Creation ---');
    const createCompRes = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        category: 'Overflowing Bin',
        description: 'Garbage has been overflowing since yesterday.',
        address: 'Civil Lines, Gate 2',
        area: 'Civil Lines',
        priority: 'High'
      })
    });
    const createCompData = await createCompRes.json();
    assert(createCompRes.status === 201, 'Create complaint returns 201');
    assert(createCompData.data.id.startsWith('NC-'), 'Complaint ID has prefix NC-');
    assert(createCompData.data.status === 'Pending', 'Initial status is Pending');
    assert(createCompData.data.timeline.length === 6, 'Full 6-step lifecycle timeline created');
    const createdCompId = createCompData.data.id;

    // 8. Complaints: Get by ID
    console.log('\n--- Testing Complaint by ID ---');
    const compByIdRes = await fetch(`${BASE_URL}/complaints/${createdCompId}`);
    const compByIdData = await compByIdRes.json();
    assert(compByIdRes.status === 200, 'Get single complaint returns 200');
    assert(compByIdData.data.id === createdCompId, 'Complaint ID matches');

    // 9. Complaints: Update status
    console.log('\n--- Testing Complaint Status Update ---');
    const statusUpdateRes = await fetch(`${BASE_URL}/complaints/${createdCompId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'Assigned',
        assignedTeam: 'Field Unit #05'
      })
    });
    const statusUpdateData = await statusUpdateRes.json();
    assert(statusUpdateRes.status === 200, 'Update status returns 200');
    assert(statusUpdateData.data.status === 'Assigned', 'Status updated to Assigned');
    assert(statusUpdateData.data.timeline[2].completed === true, 'Timeline step 3 completed');

    // 10. Pickups: List
    console.log('\n--- Testing Pickups List ---');
    const pickupsRes = await fetch(`${BASE_URL}/pickups`);
    const pickupsData = await pickupsRes.json();
    assert(pickupsRes.status === 200, 'Get pickups returns 200');
    assert(Array.isArray(pickupsData.data), 'Pickups data is an array');
    assert(Boolean(pickupsData.smartRoute), 'Smart route recommendation included in pickups response');

    // 11. Pickups: Create
    console.log('\n--- Testing Pickup Creation ---');
    const createPickupRes = await fetch(`${BASE_URL}/pickups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${citizenToken}`
      },
      body: JSON.stringify({
        wasteType: 'E-Waste',
        estimatedQuantity: '2 Old Printers, 5 Cables',
        address: 'Sector 4, Swaroop Nagar',
        area: 'Swaroop Nagar',
        preferredDate: '2026-10-05',
        preferredTime: '10:00 AM - 12:00 PM'
      })
    });
    const createPickupData = await createPickupRes.json();
    assert(createPickupRes.status === 201, 'Create pickup returns 201');
    assert(createPickupData.data.id.startsWith('PK-'), 'Pickup ID starts with PK-');

    // 12. Hotspots
    console.log('\n--- Testing Predictive Hotspots ---');
    const hotspotsRes = await fetch(`${BASE_URL}/hotspots`);
    const hotspotsData = await hotspotsRes.json();
    assert(hotspotsRes.status === 200, 'Hotspots returns 200');
    assert(hotspotsData.data.length >= 5, 'Hotspots list populated');
    assert(hotspotsData.data[0].prototype === true, 'Clearly flagged as Prototype Intelligence');

    // 13. Hotspot Detail
    console.log('\n--- Testing Hotspot Detail ---');
    const hotspotDetailRes = await fetch(`${BASE_URL}/hotspots/HS-01`);
    const hotspotDetailData = await hotspotDetailRes.json();
    assert(hotspotDetailRes.status === 200, 'Hotspot detail returns 200');
    assert(Boolean(hotspotDetailData.data.deepAnalysis), 'Deep analysis is present');

    // 14. Analytics
    console.log('\n--- Testing Analytics Endpoint ---');
    const analyticsRes = await fetch(`${BASE_URL}/analytics`);
    const analyticsData = await analyticsRes.json();
    assert(analyticsRes.status === 200, 'Analytics returns 200');
    assert(Boolean(analyticsData.stats), 'Operational stats present');
    assert(Array.isArray(analyticsData.complaintsOverTime), 'Complaints over time present for Recharts');
    assert(Array.isArray(analyticsData.complaintsByCategory), 'Complaints by category present for Recharts');
    assert(Array.isArray(analyticsData.recurringProblems), 'Recurring problems analysis present');

    // 15. Eco Score
    console.log('\n--- Testing Eco Score ---');
    const ecoRes = await fetch(`${BASE_URL}/eco-score`, {
      headers: { Authorization: `Bearer ${citizenToken}` }
    });
    const ecoData = await ecoRes.json();
    assert(ecoRes.status === 200, 'Eco score returns 200');
    assert(typeof ecoData.total === 'number' || typeof ecoData.data.total === 'number', 'Eco score total is a number');

    // 16. Awareness & Quiz
    console.log('\n--- Testing Awareness Content ---');
    const awareRes = await fetch(`${BASE_URL}/awareness`);
    const awareData = await awareRes.json();
    assert(awareRes.status === 200, 'Awareness returns 200');
    assert(awareData.data.length >= 5, 'Awareness categories present');

    const quizRes = await fetch(`${BASE_URL}/awareness/quiz`);
    const quizData = await quizRes.json();
    assert(quizRes.status === 200, 'Quiz returns 200');
    assert(quizData.data.length >= 8, 'Quiz items present');

    // 17. AI Analyze Waste (Fallback)
    console.log('\n--- Testing AI Waste Analysis Fallback ---');
    const aiRes = await fetch(`${BASE_URL}/ai/analyze-waste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'Overflowing Bin',
        description: 'Commercial dumpster overflowing'
      })
    });
    const aiData = await aiRes.json();
    assert(aiRes.status === 200, 'AI waste analysis returns 200');
    assert(aiData.data.isPrototype === true, 'Fallback identified as Prototype Intelligence');
    assert(aiData.data.priority === 'HIGH', 'Priority suggested correctly');

    // 18. AI Verify Resolution (Fallback)
    console.log('\n--- Testing AI Resolution Verification Fallback ---');
    const verifyRes = await fetch(`${BASE_URL}/ai/verify-resolution`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintId: 'NC-1042',
        beforeImageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18',
        afterImageUrl: 'https://images.unsplash.com/photo-1526951521990-620dc14c214b'
      })
    });
    const verifyData = await verifyRes.json();
    assert(verifyRes.status === 200, 'AI verification returns 200');
    assert(verifyData.data.isPrototype === true, 'Verification identified as Prototype Intelligence');
    assert(verifyData.data.verificationScore >= 90, 'Verification score computed');

    // 19. Admin Operations
    console.log('\n--- Testing Admin Operations ---');
    const adminDashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminDashData = await adminDashRes.json();
    assert(adminDashRes.status === 200, 'Admin dashboard returns 200');
    assert(Boolean(adminDashData.data.metrics), 'Admin metrics present');

    const adminRecRes = await fetch(`${BASE_URL}/admin/pickups/recommendations`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const adminRecData = await adminRecRes.json();
    assert(adminRecRes.status === 200, 'Pickup recommendations returns 200');
    assert(adminRecData.data.prototype === true, 'Route recommendation marked as prototype');

    // 20. Validation Error Handling
    console.log('\n--- Testing Validation Errors ---');
    const invalidCompRes = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'NonExistentCategory'
      })
    });
    const invalidCompData = await invalidCompRes.json();
    assert(invalidCompRes.status === 422, 'Invalid category rejected with status 422');
    assert(invalidCompData.success === false, 'Error response has success: false');
    assert(invalidCompData.error.code === 'VALIDATION_ERROR', 'Error code is VALIDATION_ERROR');

    console.log(`\n=================================================`);
    console.log(`🎉 ALL ${passedCount}/${totalTests} BACKEND TESTS PASSED SUCCESSFULLY!`);
    console.log(`=================================================\n`);
  } finally {
    server.close();
  }
};

runTests().catch((err) => {
  console.error('\n❌ Test execution failed:', err);
  process.exit(1);
});
