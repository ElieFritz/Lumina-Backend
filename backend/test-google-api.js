const axios = require('axios');

const API_KEY = 'AIzaSyA65He8HtRvQO3GsZq_p1swrJH9GmSmWuU';
const baseUrl = 'https://places.googleapis.com/v1/places';

async function testGooglePlacesAPI() {
  console.log('🔍 Test de l\'API Google Places v1...');
  
  const requestBody = {
    textQuery: 'restaurant in Dakar, Sénégal',
    maxResultCount: 2,
    locationBias: {
      radius: 5000,
      center: {
        latitude: 14.6928, // Coordonnées de Dakar
        longitude: -17.4467
      }
    },
    languageCode: 'fr',
    regionCode: 'SN'
  };

  try {
    console.log('📤 Envoi de la requête...');
    console.log('URL:', `${baseUrl}:searchText`);
    console.log('Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post(
      `${baseUrl}:searchText`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': API_KEY,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,places.photos'
        }
      }
    );

    console.log('✅ Succès!');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Erreur:');
    console.log('Status:', error.response?.status);
    console.log('Status Text:', error.response?.statusText);
    console.log('Headers:', error.response?.headers);
    console.log('Data:', error.response?.data);
    console.log('Message:', error.message);
  }
}

testGooglePlacesAPI();
