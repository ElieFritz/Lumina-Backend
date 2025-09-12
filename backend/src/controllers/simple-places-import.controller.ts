import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GooglePlacesService } from '../services/google-places.service';

@Controller('api/places-import')
export class SimplePlacesImportController {
  
  constructor(private readonly googlePlacesService: GooglePlacesService) {}
  
  @Get('stats')
  getStats() {
    return {
      totalPlaces: 0,
      importedPlaces: 0,
      pendingPlaces: 0,
      verifiedPlaces: 0,
      lastImportDate: null,
      importJobs: []
    };
  }

  @Post('import')
  async importPlaces(@Body() body: any) {
    console.log('Import request received:', body);
    
    try {
      const { location, radius = 5000, type = '', maxResults = 20 } = body;
      
      if (!location) {
        return {
          success: false,
          message: 'Location is required',
          jobId: null,
          importedCount: 0,
          skippedCount: 0,
          errors: ['Location parameter is required']
        };
      }

      // Utiliser le service Google Places pour récupérer les données réelles
      const places = await this.googlePlacesService.searchPlaces({
        location,
        radius,
        type,
        maxResults
      });

      console.log(`Found ${places.length} places for location: ${location}`);

      return {
        success: true,
        message: `Import réussi - ${places.length} lieux trouvés`,
        jobId: 'job_' + Date.now(),
        importedCount: places.length,
        skippedCount: 0,
        errors: [],
        places: places.slice(0, 5) // Retourner les 5 premiers pour preview
      };
    } catch (error) {
      console.error('Import error:', error);
      return {
        success: false,
        message: 'Erreur lors de l\'import',
        jobId: null,
        importedCount: 0,
        skippedCount: 0,
        errors: [error.message || 'Unknown error']
      };
    }
  }

  @Get('places')
  getPlaces(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return {
      data: [],
      total: 0,
      page: page,
      limit: limit
    };
  }
}
