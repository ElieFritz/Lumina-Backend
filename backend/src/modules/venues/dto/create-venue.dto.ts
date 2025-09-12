import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, IsNumber, IsObject, IsUrl, IsPhoneNumber, IsEmail } from 'class-validator';
import { VenueCategory } from '../../../common/enums/venue-category.enum';

export class CreateVenueDto {
  @ApiProperty({ example: 'Le Rooftop Abidjan', description: 'Nom de l\'établissement' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Un rooftop exceptionnel avec vue sur la lagune', description: 'Description de l\'établissement', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: VenueCategory, example: VenueCategory.LOUNGE, description: 'Catégorie de l\'établissement' })
  @IsEnum(VenueCategory)
  category: VenueCategory;

  @ApiProperty({ example: 'Cocody, Riviera 2, Abidjan', description: 'Adresse complète' })
  @IsString()
  address: string;

  @ApiProperty({ example: { lat: 5.3599, lng: -4.0083 }, description: 'Coordonnées GPS (latitude, longitude)' })
  @IsObject()
  location: { lat: number; lng: number };

  @ApiProperty({ example: 'Abidjan', description: 'Ville', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Côte d\'Ivoire', description: 'Pays', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '00225', description: 'Code postal', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: '+2250701234567', description: 'Numéro de téléphone', required: false })
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Veuillez fournir un numéro de téléphone valide' })
  phone?: string;

  @ApiProperty({ example: 'contact@rooftop.ci', description: 'Email de contact', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'https://rooftop.ci', description: 'Site web', required: false })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ 
    example: {
      monday: { open: '18:00', close: '02:00' },
      tuesday: { open: '18:00', close: '02:00' },
      wednesday: { open: '18:00', close: '02:00' },
      thursday: { open: '18:00', close: '02:00' },
      friday: { open: '18:00', close: '03:00' },
      saturday: { open: '18:00', close: '03:00' },
      sunday: { closed: true }
    },
    description: 'Horaires d\'ouverture',
    required: false
  })
  @IsOptional()
  @IsObject()
  openingHours?: {
    monday?: { open: string; close: string; closed?: boolean };
    tuesday?: { open: string; close: string; closed?: boolean };
    wednesday?: { open: string; close: string; closed?: boolean };
    thursday?: { open: string; close: string; closed?: boolean };
    friday?: { open: string; close: string; closed?: boolean };
    saturday?: { open: string; close: string; closed?: boolean };
    sunday?: { open: string; close: string; closed?: boolean };
  };

  @ApiProperty({ 
    example: ['WiFi', 'Parking', 'Climatisation', 'Terrasse'],
    description: 'Équipements et services',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiProperty({ 
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'URLs des images',
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ example: 15000, description: 'Gamme de prix (en FCFA)', required: false })
  @IsOptional()
  @IsNumber()
  priceRange?: number;

  @ApiProperty({ example: 200, description: 'Capacité maximale', required: false })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiProperty({ 
    example: {
      facebook: 'https://facebook.com/rooftopabidjan',
      instagram: 'https://instagram.com/rooftopabidjan',
      twitter: 'https://twitter.com/rooftopabidjan'
    },
    description: 'Réseaux sociaux',
    required: false
  })
  @IsOptional()
  @IsObject()
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}

