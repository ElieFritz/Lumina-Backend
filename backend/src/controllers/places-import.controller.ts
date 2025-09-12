import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PlacesImportService, ImportJobOptions } from '../services/places-import.service';
import { ImportedPlace, PlaceStatus } from '../entities/imported-place.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

export class ImportPlacesDto {
  location: string;
  radius?: number;
  type?: string;
  keyword?: string;
  maxResults?: number;
  updateExisting?: boolean;
  dryRun?: boolean;
}

export class ClaimPlaceDto {
  contactEmail: string;
  contactPhone: string;
  justification: string;
}

export class VerifyPlaceDto {
  status: PlaceStatus;
  notes?: string;
}

@ApiTags('Places Import')
@Controller('places-import')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PlacesImportController {
  constructor(private placesImportService: PlacesImportService) {}

  @Post('import')
  @Roles('admin')
  @ApiOperation({ summary: 'Import places from Google Places API' })
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

  @Post('import/city')
  @Roles('admin')
  @ApiOperation({ summary: 'Import places by city' })
  @ApiResponse({ status: 200, description: 'City import completed successfully' })
  async importByCity(
    @Body() body: { cityName: string; options?: Partial<ImportJobOptions> },
  ) {
    return this.placesImportService.importByCity(body.cityName, body.options);
  }

  @Post('import/coordinates')
  @Roles('admin')
  @ApiOperation({ summary: 'Import places by coordinates' })
  @ApiResponse({ status: 200, description: 'Coordinate import completed successfully' })
  async importByCoordinates(
    @Body() body: { lat: number; lng: number; radius?: number; options?: Partial<ImportJobOptions> },
  ) {
    return this.placesImportService.importByCoordinates(
      body.lat,
      body.lng,
      body.radius,
      body.options,
    );
  }

  @Post('import/category')
  @Roles('admin')
  @ApiOperation({ summary: 'Import places by category' })
  @ApiResponse({ status: 200, description: 'Category import completed successfully' })
  async importByCategory(
    @Body() body: { category: string; location: string; options?: Partial<ImportJobOptions> },
  ) {
    return this.placesImportService.importByCategory(
      body.category,
      body.location,
      body.options,
    );
  }

  @Post('import/bulk')
  @Roles('admin')
  @ApiOperation({ summary: 'Bulk import for multiple locations' })
  @ApiResponse({ status: 200, description: 'Bulk import completed successfully' })
  async bulkImport(
    @Body() body: { locations: Array<{ location: string; radius?: number; type?: string }> },
  ) {
    return this.placesImportService.bulkImport(body.locations);
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Get import statistics' })
  @ApiResponse({ status: 200, description: 'Import statistics retrieved successfully' })
  async getImportStats() {
    return this.placesImportService.getImportStats();
  }

  @Get('places')
  @ApiOperation({ summary: 'Get imported places with filters' })
  @ApiQuery({ name: 'status', required: false, enum: PlaceStatus })
  @ApiQuery({ name: 'source', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  async getPlaces(
    @Query('status') status?: PlaceStatus,
    @Query('source') source?: string,
    @Query('category') category?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('search') search?: string,
  ) {
    // This would be implemented in a separate service for querying places
    // For now, return a placeholder response
    return {
      places: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }

  @Get('places/:id')
  @ApiOperation({ summary: 'Get a specific imported place' })
  @ApiResponse({ status: 200, description: 'Place retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async getPlace(@Param('id') id: string) {
    // This would be implemented in a separate service
    return { message: 'Place details endpoint - to be implemented' };
  }

  @Post('places/:id/claim')
  @ApiOperation({ summary: 'Claim a place as owner' })
  @ApiResponse({ status: 200, description: 'Place claim submitted successfully' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async claimPlace(@Param('id') id: string, @Body() claimDto: ClaimPlaceDto) {
    // This would be implemented in a separate service
    return { message: 'Place claim endpoint - to be implemented' };
  }

  @Put('places/:id/verify')
  @Roles('admin')
  @ApiOperation({ summary: 'Verify a claimed place' })
  @ApiResponse({ status: 200, description: 'Place verification updated successfully' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async verifyPlace(@Param('id') id: string, @Body() verifyDto: VerifyPlaceDto) {
    // This would be implemented in a separate service
    return { message: 'Place verification endpoint - to be implemented' };
  }

  @Post('places/:id/reimport')
  @Roles('admin')
  @ApiOperation({ summary: 'Reimport a specific place' })
  @ApiResponse({ status: 200, description: 'Place reimported successfully' })
  @ApiResponse({ status: 404, description: 'Place not found' })
  async reimportPlace(@Param('id') id: string) {
    return this.placesImportService.reimportPlace(id);
  }

  @Get('duplicates')
  @Roles('admin')
  @ApiOperation({ summary: 'Find duplicate places' })
  @ApiResponse({ status: 200, description: 'Duplicates found successfully' })
  async findDuplicates() {
    return this.placesImportService.findDuplicates();
  }

  @Delete('cleanup')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clean up old imported places' })
  @ApiQuery({ name: 'daysOld', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Cleanup completed successfully' })
  async cleanupOldPlaces(@Query('daysOld') daysOld: number = 30) {
    const deletedCount = await this.placesImportService.cleanupOldPlaces(daysOld);
    return { deletedCount, message: `Cleaned up ${deletedCount} old places` };
  }
}
