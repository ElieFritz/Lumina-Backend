import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../common/entities/user.entity';
import { Venue } from './venue.entity';
import { Event } from './event.entity';

export enum ReviewType {
  VENUE = 'venue',
  EVENT = 'event',
}

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({
    type: 'enum',
    enum: ReviewType,
  })
  type: ReviewType;

  @Column({ type: 'json', nullable: true })
  aspects: {
    service?: number;
    atmosphere?: number;
    value?: number;
    cleanliness?: number;
    location?: number;
  };

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  helpfulCount: number;

  @Column({ type: 'int', default: 0 })
  reportCount: number;

  @Column({ default: false })
  isReported: boolean;

  @Column({ type: 'text', nullable: true })
  reportReason: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Venue, (venue) => venue.reviews, { nullable: true })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column({ nullable: true })
  venueId: number;

  @ManyToOne(() => Event, (event) => event.reviews, { nullable: true })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ nullable: true })
  eventId: number;

  // Méthodes
  get isPositive(): boolean {
    return this.rating >= 4;
  }

  get isNegative(): boolean {
    return this.rating <= 2;
  }

  get isNeutral(): boolean {
    return this.rating === 3;
  }

  get starRating(): string {
    return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
  }

  get shortComment(): string {
    if (!this.comment) return '';
    return this.comment.length > 100 
      ? this.comment.substring(0, 100) + '...' 
      : this.comment;
  }
}
