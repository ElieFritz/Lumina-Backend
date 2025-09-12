import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Point } from 'geojson';
import { Event } from './event.entity';
import { Review } from './review.entity';
import { VenueImage } from './venue-image.entity';
import { User } from './user.entity';

export enum VenueCategory {
  RESTAURANT = 'restaurant',
  CINEMA = 'cinema',
  LOUNGE = 'lounge',
  CONCERT_HALL = 'concert_hall',
  THEATER = 'theater',
  CLUB = 'club',
  BAR = 'bar',
  CAFE = 'cafe',
  HOTEL = 'hotel',
  SPORTS = 'sports',
  OTHER = 'other',
}

export enum VenueStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: VenueCategory,
  })
  category: VenueCategory;

  @Column({ length: 200 })
  address: string;

  @Column({ length: 50 })
  city: string;

  @Column({ length: 50 })
  country: string;

  @Column({ length: 10, nullable: true })
  postalCode: string;

  @Column({
    type: 'point',
    nullable: true,
  })
  coordinates: Point;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ length: 10 })
  priceRange: string; // €, €€, €€€, €€€€

  @Column({ type: 'json', nullable: true })
  openingHours: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };

  @Column({ type: 'json', nullable: true })
  amenities: string[];

  @Column({ type: 'json', nullable: true })
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };

  @Column({
    type: 'enum',
    enum: VenueStatus,
    default: VenueStatus.PENDING,
  })
  status: VenueStatus;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averagePrice: number;

  @Column({ length: 10, default: 'XOF' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column({ nullable: true })
  ownerId: number;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];

  @OneToMany(() => Review, (review) => review.venue)
  reviews: Review[];

  @OneToMany(() => VenueImage, (image) => image.venue)
  images: VenueImage[];

  // Méthodes
  get isOpen(): boolean {
    if (!this.openingHours) return false;
    
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[now.getDay()];
    const todayHours = this.openingHours[dayName];
    
    if (!todayHours || todayHours.closed) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  }

  get mainImage(): string {
    const mainImg = this.images?.find(img => img.isMain);
    return mainImg?.url || '/images/venue-placeholder.jpg';
  }

  get allImages(): string[] {
    return this.images?.map(img => img.url) || [];
  }
}
