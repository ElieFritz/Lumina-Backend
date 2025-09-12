import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentMethod {
  CARD = 'card',
  MOBILE_MONEY = 'mobile_money',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  STRIPE = 'stripe',
  PAYSTACK = 'paystack',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  bookingNumber: string;

  @Column({ type: 'int', default: 1 })
  ticketQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ length: 10, default: 'XOF' })
  currency: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ length: 100, nullable: true })
  paymentReference: string;

  @Column({ length: 100, nullable: true })
  transactionId: string;

  @Column({ type: 'json', nullable: true })
  paymentDetails: {
    provider?: string;
    method?: string;
    last4?: string;
    brand?: string;
    country?: string;
  };

  @Column({ type: 'json', nullable: true })
  attendeeInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    additionalAttendees?: Array<{
      firstName: string;
      lastName: string;
      email?: string;
    }>;
  };

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @Column({ type: 'json', nullable: true })
  qrCode: {
    data: string;
    imageUrl?: string;
  };

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  refundAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @Column({ type: 'text', nullable: true })
  refundReason: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Event, (event) => event.bookings)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: number;

  // Méthodes
  get isConfirmed(): boolean {
    return this.status === BookingStatus.CONFIRMED;
  }

  get isPaid(): boolean {
    return this.paymentStatus === PaymentStatus.PAID;
  }

  get isCancelled(): boolean {
    return this.status === BookingStatus.CANCELLED;
  }

  get isRefunded(): boolean {
    return this.paymentStatus === PaymentStatus.REFUNDED;
  }

  get canBeCancelled(): boolean {
    return this.isConfirmed && !this.isCancelled && this.event.startDate > new Date();
  }

  get canBeRefunded(): boolean {
    return this.isPaid && !this.isRefunded && this.event.startDate > new Date();
  }

  generateBookingNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `EL${timestamp}${random}`.toUpperCase();
  }

  @BeforeInsert()
  generateBookingNumberIfNotExists() {
    if (!this.bookingNumber) {
      this.bookingNumber = this.generateBookingNumber();
    }
  }
}
