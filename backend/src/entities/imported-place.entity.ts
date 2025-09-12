import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PlaceStatus {
  IMPORTED = 'imported',
  CLAIMED = 'claimed',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum PlaceSource {
  GOOGLE_PLACES = 'google_places',
  MANUAL = 'manual',
  IMPORTED = 'imported',
}

@Entity('imported_places')
@Index(['placeId'], { unique: true })
@Index(['status'])
@Index(['source'])
@Index(['lat', 'lng'])
export class ImportedPlace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Google Places ID (unique identifier from Google)
  @Column({ name: 'place_id', unique: true })
  placeId: string;

  // Basic information
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  lat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  lng: number;

  // Contact information
  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  website: string;

  // Categories and types
  @Column('simple-array', { nullable: true })
  googleTypes: string[];

  @Column('simple-array', { nullable: true })
  categories: string[];

  // Rating and reviews
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating: number;

  @Column({ name: 'user_ratings_total', type: 'int', nullable: true })
  userRatingsTotal: number;

  // Opening hours (stored as JSON)
  @Column({ type: 'jsonb', nullable: true })
  openingHours: {
    open_now?: boolean;
    periods?: Array<{
      open: { day: number; time: string };
      close?: { day: number; time: string };
    }>;
    weekday_text?: string[];
  };

  // Photos
  @Column('simple-array', { nullable: true })
  photoReferences: string[];

  @Column('simple-array', { nullable: true })
  photoUrls: string[];

  // Business information
  @Column({ name: 'business_status', nullable: true })
  businessStatus: string;

  @Column({ name: 'price_level', type: 'int', nullable: true })
  priceLevel: number;

  // Import metadata
  @Column({ type: 'enum', enum: PlaceSource, default: PlaceSource.GOOGLE_PLACES })
  source: PlaceSource;

  @Column({ type: 'enum', enum: PlaceStatus, default: PlaceStatus.IMPORTED })
  status: PlaceStatus;

  @Column({ name: 'import_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  importDate: Date;

  @Column({ name: 'last_checked', type: 'timestamp', nullable: true })
  lastChecked: Date;

  // Claim information
  @Column({ name: 'owner_id', type: 'int', nullable: true })
  ownerId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'claim_date', type: 'timestamp', nullable: true })
  claimDate: Date;

  @Column({ name: 'claim_contact_email', nullable: true })
  claimContactEmail: string;

  @Column({ name: 'claim_contact_phone', nullable: true })
  claimContactPhone: string;

  @Column({ name: 'claim_justification', type: 'text', nullable: true })
  claimJustification: string;

  // Verification
  @Column({ name: 'verified_date', type: 'timestamp', nullable: true })
  verifiedDate: Date;

  @Column({ name: 'verified_by', type: 'int', nullable: true })
  verifiedBy: number;

  @Column({ name: 'verification_notes', type: 'text', nullable: true })
  verificationNotes: string;

  // Google Maps URL for reference
  @Column({ name: 'google_maps_url', nullable: true })
  googleMapsUrl: string;

  // Additional metadata
  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    vicinity?: string;
    formatted_address?: string;
    place_id?: string;
    plus_code?: {
      global_code: string;
      compound_code: string;
    };
    [key: string]: any;
  };

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Computed properties
  get isClaimed(): boolean {
    return this.status === PlaceStatus.CLAIMED || this.status === PlaceStatus.VERIFIED;
  }

  get isVerified(): boolean {
    return this.status === PlaceStatus.VERIFIED;
  }

  get isImported(): boolean {
    return this.status === PlaceStatus.IMPORTED;
  }

  get hasPhotos(): boolean {
    return this.photoReferences && this.photoReferences.length > 0;
  }

  get hasContactInfo(): boolean {
    return !!(this.phone || this.website);
  }

  get isOpenNow(): boolean {
    return this.openingHours?.open_now ?? false;
  }
}
