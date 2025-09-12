import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { EventStatus } from '../enums/event-status.enum';
import { User } from './user.entity';
import { Venue } from './venue.entity';
import { Reservation } from './reservation.entity';
import { Review } from './review.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  @Index()
  eventDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', nullable: true })
  maxCapacity?: number;

  @Column({ type: 'int', default: 0 })
  currentBookings: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT })
  @Index()
  status: EventStatus;

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  @Column({ type: 'jsonb', nullable: true })
  tags?: string[];

  @Column({ type: 'jsonb', nullable: true })
  requirements?: {
    ageRestriction?: number;
    dressCode?: string;
    specialInstructions?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  ticketTypes?: {
    name: string;
    price: number;
    description?: string;
    quantity?: number;
  }[];

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  averageRating?: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  bookingDeadline?: Date;

  @Column({ type: 'jsonb', nullable: true })
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };

  // Relations
  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({ name: 'organizer_id' })
  organizer: User;

  @Column({ name: 'organizer_id' })
  organizerId: string;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venue_id' })
  venue: Venue;

  @Column({ name: 'venue_id' })
  venueId: string;

  @OneToMany(() => Reservation, (reservation) => reservation.event)
  reservations: Reservation[];

  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isFullyBooked(): boolean {
    return this.maxCapacity ? this.currentBookings >= this.maxCapacity : false;
  }

  get isBookingOpen(): boolean {
    const now = new Date();
    return (
      this.status === EventStatus.PUBLISHED &&
      this.isActive &&
      (!this.bookingDeadline || now <= this.bookingDeadline) &&
      !this.isFullyBooked
    );
  }

  get availableSpots(): number {
    return this.maxCapacity ? this.maxCapacity - this.currentBookings : 0;
  }
}

