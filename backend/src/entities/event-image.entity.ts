import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('event_images')
export class EventImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  url: string;

  @Column({ length: 200, nullable: true })
  alt: string;

  @Column({ default: false })
  isMain: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'int', nullable: true })
  width: number;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ length: 50, nullable: true })
  format: string; // jpg, png, webp

  @Column({ type: 'bigint', nullable: true })
  fileSize: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Event, (event) => event.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column()
  eventId: number;
}
