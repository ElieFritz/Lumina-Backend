import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Venue } from './venue.entity';
import { Event } from './event.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  @Column({ type: 'jsonb', nullable: true })
  aspects?: {
    service?: number;
    ambiance?: number;
    value?: number;
    cleanliness?: number;
  };

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: false })
  isReported: boolean;

  @Column({ type: 'text', nullable: true })
  reportReason?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => Venue, (venue) => venue.reviews, { nullable: true })
  @JoinColumn({ name: 'venue_id' })
  venue?: Venue;

  @Column({ name: 'venue_id', nullable: true })
  venueId?: string;

  @ManyToOne(() => Event, (event) => event.reviews, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event?: Event;

  @Column({ name: 'event_id', nullable: true })
  eventId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isPositive(): boolean {
    return this.rating >= 4;
  }

  get isNegative(): boolean {
    return this.rating <= 2;
  }
}

