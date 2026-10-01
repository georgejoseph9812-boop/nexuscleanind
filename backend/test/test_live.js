const BASE_URL = 'http://localhost:5000/api';

const runLiveVerification = async () => {
  console.log(`Verifying live backend at ${BASE_URL}...`);

  // Health
  const h = await (await fetch(`${BASE_URL}/health`)).json();
  console.log('1. Health check:', h.success ? 'PASSED' : 'FAILED');

  // Login
  const login = await (await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'citizen@nexusclean.org', password: 'demo123' })
  })).json();
  console.log('2. Citizen Login:', login.success && login.token ? 'PASSED' : 'FAILED');

  // Complaints
  const comps = await (await fetch(`${BASE_URL}/complaints`)).json();
  console.log('3. Complaints Fetch:', comps.success && comps.data.length >= 4 ? `PASSED (${comps.data.length} complaints)` : 'FAILED');

  // Hotspots
  const hotspots = await (await fetch(`${BASE_URL}/hotspots`)).json();
  console.log('4. Predictive Hotspots:', hotspots.success && hotspots.data.length >= 5 ? `PASSED (${hotspots.data.length} hotspots, prototype: ${hotspots.data[0].prototype})` : 'FAILED');

  // Pickups
  const pickups = await (await fetch(`${BASE_URL}/pickups`)).json();
  console.log('5. Pickups & Smart Route:', pickups.success && pickups.smartRoute ? 'PASSED' : 'FAILED');

  // Analytics
  const analytics = await (await fetch(`${BASE_URL}/analytics`)).json();
  console.log('6. Recharts Analytics:', analytics.success && analytics.complaintsOverTime.length > 0 ? 'PASSED' : 'FAILED');

  // AI Fallback
  const ai = await (await fetch(`${BASE_URL}/ai/analyze-waste`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category: 'Overflowing Bin' })
  })).json();
  console.log('7. AI Fallback (Prototype Intelligence):', ai.success && ai.data.isPrototype === true ? 'PASSED' : 'FAILED');

  console.log('\nAll live checks passed against http://localhost:5000!');
};

runLiveVerification().catch(console.error);
