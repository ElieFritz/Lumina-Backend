import { Module } from '@nestjs/common';
import { SimpleVenuesController } from '../controllers/simple-venues.controller';

@Module({
  controllers: [SimpleVenuesController],
})
export class SimpleVenuesModule {}
