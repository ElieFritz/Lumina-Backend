import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PlacesImportService, ImportJobOptions } from '../services/places-import.service';

export class ImportPlacesDto {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
  maxResults?: number;
  updateExisting?: boolean;
  dryRun?: boolean;
}

@ApiTags('Places Import (Public)')
@Controller('api/places-import-public')
export class PlacesImportPublicController {
  constructor(private placesImportService: PlacesImportService) {}

  @Post('import')
  @ApiOperation({ summary: 'Import places from Google Places API (Public)' })
  @ApiResponse({ status: 200, description: 'Import job completed successfully' })
  async importPlaces(@Body() importDto: ImportPlacesDto) {
    const options: ImportJobOptions = {
      location: importDto.location,
      radius: importDto.radius,
      type: importDto.type,
      keyword: importDto.keyword,
      maxResults: importDto.maxResults,
      updateExisting: importDto.updateExisting,
      dryRun: importDto.dryRun,
    };

    return this.placesImportService.importPlaces(options);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get import statistics (Public)' })
  @ApiResponse({ status: 200, description: 'Import statistics retrieved successfully' })
  async getImportStats() {
    return this.placesImportService.getImportStats();
  }

  @Get('places')
  @ApiOperation({ summary: 'Get imported places with filters (Public)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getPlaces(
    @Query('status') status?: string,
    @Query('source') source?: string,
    @Query('category') category?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ) {
    // Retourner des données mockées pour la démo
    return {
      places: [
        {
          id: '1',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Restaurant Le Bistrot',
          address: '123 Avenue de la République, Abidjan, Côte d\'Ivoire',
          lat: 5.3600,
          lng: -4.0083,
          phone: '+225 20 30 40 50',
          website: 'https://lebistrot.ci',
          categories: ['restaurant', 'french'],
          rating: 4.5,
          userRatingsTotal: 127,
          status: 'verified',
          source: 'google_places',
          importDate: '2024-01-15T10:30:00Z',
          photoUrls: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'],
        },
        {
          id: '2',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
          name: 'Bar Le Sunset',
          address: '456 Boulevard de la Paix, Abidjan, Côte d\'Ivoire',
          lat: 5.3650,
          lng: -4.0120,
          phone: '+225 20 30 40 51',
          categories: ['bar', 'nightlife'],
          rating: 4.2,
          userRatingsTotal: 89,
          status: 'claimed',
          source: 'google_places',
          importDate: '2024-01-14T15:45:00Z',
          photoUrls: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400'],
        }
      ],
      total: 2,
      page,
      limit,
      totalPages: 1,
    };
  }

  @Post('places/:id/claim')
  @ApiOperation({ summary: 'Claim a place as owner (Public)' })
  @ApiResponse({ status: 200, description: 'Place claim submitted successfully' })
  async claimPlace(@Body() claimDto: any) {
    return {
      success: true,
      message: 'Place claim submitted successfully. You will be contacted for verification.',
      claimId: 'mock-claim-id',
      requiresVerification: true,
    };
  }
}
