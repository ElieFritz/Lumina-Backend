import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportedPlace, PlaceStatus, PlaceSource } from '../entities/imported-place.entity';
import { GooglePlacesService, ImportJobConfig } from './google-places.service';

export interface ImportJobResult {
  totalFound: number;
  newPlaces: number;
  updatedPlaces: number;
  skippedPlaces: number;
  errors: string[];
  duration: number;
}

export interface ImportJobOptions {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
  maxResults?: number;
  updateExisting?: boolean;
  dryRun?: boolean;
}

@Injectable()
export class PlacesImportService {
  private readonly logger = new Logger(PlacesImportService.name);

  constructor(
    @InjectRepository(ImportedPlace)
    private importedPlaceRepository: Repository<ImportedPlace>,
    private googlePlacesService: GooglePlacesService,
  ) {}

  /**
   * Import places from Google Places API
   */
  async importPlaces(options: ImportJobOptions): Promise<ImportJobResult> {
    const startTime = Date.now();
    const result: ImportJobResult = {
      totalFound: 0,
      newPlaces: 0,
      updatedPlaces: 0,
      skippedPlaces: 0,
      errors: [],
      duration: 0,
    };

    try {
      this.logger.log(`Starting import job for location: ${options.location}`);

      const config: ImportJobConfig = {
        location: options.location,
        radius: options.radius || 5000,
        type: options.type,
        keyword: options.keyword,
        maxResults: options.maxResults || 20,
      };

      // Search for places
      const places = await this.googlePlacesService.searchPlaces(config);
      result.totalFound = places.length;

      this.logger.log(`Found ${places.length} places to process`);

      // Process each place
      for (const place of places) {
        try {
          await this.processPlace(place, options, result);
        } catch (error) {
          this.logger.error(`Error processing place ${place.place_id}:`, error.message);
          result.errors.push(`Place ${place.place_id}: ${error.message}`);
        }
      }

      result.duration = Date.now() - startTime;
      this.logger.log(`Import job completed in ${result.duration}ms`);
      this.logger.log(`Results: ${result.newPlaces} new, ${result.updatedPlaces} updated, ${result.skippedPlaces} skipped`);

    } catch (error) {
      this.logger.error('Import job failed:', error.message);
      result.errors.push(`Import job failed: ${error.message}`);
      result.duration = Date.now() - startTime;
    }

    return result;
  }

  /**
   * Process a single place
   */
  private async processPlace(
    place: any,
    options: ImportJobOptions,
    result: ImportJobResult,
  ): Promise<void> {
    // Check if place already exists
    const existingPlace = await this.importedPlaceRepository.findOne({
      where: { placeId: place.place_id },
    });

    if (existingPlace) {
      if (options.updateExisting) {
        // Get detailed information and update
        const detailedPlace = await this.googlePlacesService.getPlaceDetails(place.place_id);
        const updatedData = this.googlePlacesService.convertToImportedPlace(detailedPlace);
        
        if (!options.dryRun) {
          await this.importedPlaceRepository.update(existingPlace.id, {
            ...updatedData,
            lastChecked: new Date(),
          });
        }
        
        result.updatedPlaces++;
        this.logger.log(`Updated place: ${place.name}`);
      } else {
        result.skippedPlaces++;
        this.logger.log(`Skipped existing place: ${place.name}`);
      }
      return;
    }

    // New place - get detailed information
    const detailedPlace = await this.googlePlacesService.getPlaceDetails(place.place_id);
    const placeData = this.googlePlacesService.convertToImportedPlace(detailedPlace);

    if (!options.dryRun) {
      const newPlace = this.importedPlaceRepository.create(placeData);
      await this.importedPlaceRepository.save(newPlace);
    }

    result.newPlaces++;
    this.logger.log(`Imported new place: ${place.name}`);
  }

  /**
   * Import places by city/region
   */
  async importByCity(cityName: string, options: Partial<ImportJobOptions> = {}): Promise<ImportJobResult> {
    const importOptions: ImportJobOptions = {
      location: cityName,
      radius: 10000, // 10km radius for cities
      maxResults: 60, // More results for cities
      updateExisting: true,
      ...options,
    };

    return this.importPlaces(importOptions);
  }

  /**
   * Import places by coordinates
   */
  async importByCoordinates(
    lat: number,
    lng: number,
    radius: number = 5000,
    options: Partial<ImportJobOptions> = {},
  ): Promise<ImportJobResult> {
    const importOptions: ImportJobOptions = {
      location: `${lat},${lng}`,
      radius,
      updateExisting: true,
      ...options,
    };

    return this.importPlaces(importOptions);
  }

  /**
   * Import places by category
   */
  async importByCategory(
    category: string,
    location: string,
    options: Partial<ImportJobOptions> = {},
  ): Promise<ImportJobResult> {
    const importOptions: ImportJobOptions = {
      location,
      type: category,
      maxResults: 20,
      updateExisting: true,
      ...options,
    };

    return this.importPlaces(importOptions);
  }

  /**
   * Bulk import for multiple locations
   */
  async bulkImport(locations: Array<{ location: string; radius?: number; type?: string }>): Promise<ImportJobResult[]> {
    const results: ImportJobResult[] = [];

    for (const location of locations) {
      try {
        const result = await this.importPlaces({
          location: location.location,
          radius: location.radius || 5000,
          type: location.type,
          updateExisting: true,
        });
        results.push(result);
      } catch (error) {
        this.logger.error(`Bulk import failed for ${location.location}:`, error.message);
        results.push({
          totalFound: 0,
          newPlaces: 0,
          updatedPlaces: 0,
          skippedPlaces: 0,
          errors: [error.message],
          duration: 0,
        });
      }
    }

    return results;
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalPlaces: number;
    byStatus: Record<PlaceStatus, number>;
    bySource: Record<PlaceSource, number>;
    recentImports: number;
  }> {
    const totalPlaces = await this.importedPlaceRepository.count();

    const byStatus = await this.importedPlaceRepository
      .createQueryBuilder('place')
      .select('place.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('place.status')
      .getRawMany();

    const bySource = await this.importedPlaceRepository
      .createQueryBuilder('place')
      .select('place.source', 'source')
      .addSelect('COUNT(*)', 'count')
      .groupBy('place.source')
      .getRawMany();

    const recentImports = await this.importedPlaceRepository
      .createQueryBuilder('place')
      .where('place.importDate >= :date', { date: new Date(Date.now() - 24 * 60 * 60 * 1000) })
      .getCount();

    return {
      totalPlaces,
      byStatus: byStatus.reduce((acc, item) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {} as Record<PlaceStatus, number>),
      bySource: bySource.reduce((acc, item) => {
        acc[item.source] = parseInt(item.count);
        return acc;
      }, {} as Record<PlaceSource, number>),
      recentImports,
    };
  }

  /**
   * Clean up old imported places (optional maintenance)
   */
  async cleanupOldPlaces(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const result = await this.importedPlaceRepository
      .createQueryBuilder()
      .delete()
      .where('status = :status', { status: PlaceStatus.IMPORTED })
      .andWhere('importDate < :cutoffDate', { cutoffDate })
      .andWhere('ownerId IS NULL') // Don't delete claimed places
      .execute();

    this.logger.log(`Cleaned up ${result.affected} old imported places`);
    return result.affected || 0;
  }

  /**
   * Reimport a specific place
   */
  async reimportPlace(placeId: string): Promise<ImportedPlace> {
    const existingPlace = await this.importedPlaceRepository.findOne({
      where: { placeId },
    });

    if (!existingPlace) {
      throw new Error(`Place with ID ${placeId} not found`);
    }

    const detailedPlace = await this.googlePlacesService.getPlaceDetails(placeId);
    const updatedData = this.googlePlacesService.convertToImportedPlace(detailedPlace);

    await this.importedPlaceRepository.update(existingPlace.id, {
      ...updatedData,
      lastChecked: new Date(),
    });

    return this.importedPlaceRepository.findOne({ where: { id: existingPlace.id } });
  }

  /**
   * Find duplicate places
   */
  async findDuplicates(): Promise<Array<{ place: ImportedPlace; duplicates: ImportedPlace[] }>> {
    const places = await this.importedPlaceRepository.find();
    const duplicates: Array<{ place: ImportedPlace; duplicates: ImportedPlace[] }> = [];

    for (const place of places) {
      const potentialDuplicates = places.filter(p => 
        p.id !== place.id &&
        this.calculateSimilarity(place, p) > 0.8
      );

      if (potentialDuplicates.length > 0) {
        duplicates.push({
          place,
          duplicates: potentialDuplicates,
        });
      }
    }

    return duplicates;
  }

  /**
   * Calculate similarity between two places
   */
  private calculateSimilarity(place1: ImportedPlace, place2: ImportedPlace): number {
    let score = 0;
    let factors = 0;

    // Name similarity
    if (place1.name && place2.name) {
      const nameSimilarity = this.levenshteinDistance(place1.name.toLowerCase(), place2.name.toLowerCase());
      score += (1 - nameSimilarity / Math.max(place1.name.length, place2.name.length)) * 0.4;
      factors += 0.4;
    }

    // Address similarity
    if (place1.address && place2.address) {
      const addressSimilarity = this.levenshteinDistance(place1.address.toLowerCase(), place2.address.toLowerCase());
      score += (1 - addressSimilarity / Math.max(place1.address.length, place2.address.length)) * 0.3;
      factors += 0.3;
    }

    // Distance similarity
    if (place1.lat && place1.lng && place2.lat && place2.lng) {
      const distance = this.calculateDistance(place1.lat, place1.lng, place2.lat, place2.lng);
      const distanceScore = Math.max(0, 1 - distance / 1000); // 1km = 0 score
      score += distanceScore * 0.3;
      factors += 0.3;
    }

    return factors > 0 ? score / factors : 0;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator,
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate distance between two coordinates in meters
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}
