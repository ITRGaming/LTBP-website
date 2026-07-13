import app from '../app.js';
import http from 'http';

const TEST_PORT = 5050;
const BASE_URL = `http://localhost:${TEST_PORT}`;

// Quick assertion helpers
const assertEqual = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(`FAIL: ${message} (Expected "${expected}", got "${actual}")`);
  }
  console.log(`  PASS: ${message}`);
};

const assertExists = (value, message) => {
  if (value === undefined || value === null) {
    throw new Error(`FAIL: ${message} (Value does not exist)`);
  }
  console.log(`  PASS: ${message}`);
};

const runTests = async () => {
  console.log('--- STARTING BACKEND REST API VERIFICATION SUITE ---');
  let serverInstance;

  try {
    // 1. Boot Server on test port
    serverInstance = app.listen(TEST_PORT);
    console.log(`Test server booted successfully on ${BASE_URL}`);

    // Wait slightly for connections to establish
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 1: GET /api/health
    console.log('\nExecuting Test 1: GET /api/health');
    const resHealth = await fetch(`${BASE_URL}/api/health`);
    assertEqual(resHealth.status, 200, 'Health check responds with 200');
    const bodyHealth = await resHealth.json();
    assertEqual(bodyHealth.success, true, 'Health check returns success=true');
    assertEqual(bodyHealth.message, 'API server is running and healthy.', 'Health check returns healthy message');
    assertExists(bodyHealth.data.uptime, 'Health check contains uptime data');

    // Test 2: GET /api/version
    console.log('\nExecuting Test 2: GET /api/version');
    const resVersion = await fetch(`${BASE_URL}/api/version`);
    assertEqual(resVersion.status, 200, 'Version responds with 200');
    const bodyVersion = await resVersion.json();
    assertEqual(bodyVersion.success, true, 'Version returns success=true');
    assertEqual(bodyVersion.data.version, '1.0.0', 'Version returns correct version value');

    // Test 3: GET /api/settings
    console.log('\nExecuting Test 3: GET /api/settings');
    const resSettings = await fetch(`${BASE_URL}/api/settings`);
    assertEqual(resSettings.status, 200, 'Settings responds with 200');
    const bodySettings = await resSettings.json();
    assertEqual(bodySettings.success, true, 'Settings returns success=true');
    assertExists(bodySettings.data.businessName, 'Settings contains business name');

    // Test 4: Validation check - GET invalid endpoint (404 Handler)
    console.log('\nExecuting Test 4: 404 Route handler check');
    const res404 = await fetch(`${BASE_URL}/api/invalid-route-path`);
    assertEqual(res404.status, 404, 'Invalid route responds with 404');
    const body404 = await res404.json();
    assertEqual(body404.success, false, 'Invalid route returns success=false');
    assertEqual(body404.message, 'Endpoint /api/invalid-route-path not found on this server.', '404 message matches');

    // Test 5: Validation check - POST /api/auth/login with invalid data
    console.log('\nExecuting Test 5: POST /api/auth/login validation intercepts');
    const resLoginVal = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bademail', password: '' })
    });
    assertEqual(resLoginVal.status, 400, 'Invalid login inputs respond with 400');
    const bodyLoginVal = await resLoginVal.json();
    assertEqual(bodyLoginVal.success, false, 'Invalid login body returns success=false');
    assertExists(bodyLoginVal.errors, 'Invalid login contains errors array');
    assertEqual(bodyLoginVal.errors.length, 2, 'Validation array detects 2 fields missing/incorrect');

    // Test 6: Validation check - POST /api/contact with invalid data
    console.log('\nExecuting Test 6: POST /api/contact validation intercepts');
    const resContactVal = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'notanemail', phone: '', message: '' })
    });
    assertEqual(resContactVal.status, 400, 'Invalid contact submission responds with 400');
    const bodyContactVal = await resContactVal.json();
    assertEqual(bodyContactVal.success, false, 'Invalid contact returns success=false');
    assertEqual(bodyContactVal.errors.length, 4, 'Validation array detects all 4 fields failed');

    console.log('\n----------------------------------------------------');
    console.log('ALL SMOKE ENDPOINT VERIFICATION TESTS COMPLETED SUCCESSFULLY.');
    console.log('----------------------------------------------------');
    process.exit(0);

  } catch (error) {
    console.error('\n!!! VERIFICATION SUITE FAILED WITH EXCEPTION !!!');
    console.error(error.stack || error.message);
    process.exit(1);
  } finally {
    if (serverInstance) {
      serverInstance.close();
    }
  }
};

runTests();
