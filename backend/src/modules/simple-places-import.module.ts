import { Module } from '@nestjs/common';
import { SimplePlacesImportController } from '../controllers/simple-places-import.controller';
import { GooglePlacesService } from '../services/google-places.service';

@Module({
  controllers: [SimplePlacesImportController],
  providers: [GooglePlacesService],
})
export class SimplePlacesImportModule {}
