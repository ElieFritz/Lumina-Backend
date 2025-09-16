import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Venue } from './venue.entity';
import { Booking } from './booking.entity';
import { EventImage } from './event-image.entity';
import { Review } from './review.entity';
import { User } from '../common/entities/user.entity';

export enum EventCategory {
  CONCERT = 'concert',
  CINEMA = 'cinema',
  THEATER = 'theater',
  SPORTS = 'sports',
  CONFERENCE = 'conference',
  WORKSHOP = 'workshop',
  PARTY = 'party',
  FESTIVAL = 'festival',
  EXHIBITION = 'exhibition',
  COMEDY = 'comedy',
  DANCE = 'dance',
  FOOD = 'food',
  OTHER = 'other',
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  POSTPONED = 'postponed',
}

export enum TicketType {
  FREE = 'free',
  PAID = 'paid',
  DONATION = 'donation',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: EventCategory,
  })
  category: EventCategory;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  doorOpenTime: Date;

  @Column({ type: 'int', default: 0 })
  totalTickets: number;

  @Column({ type: 'int', default: 0 })
  availableTickets: number;

  @Column({ type: 'int', default: 0 })
  soldTickets: number;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.PAID,
  })
  ticketType: TicketType;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ length: 10, default: 'XOF' })
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  earlyBirdPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  earlyBirdEndDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  vipPrice: number;

  @Column({ type: 'int', nullable: true })
  vipTickets: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.DRAFT,
  })
  status: EventStatus;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  minAge: number;

  @Column({ type: 'json', nullable: true })
  requirements: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[];

  @Column({ type: 'text', nullable: true })
  termsAndConditions: string;

  @Column({ type: 'text', nullable: true })
  refundPolicy: string;

  @Column({ type: 'json', nullable: true })
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
  };

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column()
  venueId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  @OneToMany(() => Booking, (booking) => booking.event)
  bookings: Booking[];

  @OneToMany(() => EventImage, (image) => image.event)
  images: EventImage[];

  @OneToMany(() => Review, (review) => review.event)
  reviews: Review[];

  // Méthodes
  get isSoldOut(): boolean {
    return this.availableTickets <= 0;
  }

  get isUpcoming(): boolean {
    return this.startDate > new Date();
  }

  get isOngoing(): boolean {
    const now = new Date();
    return now >= this.startDate && now <= this.endDate;
  }

  get isPast(): boolean {
    return this.endDate < new Date();
  }

  get mainImage(): string {
    const mainImg = this.images?.find(img => img.isMain);
    return mainImg?.url || '/images/event-placeholder.jpg';
  }

  get allImages(): string[] {
    return this.images?.map(img => img.url) || [];
  }

  get currentPrice(): number {
    if (this.earlyBirdPrice && this.earlyBirdEndDate && new Date() <= this.earlyBirdEndDate) {
      return this.earlyBirdPrice;
    }
    return this.price;
  }

  get salesPercentage(): number {
    if (this.totalTickets === 0) return 0;
    return Math.round((this.soldTickets / this.totalTickets) * 100);
  }
}
