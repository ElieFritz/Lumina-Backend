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

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'enum', enum: ['percentage', 'fixed_amount', 'buy_one_get_one'] })
  type: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maximumDiscount?: number;

  @Column({ type: 'int', nullable: true })
  usageLimit?: number;

  @Column({ type: 'int', default: 0 })
  usageCount: number;

  @Column({ type: 'int', nullable: true })
  usageLimitPerUser?: number;

  @Column({ type: 'timestamp' })
  @Index()
  startDate: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  applicableCategories?: string[];

  @Column({ type: 'jsonb', nullable: true })
  applicableVenues?: string[];

  @Column({ type: 'jsonb', nullable: true })
  applicableEvents?: string[];

  @Column({ type: 'jsonb', nullable: true })
  images?: string[];

  // Relations
  @ManyToOne(() => User, (user) => user.promotions)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by' })
  createdById: string;

  @ManyToOne(() => Venue, (venue) => venue.promotions, { nullable: true })
  @JoinColumn({ name: 'venue_id' })
  venue?: Venue;

  @Column({ name: 'venue_id', nullable: true })
  venueId?: string;

  @ManyToOne(() => Event, { nullable: true })
  @JoinColumn({ name: 'event_id' })
  event?: Event;

  @Column({ name: 'event_id', nullable: true })
  eventId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isExpired(): boolean {
    return new Date() > this.endDate;
  }

  get isStarted(): boolean {
    return new Date() >= this.startDate;
  }

  get isCurrentlyActive(): boolean {
    const now = new Date();
    return this.isActive && now >= this.startDate && now <= this.endDate;
  }

  get isUsageLimitReached(): boolean {
    return this.usageLimit ? this.usageCount >= this.usageLimit : false;
  }

  get canBeUsed(): boolean {
    return this.isCurrentlyActive && !this.isUsageLimitReached;
  }
}

