import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { VenueCategory } from '../enums/venue-category.enum';
import { User } from './user.entity';
import { Event } from './event.entity';
import { Review } from './review.entity';
import { Promotion } from './promotion.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: VenueCategory })
  @Index()
  category: VenueCategory;

  @Column()
  address: string;

  @Column({ type: 'point' })
  @Index('idx_venues_location', { spatial: true })
  location: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'jsonb', nullable: true })
  openingHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };

  @Column({ type: 'jsonb', nullable: true })
  amenities?: string[];

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  averageRating?: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceRange?: number;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', nullable: true })
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };

  // Relations
  @ManyToOne(() => User, (user) => user.venues)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToMany(() => Event, (event) => event.venue)
  events: Event[];

  @OneToMany(() => Review, (review) => review.venue)
  reviews: Review[];

  @OneToMany(() => Promotion, (promotion) => promotion.venue)
  promotions: Promotion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isOpen(): boolean {
    if (!this.openingHours) return true;
    
    const now = new Date();
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = this.openingHours[dayName];
    
    if (!todayHours || todayHours.closed) return false;
    
    const currentTime = now.toTimeString().slice(0, 5);
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  }
}

