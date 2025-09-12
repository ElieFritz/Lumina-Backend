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

@Entity('friendships')
export class Friendship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'declined', 'blocked'] })
  @Index()
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  declinedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  blockedAt?: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  @JoinColumn({ name: 'requester_id' })
  requester: User;

  @Column({ name: 'requester_id' })
  @Index()
  requesterId: string;

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  @JoinColumn({ name: 'addressee_id' })
  addressee: User;

  @Column({ name: 'addressee_id' })
  @Index()
  addresseeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isAccepted(): boolean {
    return this.status === 'accepted';
  }

  get isDeclined(): boolean {
    return this.status === 'declined';
  }

  get isBlocked(): boolean {
    return this.status === 'blocked';
  }
}

