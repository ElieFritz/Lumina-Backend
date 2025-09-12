const http = require('http');

const API_BASE = 'http://localhost:3001/api';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Tests complets de l\'API Lumina Africa\n');

  const tests = [
    {
      name: 'Health Check',
      path: '/health',
      expectedStatus: 200
    },
    {
      name: 'Health Ping',
      path: '/health/ping',
      expectedStatus: 200
    },
    {
      name: 'Venues List',
      path: '/venues',
      expectedStatus: 200
    },
    {
      name: 'Events List',
      path: '/events',
      expectedStatus: 200
    }
  ];

  for (const test of tests) {
    try {
      console.log(`🔍 Test: ${test.name}`);
      const result = await makeRequest(test.path);
      
      if (result.status === test.expectedStatus) {
        console.log(`✅ ${test.name}: OK (${result.status})`);
        if (test.name === 'Health Check' && result.data.service) {
          console.log(`   Service: ${result.data.service}`);
        }
      } else {
        console.log(`❌ ${test.name}: Échec (${result.status} au lieu de ${test.expectedStatus})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Erreur - ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Tests terminés !');
}

runTests();
