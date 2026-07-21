/**
 * Challenge Verification Script
 * 
 * This script tests each challenge endpoint and verifies:
 * - Correct response format
 * - Required fields present
 * - Data types correct
 * - No errors returned
 * 
 * Usage: npx ts-node scripts/verify-challenges.ts
 */

const BASE_URL = 'http://localhost:3000';

interface TestResult {
  challenge: number;
  status: 'PASS' | 'FAIL' | 'SKIP';
  message: string;
  details?: Record<string, unknown>;
}

const results: TestResult[] = [];

async function testChallenge1() {
  console.log('\n🧪 Testing Challenge 1: Customers Without Purchases...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/challenges/customers-no-purchases`);
    
    if (response.status === 501) {
      results.push({
        challenge: 1,
        status: 'SKIP',
        message: 'Not implemented yet'
      });
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Response is not an array');
    }

    if (data.length > 0) {
      const first = data[0];
      if (!('id' in first) || !('name' in first) || !('email' in first)) {
        throw new Error('Missing required fields: id, name, or email');
      }
    }

    results.push({
      challenge: 1,
      status: 'PASS',
      message: `Found ${data.length} customers without purchases`,
      details: { count: data.length, sample: data.slice(0, 2) }
    });
  } catch (error) {
    results.push({
      challenge: 1,
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function testChallenge2() {
  console.log('\n🧪 Testing Challenge 2: Duplicate Lead Emails...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/challenges/duplicate-leads`);
    
    if (response.status === 501) {
      results.push({
        challenge: 2,
        status: 'SKIP',
        message: 'Not implemented yet'
      });
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Response is not an array');
    }

    if (data.length > 0) {
      const first = data[0];
      if (!('email' in first) || !('leadIds' in first)) {
        throw new Error('Missing required fields: email or leadIds');
      }
      if (typeof first.email !== 'string' || typeof first.leadIds !== 'string') {
        throw new Error('email and leadIds must be strings');
      }
    }

    results.push({
      challenge: 2,
      status: 'PASS',
      message: `Found ${data.length} emails with duplicates`,
      details: { count: data.length, sample: data.slice(0, 2) }
    });
  } catch (error) {
    results.push({
      challenge: 2,
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function testChallenge3() {
  console.log('\n🧪 Testing Challenge 3: Product Inventory Report...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/challenges/product-report`);
    
    if (response.status === 501) {
      results.push({
        challenge: 3,
        status: 'SKIP',
        message: 'Not implemented yet'
      });
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Response is not an array');
    }

    if (data.length > 0) {
      const first = data[0];
      if (!('name' in first) || !('currentStock' in first) || !('totalSold' in first)) {
        throw new Error('Missing required fields: name, currentStock, or totalSold');
      }
      if (typeof first.currentStock !== 'number' || typeof first.totalSold !== 'number') {
        throw new Error('currentStock and totalSold must be numbers');
      }
    }

    // Check if sorted by totalSold descending
    let isSorted = true;
    for (let i = 1; i < data.length; i++) {
      if (data[i].totalSold > data[i - 1].totalSold) {
        isSorted = false;
        break;
      }
    }

    results.push({
      challenge: 3,
      status: 'PASS',
      message: `Found ${data.length} products`,
      details: { 
        count: data.length, 
        isSorted, 
        sample: data.slice(0, 2) 
      }
    });
  } catch (error) {
    results.push({
      challenge: 3,
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function testChallenge4() {
  console.log('\n🧪 Testing Challenge 4: Conversion Metrics...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/challenges/conversion-metrics`);
    
    if (response.status === 501) {
      results.push({
        challenge: 4,
        status: 'SKIP',
        message: 'Not implemented yet'
      });
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const requiredFields = ['totalLeads', 'convertedLeads', 'conversionRate', 'averageLeadScore'];
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof data.totalLeads !== 'number' || data.totalLeads < 0) {
      throw new Error('totalLeads must be a non-negative number');
    }

    if (typeof data.conversionRate !== 'number' || data.conversionRate < 0 || data.conversionRate > 100) {
      throw new Error('conversionRate must be a number between 0 and 100');
    }

    results.push({
      challenge: 4,
      status: 'PASS',
      message: `Metrics calculated successfully`,
      details: data
    });
  } catch (error) {
    results.push({
      challenge: 4,
      status: 'FAIL',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function runAllTests() {
  console.log('🚀 Starting CRM Challenge Verification...\n');
  
  await testChallenge1();
  await testChallenge2();
  await testChallenge3();
  await testChallenge4();

  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS\n');

  const summary = {
    passed: results.filter(r => r.status === 'PASS').length,
    failed: results.filter(r => r.status === 'FAIL').length,
    skipped: results.filter(r => r.status === 'SKIP').length
  };

  for (const result of results) {
    const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️';
    console.log(`${icon} Challenge ${result.challenge}: ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\nSummary: ${summary.passed} passed, ${summary.failed} failed, ${summary.skipped} skipped\n`);

  process.exit(summary.failed > 0 ? 1 : 0);
}

// Run if this is the main module
if (import.meta.url === process.argv[1]) {
  runAllTests().catch(console.error);
}

export { testChallenge1, testChallenge2, testChallenge3, testChallenge4 };
