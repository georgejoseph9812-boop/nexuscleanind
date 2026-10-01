import test from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/app.js';

let server;
const PORT = 5098;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch {
          parsed = data;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

test('DATABASE CRUD & API SPECIFICATION TESTS', async (t) => {
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });

  t.after(() => {
    server.close();
  });

  let citizenToken = '';
  let createdComplaintId = '';
  let createdPickupId = '';

  await t.test('1. Database CRUD: Register User', async () => {
    const email = `dbtest.${Date.now()}@example.com`;
    const res = await request('POST', '/auth/register', {
      name: 'DB Test Citizen',
      email,
      password: 'Password@123',
      location: 'Kanpur Central',
      area: 'Civil Lines'
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.strictEqual(res.body.data.user.email, email);
    citizenToken = res.body.data.token;
  });

  await t.test('2. Database CRUD: Create Complaint (CREATE)', async () => {
    const res = await request('POST', '/complaints', {
      category: 'Roadside Garbage',
      description: 'Litter accumulation along bypass road.',
      address: 'Plot 18, Bypass Road',
      area: 'Civil Lines',
      priority: 'High'
    }, { Authorization: `Bearer ${citizenToken}` });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    createdComplaintId = res.body.data.id;
  });

  await t.test('3. Database CRUD: Read Complaint by ID (READ)', async () => {
    const res = await request('GET', `/complaints/${createdComplaintId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.id, createdComplaintId);
    assert.strictEqual(res.body.data.category, 'Roadside Garbage');
  });

  await t.test('4. Database CRUD: Update Complaint Status (UPDATE)', async () => {
    const res = await request('PATCH', `/complaints/${createdComplaintId}/status`, {
      status: 'In Progress',
      assignedTeam: 'Field Squad 3'
    }, { Authorization: `Bearer ${citizenToken}` });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'In Progress');
  });

  await t.test('5. Database CRUD: Delete Complaint (DELETE)', async () => {
    const res = await request('DELETE', `/complaints/${createdComplaintId}`, null, {
      Authorization: `Bearer ${citizenToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.deleted, true);

    // Verify it is gone
    const verifyRes = await request('GET', `/complaints/${createdComplaintId}`);
    assert.strictEqual(verifyRes.status, 404);
  });

  await t.test('6. Database CRUD: Create Pickup Request (CREATE)', async () => {
    const res = await request('POST', '/pickups', {
      wasteType: 'Bulk Waste',
      estimatedQuantity: '3 discarded wooden tables',
      address: '22 Civil Lines',
      area: 'Civil Lines',
      preferredDate: '2026-10-15',
      preferredTime: '10:00 AM - 12:00 PM',
      priority: 'Medium'
    }, { Authorization: `Bearer ${citizenToken}` });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.id);
    createdPickupId = res.body.data.id;
  });

  await t.test('7. Database CRUD: Read Pickup by ID (READ)', async () => {
    const res = await request('GET', `/pickups/${createdPickupId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.id, createdPickupId);
  });

  await t.test('8. Database CRUD: Update Pickup Status (UPDATE)', async () => {
    const res = await request('PATCH', `/pickups/${createdPickupId}/status`, {
      status: 'Assigned',
      assignedCrew: 'Heavy Truck #02'
    }, { Authorization: `Bearer ${citizenToken}` });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'Assigned');
  });

  await t.test('9. Database CRUD: Delete Pickup (DELETE)', async () => {
    const res = await request('DELETE', `/pickups/${createdPickupId}`, null, {
      Authorization: `Bearer ${citizenToken}`
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.deleted, true);

    // Verify it is gone
    const verifyRes = await request('GET', `/pickups/${createdPickupId}`);
    assert.strictEqual(verifyRes.status, 404);
  });

  await t.test('10. Security: SQL Injection safe search filtering', async () => {
    const res = await request('GET', `/complaints?search=' OR '1'='1`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  await t.test('11. Security: Duplicate email registration rejected', async () => {
    const res = await request('POST', '/auth/register', {
      name: 'Duplicate Aarav',
      email: 'citizen@nexusclean.org', // Existing demo citizen
      password: 'SomePassword123'
    });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.error.code, 'CONFLICT');
  });
});
