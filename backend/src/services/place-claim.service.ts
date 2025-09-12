import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportedPlace, PlaceStatus } from '../entities/imported-place.entity';
import { User } from '../entities/user.entity';

export interface ClaimPlaceRequest {
  placeId: string;
  contactEmail: string;
  contactPhone: string;
  justification: string;
  ownerId?: number;
}

export interface VerifyPlaceRequest {
  placeId: string;
  status: PlaceStatus;
  notes?: string;
  verifiedBy: number;
}

export interface ClaimPlaceResponse {
  success: boolean;
  message: string;
  claimId?: string;
  requiresVerification?: boolean;
}

@Injectable()
export class PlaceClaimService {
  private readonly logger = new Logger(PlaceClaimService.name);

  constructor(
    @InjectRepository(ImportedPlace)
    private importedPlaceRepository: Repository<ImportedPlace>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Claim a place as owner
   */
  async claimPlace(request: ClaimPlaceRequest): Promise<ClaimPlaceResponse> {
    const place = await this.importedPlaceRepository.findOne({
      where: { id: request.placeId },
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${request.placeId} not found`);
    }

    if (place.isClaimed) {
      throw new BadRequestException('This place has already been claimed');
    }

    // Check if user exists (if ownerId provided)
    if (request.ownerId) {
      const owner = await this.userRepository.findOne({
        where: { id: request.ownerId },
      });

      if (!owner) {
        throw new BadRequestException(`User with ID ${request.ownerId} not found`);
      }
    }

    // Update place with claim information
    await this.importedPlaceRepository.update(place.id, {
      status: PlaceStatus.CLAIMED,
      ownerId: request.ownerId,
      claimDate: new Date(),
      claimContactEmail: request.contactEmail,
      claimContactPhone: request.contactPhone,
      claimJustification: request.justification,
    });

    this.logger.log(`Place ${place.name} claimed by ${request.contactEmail}`);

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to claimant

    return {
      success: true,
      message: 'Place claim submitted successfully. You will be contacted for verification.',
      claimId: place.id,
      requiresVerification: true,
    };
  }

  /**
   * Verify a claimed place
   */
  async verifyPlace(request: VerifyPlaceRequest): Promise<ClaimPlaceResponse> {
    const place = await this.importedPlaceRepository.findOne({
      where: { id: request.placeId },
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${request.placeId} not found`);
    }

    if (place.status !== PlaceStatus.CLAIMED) {
      throw new BadRequestException('Place is not in claimed status');
    }

    // Update place with verification information
    await this.importedPlaceRepository.update(place.id, {
      status: request.status,
      verifiedDate: new Date(),
      verifiedBy: request.verifiedBy,
      verificationNotes: request.notes,
    });

    this.logger.log(`Place ${place.name} verification updated to ${request.status}`);

    // TODO: Send notification email to owner if verified
    // TODO: Send rejection email to owner if rejected

    return {
      success: true,
      message: `Place verification updated to ${request.status}`,
      claimId: place.id,
    };
  }

  /**
   * Get places claimed by a user
   */
  async getClaimedPlaces(ownerId: number): Promise<ImportedPlace[]> {
    return this.importedPlaceRepository.find({
      where: { ownerId },
      order: { claimDate: 'DESC' },
    });
  }

  /**
   * Get places pending verification
   */
  async getPendingVerificationPlaces(): Promise<ImportedPlace[]> {
    return this.importedPlaceRepository.find({
      where: { status: PlaceStatus.CLAIMED },
      order: { claimDate: 'ASC' },
    });
  }

  /**
   * Get claim statistics
   */
  async getClaimStats(): Promise<{
    totalClaims: number;
    pendingVerification: number;
    verified: number;
    rejected: number;
    recentClaims: number;
  }> {
    const totalClaims = await this.importedPlaceRepository.count({
      where: [
        { status: PlaceStatus.CLAIMED },
        { status: PlaceStatus.VERIFIED },
        { status: PlaceStatus.REJECTED },
      ],
    });

    const pendingVerification = await this.importedPlaceRepository.count({
      where: { status: PlaceStatus.CLAIMED },
    });

    const verified = await this.importedPlaceRepository.count({
      where: { status: PlaceStatus.VERIFIED },
    });

    const rejected = await this.importedPlaceRepository.count({
      where: { status: PlaceStatus.REJECTED },
    });

    const recentClaims = await this.importedPlaceRepository.count({
      where: [
        { status: PlaceStatus.CLAIMED },
        { status: PlaceStatus.VERIFIED },
        { status: PlaceStatus.REJECTED },
      ],
    });

    return {
      totalClaims,
      pendingVerification,
      verified,
      rejected,
      recentClaims,
    };
  }

  /**
   * Cancel a claim
   */
  async cancelClaim(placeId: string, ownerId: number): Promise<ClaimPlaceResponse> {
    const place = await this.importedPlaceRepository.findOne({
      where: { id: placeId, ownerId },
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found or not claimed by user`);
    }

    if (place.status === PlaceStatus.VERIFIED) {
      throw new BadRequestException('Cannot cancel a verified claim');
    }

    // Reset place to imported status
    await this.importedPlaceRepository.update(place.id, {
      status: PlaceStatus.IMPORTED,
      ownerId: null,
      claimDate: null,
      claimContactEmail: null,
      claimContactPhone: null,
      claimJustification: null,
      verifiedDate: null,
      verifiedBy: null,
      verificationNotes: null,
    });

    this.logger.log(`Claim cancelled for place ${place.name}`);

    return {
      success: true,
      message: 'Claim cancelled successfully',
      claimId: place.id,
    };
  }

  /**
   * Get claim history for a place
   */
  async getClaimHistory(placeId: string): Promise<{
    place: ImportedPlace;
    history: Array<{
      action: string;
      date: Date;
      user?: string;
      notes?: string;
    }>;
  }> {
    const place = await this.importedPlaceRepository.findOne({
      where: { id: placeId },
    });

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const history = [];

    // Add import event
    history.push({
      action: 'imported',
      date: place.importDate,
      notes: `Imported from ${place.source}`,
    });

    // Add claim event
    if (place.claimDate) {
      history.push({
        action: 'claimed',
        date: place.claimDate,
        user: place.claimContactEmail,
        notes: place.claimJustification,
      });
    }

    // Add verification event
    if (place.verifiedDate) {
      history.push({
        action: 'verified',
        date: place.verifiedDate,
        user: place.verifiedBy,
        notes: place.verificationNotes,
      });
    }

    return {
      place,
      history: history.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
  }

  /**
   * Send verification email (placeholder)
   */
  async sendVerificationEmail(placeId: string, email: string): Promise<void> {
    // TODO: Implement email service
    this.logger.log(`Sending verification email to ${email} for place ${placeId}`);
  }

  /**
   * Send rejection email (placeholder)
   */
  async sendRejectionEmail(placeId: string, email: string, reason: string): Promise<void> {
    // TODO: Implement email service
    this.logger.log(`Sending rejection email to ${email} for place ${placeId}. Reason: ${reason}`);
  }
}
