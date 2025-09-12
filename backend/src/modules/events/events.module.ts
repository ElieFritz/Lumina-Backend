import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from '../../common/entities/event.entity';
import { User } from '../../common/entities/user.entity';
import { Venue } from '../../common/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, User, Venue])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

