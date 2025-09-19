import { IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsArray, IsObject, IsDecimal } from 'class-validator';
import { VenueCategory, VenueStatus } from '../entities/venue.entity';

export class CreateVenueDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(VenueCategory)
  category: VenueCategory;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  coordinates?: string; // PostGIS point

  @IsOptional()
  @IsString()
  priceRange?: string;

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsObject()
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsDecimal()
  averagePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVenueDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(VenueCategory)
  category?: VenueCategory;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsString()
  coordinates?: string;

  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @IsObject()
  openingHours?: any;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsObject()
  contactInfo?: any;

  @IsOptional()
  @IsEnum(VenueStatus)
  status?: VenueStatus;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsDecimal()
  averagePrice?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class VenueResponseDto {
  id: string;
  name: string;
  description: string;
  category: VenueCategory;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  coordinates?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  openingHours?: any;
  amenities: string[];
  contactInfo?: any;
  status: VenueStatus;
  isVerified: boolean;
  isFeatured: boolean;
  capacity: number;
  averagePrice?: number;
  currency: string;
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId?: string;
  images?: any[];
  reviews?: any[];
  events?: any[];

  // Virtual properties
  get isOpen(): boolean {
    if (!this.openingHours) return false;
    
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[now.getDay()];
    const todayHours = this.openingHours[dayName];
    
    if (!todayHours || todayHours.closed) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  }

  get mainImage(): string {
    const mainImg = this.images?.find(img => img.isMain);
    return mainImg?.url || '/images/venue-placeholder.jpg';
  }

  get allImages(): string[] {
    return this.images?.map(img => img.url) || [];
  }
}
