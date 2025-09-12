import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { ImportedPlace, PlaceSource, PlaceStatus } from '../entities/imported-place.entity';

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  business_status?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  opening_hours?: {
    open_now: boolean;
    periods: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekday_text: string[];
  };
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  vicinity?: string;
  plus_code?: {
    global_code: string;
    compound_code: string;
  };
}

export interface GooglePlaceDetails extends GooglePlaceResult {
  url?: string;
  utc_offset?: number;
  adr_address?: string;
}

export interface ImportJobConfig {
  location: string; // "lat,lng" or city name
  radius?: number; // in meters, default 5000
  type?: string; // place type
  keyword?: string;
  maxResults?: number; // default 20
}

@Injectable()
export class GooglePlacesService {
  private readonly logger = new Logger(GooglePlacesService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://places.googleapis.com/v1/places';
  private readonly photoBaseUrl = 'https://places.googleapis.com/v1/places';

  // Rate limiting
  private requestCount = 0;
  private lastResetTime = Date.now();
  private readonly maxRequestsPerSecond = 10;
  private readonly maxRequestsPerDay = 100000; // Adjust based on your quota

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GOOGLE_PLACES_API_KEY');
    if (!this.apiKey) {
      this.logger.warn('Google Places API key not configured');
    }
  }

  /**
   * Search for places using Google Places API
   */
  async searchPlaces(config: ImportJobConfig): Promise<GooglePlaceResult[]> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    await this.rateLimitCheck();

    // Essayer d'abord l'API Google Places v1 (New)
    try {
      return await this.searchPlacesV1(config);
    } catch (v1Error) {
      this.logger.warn(`Google Places v1 failed: ${v1Error.message}`);
      
      // Essayer l'API Google Places Legacy
      try {
        return await this.searchPlacesLegacy(config);
      } catch (legacyError) {
        this.logger.warn(`Google Places Legacy failed: ${legacyError.message}`);
        
        // En dernier recours, utiliser les données mock
        this.logger.warn('Falling back to mock data due to API errors');
        return this.getMockPlaces(config);
      }
    }
  }

  /**
   * Search using Google Places API v1 (New)
   */
  private async searchPlacesV1(config: ImportJobConfig): Promise<GooglePlaceResult[]> {
    const searchText = config.type 
      ? `${config.type} in ${config.location}`
      : `places in ${config.location}`;

    // Obtenir les coordonnées de la ville
    const coordinates = await this.getCityCoordinates(config.location);

    const requestBody = {
      textQuery: searchText,
      maxResultCount: config.maxResults || 20,
      locationBias: {
        radius: config.radius || 5000,
        center: {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        }
      },
      includedType: config.type || undefined,
      languageCode: 'fr',
      regionCode: this.getRegionCode(config.location)
    };

    const response = await axios.post(
      `${this.baseUrl}:searchText`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.rating,places.userRatingCount,places.priceLevel,places.businessStatus,places.photos'
        }
      }
    );

    this.requestCount++;
    this.logger.log(`Google Places v1 API request #${this.requestCount} - Found ${response.data.places?.length || 0} places`);

    // Transformation des données de l'API vers notre format
    const places: GooglePlaceResult[] = (response.data.places || []).map((place: any) => ({
      place_id: place.id,
      name: place.displayName?.text || 'Nom non disponible',
      formatted_address: place.formattedAddress || 'Adresse non disponible',
      geometry: {
        location: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0
        }
      },
      types: place.types || [],
      rating: place.rating || 0,
      user_ratings_total: place.userRatingCount || 0,
      price_level: place.priceLevel || 0,
      business_status: place.businessStatus || 'OPERATIONAL',
      photos: (place.photos || []).map((photo: any) => ({
        photo_reference: photo.name,
        height: photo.heightPx || 400,
        width: photo.widthPx || 400
      }))
    }));

    return places;
  }

  /**
   * Search using Google Places Legacy API
   */
  private async searchPlacesLegacy(config: ImportJobConfig): Promise<GooglePlaceResult[]> {
    const query = config.type 
      ? `${config.type} in ${config.location}`
      : `places in ${config.location}`;

    // Obtenir les coordonnées de la ville
    const coordinates = await this.getCityCoordinates(config.location);

    const params = {
      key: this.apiKey,
      query: query,
      location: `${coordinates.lat},${coordinates.lng}`,
      radius: config.radius || 5000,
      language: 'fr'
    };

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      { params }
    );

    this.requestCount++;
    this.logger.log(`Google Places Legacy API request #${this.requestCount} - Found ${response.data.results?.length || 0} places`);

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places Legacy API error: ${response.data.status} - ${response.data.error_message}`);
    }

    // Transformation des données de l'API Legacy vers notre format
    const places: GooglePlaceResult[] = (response.data.results || []).map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      formatted_address: place.formatted_address,
      geometry: {
        location: {
          lat: place.geometry?.location?.lat || 0,
          lng: place.geometry?.location?.lng || 0
        }
      },
      types: place.types || [],
      rating: place.rating || 0,
      user_ratings_total: place.user_ratings_total || 0,
      price_level: place.price_level || 0,
      business_status: place.business_status || 'OPERATIONAL',
      photos: (place.photos || []).map((photo: any) => ({
        photo_reference: photo.photo_reference,
        height: photo.height || 400,
        width: photo.width || 400
      }))
    }));

    return places;
  }

  /**
   * Get detailed information about a specific place
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
    if (!this.apiKey) {
      throw new Error('Google Places API key not configured');
    }

    await this.rateLimitCheck();

    const fields = [
      'place_id',
      'name',
      'formatted_address',
      'geometry',
      'types',
      'rating',
      'user_ratings_total',
      'price_level',
      'business_status',
      'photos',
      'opening_hours',
      'formatted_phone_number',
      'international_phone_number',
      'website',
      'vicinity',
      'plus_code',
      'url',
      'utc_offset',
      'adr_address',
    ].join(',');

    const params = {
      key: this.apiKey,
      place_id: placeId,
      fields,
    };

    try {
      const response: AxiosResponse = await axios.get(
        `${this.baseUrl}/details/json`,
        { params }
      );

      this.requestCount++;
      this.logger.log(`Google Places Details API request #${this.requestCount}`);

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places Details API error: ${response.data.status} - ${response.data.error_message}`);
      }

      return response.data.result;
    } catch (error) {
      this.logger.error('Error getting place details:', error.message);
      throw error;
    }
  }

  /**
   * Get photo URL from photo reference
   */
  getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
    if (!this.apiKey) {
      return null;
    }

    return `${this.photoBaseUrl}?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }

  /**
   * Convert Google Place to ImportedPlace entity
   */
  convertToImportedPlace(googlePlace: GooglePlaceDetails): Partial<ImportedPlace> {
    const place: Partial<ImportedPlace> = {
      placeId: googlePlace.place_id,
      name: googlePlace.name,
      address: googlePlace.formatted_address || googlePlace.vicinity,
      lat: googlePlace.geometry?.location?.lat,
      lng: googlePlace.geometry?.location?.lng,
      phone: googlePlace.formatted_phone_number || googlePlace.international_phone_number,
      website: googlePlace.website,
      googleTypes: googlePlace.types || [],
      categories: this.mapGoogleTypesToCategories(googlePlace.types || []),
      rating: googlePlace.rating,
      userRatingsTotal: googlePlace.user_ratings_total,
      openingHours: googlePlace.opening_hours,
      photoReferences: googlePlace.photos?.map(p => p.photo_reference) || [],
      photoUrls: googlePlace.photos?.map(p => this.getPhotoUrl(p.photo_reference)) || [],
      businessStatus: googlePlace.business_status,
      priceLevel: googlePlace.price_level,
      source: PlaceSource.GOOGLE_PLACES,
      status: PlaceStatus.IMPORTED,
      googleMapsUrl: googlePlace.url,
      metadata: {
        vicinity: googlePlace.vicinity,
        formatted_address: googlePlace.formatted_address,
        place_id: googlePlace.place_id,
        plus_code: googlePlace.plus_code,
        utc_offset: googlePlace.utc_offset,
        adr_address: googlePlace.adr_address,
      },
    };

    return place;
  }

  /**
   * Map Google Place types to internal categories
   */
  private mapGoogleTypesToCategories(googleTypes: string[]): string[] {
    const categoryMapping = {
      // Restaurants
      'restaurant': 'restaurant',
      'food': 'restaurant',
      'meal_takeaway': 'restaurant',
      'meal_delivery': 'restaurant',
      'cafe': 'restaurant',
      'bakery': 'restaurant',
      
      // Entertainment
      'movie_theater': 'cinema',
      'amusement_park': 'entertainment',
      'aquarium': 'entertainment',
      'art_gallery': 'entertainment',
      'bowling_alley': 'entertainment',
      'casino': 'entertainment',
      'museum': 'entertainment',
      'zoo': 'entertainment',
      
      // Nightlife
      'bar': 'bar',
      'night_club': 'club',
      'lounge': 'lounge',
      
      // Music & Events
      'concert_hall': 'concert_hall',
      'music_venue': 'concert_hall',
      'theater': 'theater',
      'stadium': 'sports',
      'gym': 'sports',
      'sports_complex': 'sports',
      
      // Shopping & Services
      'shopping_mall': 'shopping',
      'store': 'shopping',
      'beauty_salon': 'services',
      'spa': 'services',
    };

    const categories = new Set<string>();
    
    googleTypes.forEach(type => {
      const category = categoryMapping[type];
      if (category) {
        categories.add(category);
      }
    });

    // Default category if no mapping found
    if (categories.size === 0) {
      categories.add('other');
    }

    return Array.from(categories);
  }

  /**
   * Rate limiting to respect Google API quotas
   */
  private async rateLimitCheck(): Promise<void> {
    const now = Date.now();
    
    // Reset counter every second
    if (now - this.lastResetTime >= 1000) {
      this.requestCount = 0;
      this.lastResetTime = now;
    }

    // Check per-second limit
    if (this.requestCount >= this.maxRequestsPerSecond) {
      const waitTime = 1000 - (now - this.lastResetTime);
      this.logger.log(`Rate limit reached, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Get API usage statistics
   */
  getApiUsageStats(): { requestCount: number; lastResetTime: number } {
    return {
      requestCount: this.requestCount,
      lastResetTime: this.lastResetTime,
    };
  }

  /**
   * Reset API usage counter (for testing)
   */
  resetApiUsage(): void {
    this.requestCount = 0;
    this.lastResetTime = Date.now();
  }

  /**
   * Get city coordinates from city name
   */
  private async getCityCoordinates(location: string): Promise<{ lat: number; lng: number }> {
    // Base de données de coordonnées pour les principales villes africaines
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Abidjan': { lat: 5.3599, lng: -4.0083 },
      'Dakar': { lat: 14.6928, lng: -17.4467 },
      'Casablanca': { lat: 33.5731, lng: -7.5898 },
      'Rabat': { lat: 34.0209, lng: -6.8416 },
      'Tunis': { lat: 36.8065, lng: 10.1815 },
      'Alger': { lat: 36.7372, lng: 3.0865 },
      'Cairo': { lat: 30.0444, lng: 31.2357 },
      'Lagos': { lat: 6.5244, lng: 3.3792 },
      'Accra': { lat: 5.6037, lng: -0.1870 },
      'Nairobi': { lat: -1.2921, lng: 36.8219 },
      'Addis Ababa': { lat: 9.1450, lng: 38.7667 },
      'Kampala': { lat: 0.3476, lng: 32.5825 },
      'Kigali': { lat: -1.9441, lng: 30.0619 },
      'Dar es Salaam': { lat: -6.7924, lng: 39.2083 },
      'Johannesburg': { lat: -26.2041, lng: 28.0473 },
      'Cape Town': { lat: -33.9249, lng: 18.4241 },
      'Bamako': { lat: 12.6392, lng: -8.0029 },
      'Ouagadougou': { lat: 12.3714, lng: -1.5197 },
      'Niamey': { lat: 13.5137, lng: 2.1098 },
      'Yaoundé': { lat: 3.8480, lng: 11.5021 },
      'Douala': { lat: 4.0483, lng: 9.7043 },
      'Kinshasa': { lat: -4.4419, lng: 15.2663 },
      'Brazzaville': { lat: -4.2634, lng: 15.2429 },
      'Libreville': { lat: 0.4162, lng: 9.4673 },
      'Bangui': { lat: 4.3947, lng: 18.5582 },
      'N\'Djamena': { lat: 12.1348, lng: 15.0557 },
      'Khartoum': { lat: 15.5007, lng: 32.5599 },
      'Juba': { lat: 4.8594, lng: 31.5713 },
      'Asmara': { lat: 15.3229, lng: 38.9251 },
      'Djibouti': { lat: 11.8251, lng: 42.5903 },
      'Mogadishu': { lat: 2.0469, lng: 45.3182 },
      'Antananarivo': { lat: -18.8792, lng: 47.5079 },
      'Port Louis': { lat: -20.1619, lng: 57.4989 },
      'Victoria': { lat: -4.6203, lng: 55.4550 },
      'Moroni': { lat: -11.7172, lng: 43.2473 },
      'Maputo': { lat: -25.9692, lng: 32.5732 },
      'Lilongwe': { lat: -13.9626, lng: 33.7741 },
      'Lusaka': { lat: -15.3875, lng: 28.3228 },
      'Harare': { lat: -17.8252, lng: 31.0335 },
      'Gaborone': { lat: -24.6282, lng: 25.9231 },
      'Windhoek': { lat: -22.5609, lng: 17.0658 },
      'Maseru': { lat: -29.3167, lng: 27.4833 },
      'Mbabane': { lat: -26.3054, lng: 31.1367 },
      'São Tomé': { lat: 0.1864, lng: 6.6131 },
      'Malabo': { lat: 3.7504, lng: 8.7371 },
      'Banjul': { lat: 13.4549, lng: -16.5790 },
      'Bissau': { lat: 11.8037, lng: -15.1804 },
      'Conakry': { lat: 9.6412, lng: -13.5784 },
      'Freetown': { lat: 8.4840, lng: -13.2299 },
      'Monrovia': { lat: 6.3008, lng: -10.7970 },
      'Yamoussoukro': { lat: 6.8276, lng: -5.2893 },
      'Bouaké': { lat: 7.6900, lng: -5.0300 },
      'San-Pédro': { lat: 4.7485, lng: -6.6363 },
      'Korogho': { lat: 9.4581, lng: -5.6296 },
      'Man': { lat: 7.4125, lng: -7.5538 },
      'Gagnoa': { lat: 6.1287, lng: -5.9506 },
      'Divo': { lat: 5.8374, lng: -5.3572 },
      'Anyama': { lat: 5.4942, lng: -4.0519 },
      'Agboville': { lat: 5.9342, lng: -4.2219 },
      'Grand-Bassam': { lat: 5.2008, lng: -3.7364 },
      'Bingerville': { lat: 5.3553, lng: -3.8981 },
      'Dabou': { lat: 5.3256, lng: -4.3769 },
      'Tiassalé': { lat: 5.8981, lng: -4.8269 },
      'Toumodi': { lat: 6.5528, lng: -5.0175 },
      'Bondoukou': { lat: 8.0403, lng: -2.8000 },
      'Bouna': { lat: 9.2667, lng: -3.0000 },
      'Odienné': { lat: 9.5000, lng: -7.5667 },
      'Ferkessédougou': { lat: 9.6000, lng: -5.2000 },
      'Katiola': { lat: 8.1333, lng: -5.1000 },
      'Boundiali': { lat: 9.5167, lng: -6.4833 },
      'Séguéla': { lat: 7.9667, lng: -6.6667 },
      'Vavoua': { lat: 7.3833, lng: -6.4667 },
      'Zuénoula': { lat: 7.4333, lng: -6.0500 },
      'Sinfra': { lat: 6.6167, lng: -5.9167 },
      'Issia': { lat: 6.4833, lng: -6.5833 },
      'Daloa': { lat: 6.8833, lng: -6.4500 },
      'Soubré': { lat: 5.7833, lng: -6.6000 },
      'Méagui': { lat: 5.5167, lng: -7.1333 },
      'Tabou': { lat: 4.4167, lng: -7.3500 },
      'Sassandra': { lat: 4.9500, lng: -6.0833 },
      'Fresco': { lat: 5.0667, lng: -5.5667 },
      'Jacqueville': { lat: 5.2000, lng: -4.4167 },
      'Adiaké': { lat: 5.2833, lng: -3.3000 },
      'Bonoua': { lat: 5.2667, lng: -3.6000 },
      'Aboisso': { lat: 5.4667, lng: -3.2000 },
      'Ayamé': { lat: 5.6000, lng: -3.1667 },
      'Agnibilékrou': { lat: 7.1333, lng: -3.2000 },
      'M\'Bahiakro': { lat: 7.4500, lng: -4.3333 },
      'Daoukro': { lat: 7.7500, lng: -3.9667 },
      'Arrah': { lat: 6.6667, lng: -3.9667 },
      'Bocanda': { lat: 7.0500, lng: -4.5000 },
      'Dimbokro': { lat: 6.6500, lng: -4.7000 },
      'M\'Batto': { lat: 6.2667, lng: -4.7000 },
      'Touba': { lat: 8.2833, lng: -7.6833 },
      'Kouto': { lat: 9.8833, lng: -6.4000 },
      'Tengréla': { lat: 10.4833, lng: -6.4000 },
      'Ouangolodougou': { lat: 9.9667, lng: -5.1500 },
      'Korhogo': { lat: 9.4581, lng: -5.6296 },
      'Sinématiali': { lat: 9.6167, lng: -5.6167 },
      'Niakaramandougou': { lat: 8.6667, lng: -5.2833 }
    };

    // Rechercher la ville dans notre base de données
    const normalizedLocation = location.toLowerCase().trim();
    
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (normalizedLocation.includes(cityName.toLowerCase())) {
        return coords;
      }
    }

    // Si la ville n'est pas trouvée, utiliser les coordonnées d'Abidjan par défaut
    this.logger.warn(`City coordinates not found for "${location}", using Abidjan coordinates`);
    return { lat: 5.3599, lng: -4.0083 };
  }

  /**
   * Get region code from city name
   */
  private getRegionCode(location: string): string {
    const regionMapping: { [key: string]: string } = {
      'Abidjan': 'CI',
      'Dakar': 'SN',
      'Casablanca': 'MA',
      'Rabat': 'MA',
      'Tunis': 'TN',
      'Alger': 'DZ',
      'Cairo': 'EG',
      'Lagos': 'NG',
      'Accra': 'GH',
      'Nairobi': 'KE',
      'Addis Ababa': 'ET',
      'Kampala': 'UG',
      'Kigali': 'RW',
      'Dar es Salaam': 'TZ',
      'Johannesburg': 'ZA',
      'Cape Town': 'ZA',
      'Bamako': 'ML',
      'Ouagadougou': 'BF',
      'Niamey': 'NE',
      'Yaoundé': 'CM',
      'Douala': 'CM',
      'Kinshasa': 'CD',
      'Brazzaville': 'CG',
      'Libreville': 'GA',
      'Bangui': 'CF',
      'N\'Djamena': 'TD',
      'Khartoum': 'SD',
      'Juba': 'SS',
      'Asmara': 'ER',
      'Djibouti': 'DJ',
      'Mogadishu': 'SO',
      'Antananarivo': 'MG',
      'Port Louis': 'MU',
      'Victoria': 'SC',
      'Moroni': 'KM',
      'Maputo': 'MZ',
      'Lilongwe': 'MW',
      'Lusaka': 'ZM',
      'Harare': 'ZW',
      'Gaborone': 'BW',
      'Windhoek': 'NA',
      'Maseru': 'LS',
      'Mbabane': 'SZ',
      'São Tomé': 'ST',
      'Malabo': 'GQ',
      'Banjul': 'GM',
      'Bissau': 'GW',
      'Conakry': 'GN',
      'Freetown': 'SL',
      'Monrovia': 'LR'
    };

    const normalizedLocation = location.toLowerCase().trim();
    
    for (const [cityName, regionCode] of Object.entries(regionMapping)) {
      if (normalizedLocation.includes(cityName.toLowerCase())) {
        return regionCode;
      }
    }

    // Par défaut, utiliser le code de la Côte d'Ivoire
    return 'CI';
  }

  /**
   * Get mock places data as fallback
   */
  private getMockPlaces(config: ImportJobConfig): GooglePlaceResult[] {
    // Obtenir les coordonnées de la ville
    const coordinates = this.getCityCoordinatesSync(config.location);
    const cityName = this.getCityName(config.location);
    const country = this.getCountryName(config.location);

    // Générer des lieux mock adaptés à la ville demandée
    const mockPlaces: GooglePlaceResult[] = this.generateMockPlacesForCity(
      cityName, 
      country, 
      coordinates, 
      config.type
    );

    const maxResults = config.maxResults || 20;
    return mockPlaces.slice(0, maxResults);
  }

  /**
   * Get city coordinates synchronously (for mock data)
   */
  private getCityCoordinatesSync(location: string): { lat: number; lng: number } {
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'Abidjan': { lat: 5.3599, lng: -4.0083 },
      'Dakar': { lat: 14.6928, lng: -17.4467 },
      'Casablanca': { lat: 33.5731, lng: -7.5898 },
      'Rabat': { lat: 34.0209, lng: -6.8416 },
      'Tunis': { lat: 36.8065, lng: 10.1815 },
      'Alger': { lat: 36.7372, lng: 3.0865 },
      'Cairo': { lat: 30.0444, lng: 31.2357 },
      'Lagos': { lat: 6.5244, lng: 3.3792 },
      'Accra': { lat: 5.6037, lng: -0.1870 },
      'Nairobi': { lat: -1.2921, lng: 36.8219 },
      'Addis Ababa': { lat: 9.1450, lng: 38.7667 },
      'Kampala': { lat: 0.3476, lng: 32.5825 },
      'Kigali': { lat: -1.9441, lng: 30.0619 },
      'Dar es Salaam': { lat: -6.7924, lng: 39.2083 },
      'Johannesburg': { lat: -26.2041, lng: 28.0473 },
      'Cape Town': { lat: -33.9249, lng: 18.4241 },
      'Bamako': { lat: 12.6392, lng: -8.0029 },
      'Ouagadougou': { lat: 12.3714, lng: -1.5197 },
      'Niamey': { lat: 13.5137, lng: 2.1098 },
      'Yaoundé': { lat: 3.8480, lng: 11.5021 },
      'Douala': { lat: 4.0483, lng: 9.7043 },
      'Kinshasa': { lat: -4.4419, lng: 15.2663 },
      'Brazzaville': { lat: -4.2634, lng: 15.2429 },
      'Libreville': { lat: 0.4162, lng: 9.4673 },
      'Bangui': { lat: 4.3947, lng: 18.5582 },
      'N\'Djamena': { lat: 12.1348, lng: 15.0557 },
      'Khartoum': { lat: 15.5007, lng: 32.5599 },
      'Juba': { lat: 4.8594, lng: 31.5713 },
      'Asmara': { lat: 15.3229, lng: 38.9251 },
      'Djibouti': { lat: 11.8251, lng: 42.5903 },
      'Mogadishu': { lat: 2.0469, lng: 45.3182 },
      'Antananarivo': { lat: -18.8792, lng: 47.5079 },
      'Port Louis': { lat: -20.1619, lng: 57.4989 },
      'Victoria': { lat: -4.6203, lng: 55.4550 },
      'Moroni': { lat: -11.7172, lng: 43.2473 },
      'Maputo': { lat: -25.9692, lng: 32.5732 },
      'Lilongwe': { lat: -13.9626, lng: 33.7741 },
      'Lusaka': { lat: -15.3875, lng: 28.3228 },
      'Harare': { lat: -17.8252, lng: 31.0335 },
      'Gaborone': { lat: -24.6282, lng: 25.9231 },
      'Windhoek': { lat: -22.5609, lng: 17.0658 },
      'Maseru': { lat: -29.3167, lng: 27.4833 },
      'Mbabane': { lat: -26.3054, lng: 31.1367 },
      'São Tomé': { lat: 0.1864, lng: 6.6131 },
      'Malabo': { lat: 3.7504, lng: 8.7371 },
      'Banjul': { lat: 13.4549, lng: -16.5790 },
      'Bissau': { lat: 11.8037, lng: -15.1804 },
      'Conakry': { lat: 9.6412, lng: -13.5784 },
      'Freetown': { lat: 8.4840, lng: -13.2299 },
      'Monrovia': { lat: 6.3008, lng: -10.7970 }
    };

    const normalizedLocation = location.toLowerCase().trim();
    
    for (const [cityName, coords] of Object.entries(cityCoordinates)) {
      if (normalizedLocation.includes(cityName.toLowerCase())) {
        return coords;
      }
    }

    return { lat: 5.3599, lng: -4.0083 }; // Abidjan par défaut
  }

  /**
   * Get city name from location string
   */
  private getCityName(location: string): string {
    const normalizedLocation = location.toLowerCase().trim();
    
    const cityNames = [
      'Abidjan', 'Dakar', 'Casablanca', 'Rabat', 'Tunis', 'Alger', 'Cairo', 
      'Lagos', 'Accra', 'Nairobi', 'Addis Ababa', 'Kampala', 'Kigali', 
      'Dar es Salaam', 'Johannesburg', 'Cape Town', 'Bamako', 'Ouagadougou', 
      'Niamey', 'Yaoundé', 'Douala', 'Kinshasa', 'Brazzaville', 'Libreville', 
      'Bangui', 'N\'Djamena', 'Khartoum', 'Juba', 'Asmara', 'Djibouti', 
      'Mogadishu', 'Antananarivo', 'Port Louis', 'Victoria', 'Moroni', 
      'Maputo', 'Lilongwe', 'Lusaka', 'Harare', 'Gaborone', 'Windhoek', 
      'Maseru', 'Mbabane', 'São Tomé', 'Malabo', 'Banjul', 'Bissau', 
      'Conakry', 'Freetown', 'Monrovia'
    ];

    for (const cityName of cityNames) {
      if (normalizedLocation.includes(cityName.toLowerCase())) {
        return cityName;
      }
    }

    return 'Abidjan'; // Par défaut
  }

  /**
   * Get country name from location string
   */
  private getCountryName(location: string): string {
    const cityCountryMapping: { [key: string]: string } = {
      'Abidjan': 'Côte d\'Ivoire',
      'Dakar': 'Sénégal',
      'Casablanca': 'Maroc',
      'Rabat': 'Maroc',
      'Tunis': 'Tunisie',
      'Alger': 'Algérie',
      'Cairo': 'Égypte',
      'Lagos': 'Nigeria',
      'Accra': 'Ghana',
      'Nairobi': 'Kenya',
      'Addis Ababa': 'Éthiopie',
      'Kampala': 'Ouganda',
      'Kigali': 'Rwanda',
      'Dar es Salaam': 'Tanzanie',
      'Johannesburg': 'Afrique du Sud',
      'Cape Town': 'Afrique du Sud',
      'Bamako': 'Mali',
      'Ouagadougou': 'Burkina Faso',
      'Niamey': 'Niger',
      'Yaoundé': 'Cameroun',
      'Douala': 'Cameroun',
      'Kinshasa': 'République Démocratique du Congo',
      'Brazzaville': 'République du Congo',
      'Libreville': 'Gabon',
      'Bangui': 'République Centrafricaine',
      'N\'Djamena': 'Tchad',
      'Khartoum': 'Soudan',
      'Juba': 'Soudan du Sud',
      'Asmara': 'Érythrée',
      'Djibouti': 'Djibouti',
      'Mogadishu': 'Somalie',
      'Antananarivo': 'Madagascar',
      'Port Louis': 'Maurice',
      'Victoria': 'Seychelles',
      'Moroni': 'Comores',
      'Maputo': 'Mozambique',
      'Lilongwe': 'Malawi',
      'Lusaka': 'Zambie',
      'Harare': 'Zimbabwe',
      'Gaborone': 'Botswana',
      'Windhoek': 'Namibie',
      'Maseru': 'Lesotho',
      'Mbabane': 'Eswatini',
      'São Tomé': 'São Tomé-et-Príncipe',
      'Malabo': 'Guinée équatoriale',
      'Banjul': 'Gambie',
      'Bissau': 'Guinée-Bissau',
      'Conakry': 'Guinée',
      'Freetown': 'Sierra Leone',
      'Monrovia': 'Libéria'
    };

    const cityName = this.getCityName(location);
    return cityCountryMapping[cityName] || 'Côte d\'Ivoire';
  }

  /**
   * Generate mock places for a specific city
   */
  private generateMockPlacesForCity(
    cityName: string, 
    country: string, 
    coordinates: { lat: number; lng: number },
    type?: string
  ): GooglePlaceResult[] {
    const basePlaces = [
      {
        name: 'Restaurant Le Baobab',
        address: '123 Avenue de la République',
        types: ['restaurant', 'food', 'establishment'],
        rating: 4.5,
        user_ratings_total: 127,
        price_level: 2
      },
      {
        name: 'Café de la Paix',
        address: '456 Boulevard de la Paix',
        types: ['cafe', 'food', 'establishment'],
        rating: 4.2,
        user_ratings_total: 89,
        price_level: 1
      },
      {
        name: 'Restaurant Chez Maman',
        address: '789 Rue des Cocotiers',
        types: ['restaurant', 'food', 'establishment'],
        rating: 4.7,
        user_ratings_total: 203,
        price_level: 2
      },
      {
        name: 'Pizzeria Italiana',
        address: '321 Avenue Franchet d\'Esperey',
        types: ['restaurant', 'food', 'establishment'],
        rating: 4.0,
        user_ratings_total: 156,
        price_level: 2
      },
      {
        name: 'Fast Food Quick',
        address: '654 Boulevard de la République',
        types: ['restaurant', 'food', 'establishment'],
        rating: 3.8,
        user_ratings_total: 94,
        price_level: 1
      },
      {
        name: 'Bar Le Soleil',
        address: '987 Rue de la Liberté',
        types: ['bar', 'establishment'],
        rating: 4.1,
        user_ratings_total: 67,
        price_level: 2
      },
      {
        name: 'Club Nocturne',
        address: '147 Avenue des Palmiers',
        types: ['night_club', 'establishment'],
        rating: 4.3,
        user_ratings_total: 145,
        price_level: 3
      },
      {
        name: 'Cinéma Central',
        address: '258 Place de l\'Indépendance',
        types: ['movie_theater', 'establishment'],
        rating: 4.0,
        user_ratings_total: 234,
        price_level: 2
      },
      {
        name: 'Musée National',
        address: '369 Boulevard de la Culture',
        types: ['museum', 'establishment'],
        rating: 4.6,
        user_ratings_total: 89,
        price_level: 1
      },
      {
        name: 'Centre Commercial',
        address: '741 Avenue du Commerce',
        types: ['shopping_mall', 'establishment'],
        rating: 3.9,
        user_ratings_total: 312,
        price_level: 2
      }
    ];

    // Filtrer par type si spécifié
    const filteredPlaces = type 
      ? basePlaces.filter(place => place.types.includes(type))
      : basePlaces;

    // Générer des lieux avec des coordonnées légèrement différentes
    return filteredPlaces.map((place, index) => ({
      place_id: `ChIJ${cityName.replace(/\s+/g, '')}${index + 1}`,
      name: place.name,
      formatted_address: `${place.address}, ${cityName}, ${country}`,
      geometry: {
        location: {
          lat: coordinates.lat + (Math.random() - 0.5) * 0.01,
          lng: coordinates.lng + (Math.random() - 0.5) * 0.01
        }
      },
      types: place.types,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      business_status: 'OPERATIONAL',
      photos: [{
        photo_reference: `photo_ref_${cityName.replace(/\s+/g, '')}_${index + 1}`,
        height: 400,
        width: 400
      }]
    }));
  }
}
