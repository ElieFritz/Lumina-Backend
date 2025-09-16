import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ImportedPlace } from '../../entities/imported-place.entity';
import { User } from '../../common/entities/user.entity';
import { PlacesImportController } from '../../controllers/places-import.controller';
import { PlacesImportService } from '../../services/places-import.service';
import { PlaceClaimService } from '../../services/place-claim.service';
import { GooglePlacesService } from '../../services/google-places.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImportedPlace, User]),
    ConfigModule,
  ],
  controllers: [PlacesImportController],
  providers: [
    PlacesImportService,
    PlaceClaimService,
    GooglePlacesService,
  ],
  exports: [
    PlacesImportService,
    PlaceClaimService,
    GooglePlacesService,
  ],
})
export class PlacesImportModule {}
