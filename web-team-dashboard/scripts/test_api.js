const axios = require('axios');

// URL della tua app su Vercel (sostituisci con il tuo URL reale)
const BASE_URL = process.env.VERCEL_URL || 'https://your-app.vercel.app';

async function testAPIs() {
  console.log(`🧪 Testing APIs at: ${BASE_URL}\n`);

  const tests = [
    { name: 'Stats', url: '/api/stats' },
    { name: 'Team Members', url: '/api/team-members' },
    { name: 'Clients', url: '/api/clients' },
    { name: 'Snapshots', url: '/api/snapshots' },
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const response = await axios.get(`${BASE_URL}${test.url}`);
      console.log(`✅ ${test.name}: OK (${response.data?.results?.length || response.data?.length || 'N/A'} items)`);
    } catch (error) {
      console.log(`❌ ${test.name}: FAILED`);
      console.log(`   Status: ${error.response?.status || 'No response'}`);
      console.log(`   Error: ${error.response?.data?.error || error.message}`);
    }
    console.log('');
  }
}

testAPIs();
