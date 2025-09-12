import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VenueCategory } from '../../common/enums/venue-category.enum';

@ApiTags('venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouvel établissement' })
  @ApiResponse({ status: 201, description: 'Établissement créé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async create(@Body() createVenueDto: CreateVenueDto, @Request() req) {
    return this.venuesService.create(createVenueDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les établissements' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
  @ApiQuery({ name: 'category', required: false, enum: VenueCategory, description: 'Catégorie d\'établissement' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Ville' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Statut actif' })
  @ApiResponse({ status: 200, description: 'Liste des établissements' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('category') category?: VenueCategory,
    @Query('city') city?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.venuesService.findAll(page, limit, category, city, isActive);
  }

  @Get('search')
  @ApiOperation({ summary: 'Rechercher des établissements' })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Terme de recherche' })
  @ApiQuery({ name: 'category', required: false, enum: VenueCategory, description: 'Catégorie' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Ville' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'éléments par page' })
  @ApiResponse({ status: 200, description: 'Résultats de recherche' })
  async search(
    @Query('q') query: string,
    @Query('category') category?: VenueCategory,
    @Query('city') city?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.venuesService.search(query, category, city, page, limit);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Trouver des établissements à proximité' })
  @ApiQuery({ name: 'lat', required: true, type: Number, description: 'Latitude' })
  @ApiQuery({ name: 'lng', required: true, type: Number, description: 'Longitude' })
  @ApiQuery({ name: 'radius', required: false, type: Number, description: 'Rayon en km (défaut: 10)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre maximum de résultats' })
  @ApiResponse({ status: 200, description: 'Établissements à proximité' })
  async findByLocation(
    @Query('lat', new ParseFloatPipe()) latitude: number,
    @Query('lng', new ParseFloatPipe()) longitude: number,
    @Query('radius', new ParseFloatPipe({ optional: true })) radiusKm: number = 10,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.venuesService.findByLocation(latitude, longitude, radiusKm, limit);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Récupérer les établissements populaires' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Nombre d\'établissements' })
  @ApiResponse({ status: 200, description: 'Établissements populaires' })
  async getPopularVenues(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
  ) {
    return this.venuesService.getPopularVenues(limit);
  }

  @Get('my-venues')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les établissements de l\'utilisateur connecté' })
  @ApiResponse({ status: 200, description: 'Établissements de l\'utilisateur' })
  async getMyVenues(@Request() req) {
    return this.venuesService.findByOwner(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un établissement par ID' })
  @ApiResponse({ status: 200, description: 'Établissement trouvé' })
  @ApiResponse({ status: 404, description: 'Établissement non trouvé' })
  async findOne(@Param('id') id: string) {
    return this.venuesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un établissement' })
  @ApiResponse({ status: 200, description: 'Établissement mis à jour avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Établissement non trouvé' })
  async update(@Param('id') id: string, @Body() updateVenueDto: UpdateVenueDto, @Request() req) {
    return this.venuesService.update(id, updateVenueDto, req.user.id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier le statut d\'un établissement' })
  @ApiResponse({ status: 200, description: 'Statut modifié avec succès' })
  async updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean, @Request() req) {
    return this.venuesService.updateStatus(id, isActive, req.user.id);
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vérifier un établissement (Admin seulement)' })
  @ApiResponse({ status: 200, description: 'Établissement vérifié' })
  async verify(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
    return this.venuesService.verify(id, isVerified);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un établissement' })
  @ApiResponse({ status: 200, description: 'Établissement supprimé avec succès' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  async remove(@Param('id') id: string, @Request() req) {
    await this.venuesService.remove(id, req.user.id);
    return { message: 'Établissement supprimé avec succès' };
  }
}

