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
import { ReservationStatus } from '../enums/reservation-status.enum';
// import { User } from './user.entity';
// import { Event } from './event.entity';
// import { Payment } from './payment.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  @Index()
  status: ReservationStatus;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: 'jsonb', nullable: true })
  ticketDetails?: {
    ticketType?: string;
    seatNumbers?: string[];
    specialRequests?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    dietaryRestrictions?: string;
  };

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  checkedInAt?: Date;

  @Column({ type: 'text', nullable: true })
  qrCode?: string;

  // Relations - Commented out due to missing inverse relations
  // @ManyToOne(() => User, (user) => user.reservations)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  // @ManyToOne(() => Event, (event) => event.reservations)
  // @JoinColumn({ name: 'event_id' })
  // event: Event;

  @Column({ name: 'event_id' })
  @Index()
  eventId: string;

  // @ManyToOne(() => Payment, (payment) => payment.reservation)
  // payment: Payment;

  @Column({ name: 'payment_id', nullable: true })
  paymentId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isConfirmed(): boolean {
    return this.status === ReservationStatus.CONFIRMED;
  }

  get isCancelled(): boolean {
    return this.status === ReservationStatus.CANCELLED;
  }

  get isCompleted(): boolean {
    return this.status === ReservationStatus.COMPLETED;
  }

  // Commented out due to missing event relation
  // get canBeCancelled(): boolean {
  //   const now = new Date();
  //   const eventDate = new Date(this.event.eventDate);
  //   const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  //   
  //   return (
  //     this.status === ReservationStatus.CONFIRMED &&
  //     hoursUntilEvent > 24 // Can cancel up to 24 hours before event
  //   );
  // }
}

