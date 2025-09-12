import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Venue } from '../../common/entities/venue.entity';
import { User } from '../../common/entities/user.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { VenueCategory } from '../../common/enums/venue-category.enum';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepository: Repository<Venue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createVenueDto: CreateVenueDto, ownerId: string): Promise<Venue> {
    // Verify that the user exists and can create venues
    const owner = await this.userRepository.findOne({ where: { id: ownerId } });
    if (!owner) {
      throw new NotFoundException('Propriétaire non trouvé');
    }

    if (owner.role !== UserRole.VENUE_OWNER && owner.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Seuls les propriétaires d\'établissements peuvent créer des venues');
    }

    const venue = this.venueRepository.create({
      ...createVenueDto,
      location: `POINT(${createVenueDto.location.lng} ${createVenueDto.location.lat})`,
      ownerId,
    });

    return this.venueRepository.save(venue);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    category?: VenueCategory,
    city?: string,
    isActive?: boolean,
  ): Promise<{ venues: Venue[]; total: number }> {
    const queryBuilder = this.venueRepository.createQueryBuilder('venue')
      .leftJoinAndSelect('venue.owner', 'owner');

    if (category) {
      queryBuilder.andWhere('venue.category = :category', { category });
    }

    if (city) {
      queryBuilder.andWhere('venue.city ILIKE :city', { city: `%${city}%` });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('venue.isActive = :isActive', { isActive });
    }

    const [venues, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { venues, total };
  }

  async findOne(id: string): Promise<Venue> {
    const venue = await this.venueRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!venue) {
      throw new NotFoundException('Établissement non trouvé');
    }

    return venue;
  }

  async findByOwner(ownerId: string): Promise<Venue[]> {
    return this.venueRepository.find({
      where: { ownerId },
    });
  }

  async update(id: string, updateVenueDto: UpdateVenueDto, userId: string): Promise<Venue> {
    const venue = await this.findOne(id);

    // Check if user is the owner or admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (venue.ownerId !== userId && user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres établissements');
    }

    const updateData: any = { ...updateVenueDto };
    if (updateVenueDto.location) {
      updateData.location = `POINT(${updateVenueDto.location.lng} ${updateVenueDto.location.lat})`;
    }
    
    await this.venueRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const venue = await this.findOne(id);

    // Check if user is the owner or admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (venue.ownerId !== userId && user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres établissements');
    }

    await this.venueRepository.remove(venue);
  }

  async updateStatus(id: string, isActive: boolean, userId: string): Promise<Venue> {
    const venue = await this.findOne(id);

    // Check if user is the owner or admin
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (venue.ownerId !== userId && user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres établissements');
    }

    await this.venueRepository.update(id, { isActive });
    return this.findOne(id);
  }

  async verify(id: string, isVerified: boolean): Promise<Venue> {
    await this.venueRepository.update(id, { isVerified });
    return this.findOne(id);
  }

  async search(
    query: string,
    category?: VenueCategory,
    city?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ venues: Venue[]; total: number }> {
    const queryBuilder = this.venueRepository.createQueryBuilder('venue')
      .leftJoinAndSelect('venue.owner', 'owner')
      .where('venue.isActive = :isActive', { isActive: true });

    if (query) {
      queryBuilder.andWhere(
        '(venue.name ILIKE :query OR venue.description ILIKE :query OR venue.address ILIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('venue.category = :category', { category });
    }

    if (city) {
      queryBuilder.andWhere('venue.city ILIKE :city', { city: `%${city}%` });
    }

    const [venues, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { venues, total };
  }

  async getPopularVenues(limit: number = 10): Promise<Venue[]> {
    return this.venueRepository
      .createQueryBuilder('venue')
      .leftJoinAndSelect('venue.owner', 'owner')
      .where('venue.isActive = :isActive', { isActive: true })
      .orderBy('venue.averageRating', 'DESC')
      .addOrderBy('venue.totalReviews', 'DESC')
      .limit(limit)
      .getMany();
  }

  async findByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    limit: number = 20,
  ): Promise<Venue[]> {
    // Using PostGIS for geospatial queries
    const venues = await this.venueRepository
      .createQueryBuilder('venue')
      .leftJoinAndSelect('venue.owner', 'owner')
      .where(
        `ST_DWithin(
          venue.location,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
          :radius
        )`,
        { longitude, latitude, radius: radiusKm * 1000 }, // Convert km to meters
      )
      .andWhere('venue.isActive = :isActive', { isActive: true })
      .orderBy(
        `ST_Distance(
          venue.location,
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
        )`,
        'ASC',
      )
      .limit(limit)
      .getMany();

    return venues;
  }
}