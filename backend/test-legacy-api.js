const axios = require('axios');

const API_KEY = 'AIzaSyA65He8HtRvQO3GsZq_p1swrJH9GmSmWuU';

async function testLegacyAPI() {
  console.log('🔍 Test de l\'API Google Places Legacy...');
  
  const params = {
    key: API_KEY,
    query: 'restaurant in Dakar, Sénégal',
    location: '14.6928,-17.4467',
    radius: 5000,
    language: 'fr'
  };

  try {
    console.log('📤 Envoi de la requête...');
    console.log('URL:', 'https://maps.googleapis.com/maps/api/place/textsearch/json');
    console.log('Params:', JSON.stringify(params, null, 2));
    
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      { params }
    );

    console.log('✅ Succès!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Erreur:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
  }
}

testLegacyAPI();
