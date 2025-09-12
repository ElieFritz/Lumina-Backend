const http = require('http');

function testAPI() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ API Response:', response);
        
        if (response.service === 'Lumina Africa API') {
          console.log('🎉 Backend Lumina Africa fonctionne correctement !');
        } else {
          console.log('⚠️  Le service ne s\'appelle pas encore "Lumina Africa API"');
        }
      } catch (error) {
        console.log('📄 Response (non-JSON):', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur API:', error.message);
    console.log('💡 Assurez-vous que le backend est démarré sur le port 3001');
  });

  req.end();
}

console.log('🔍 Test de l\'API backend...');
testAPI();
