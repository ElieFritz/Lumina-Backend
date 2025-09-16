import { User } from '@/types/auth';

export interface Venue {
  id: string;
  name: string;
  description?: string;
  category: VenueCategory;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: OpeningHours;
  amenities?: string[];
  images?: string[];
  averageRating?: number;
  totalReviews: number;
  priceRange?: number;
  capacity?: number;
  isActive: boolean;
  isVerified: boolean;
  socialMedia?: SocialMedia;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  events?: Event[];
  reviews?: Review[];
  promotions?: Promotion[];
  createdAt: string;
  updatedAt: string;
}

export enum VenueCategory {
  RESTAURANT = 'restaurant',
  CINEMA = 'cinema',
  LOUNGE = 'lounge',
  CONCERT_HALL = 'concert_hall',
  BAR = 'bar',
  CLUB = 'club',
  THEATER = 'theater',
  SPORTS = 'sports',
  OTHER = 'other',
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  eventDate: string;
  endDate?: string;
  price: number;
  maxCapacity?: number;
  currentBookings: number;
  status: EventStatus;
  images?: string[];
  tags?: string[];
  requirements?: EventRequirements;
  ticketTypes?: TicketType[];
  averageRating?: number;
  totalReviews: number;
  isActive: boolean;
  publishedAt?: string;
  bookingDeadline?: string;
  socialMedia?: SocialMedia;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  venue: Venue;
  reservations?: Reservation[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface EventRequirements {
  ageRestriction?: number;
  dressCode?: string;
  specialInstructions?: string;
}

export interface TicketType {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
}

export interface Reservation {
  id: string;
  status: ReservationStatus;
  quantity: number;
  totalAmount: number;
  ticketDetails?: TicketDetails;
  guestInfo?: GuestInfo;
  notes?: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  checkedInAt?: string;
  qrCode?: string;
  user: User;
  event: Event;
  payment?: Payment;
  createdAt: string;
  updatedAt: string;
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface TicketDetails {
  ticketType?: string;
  seatNumbers?: string[];
  specialRequests?: string;
}

export interface GuestInfo {
  name?: string;
  email?: string;
  phone?: string;
  dietaryRestrictions?: string;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  reference?: string;
  paymentDetails?: PaymentDetails;
  processedAt?: string;
  failedAt?: string;
  failureReason?: string;
  refundedAt?: string;
  refundedAmount?: number;
  refundReason?: string;
  refundTransactionId?: string;
  user: User;
  reservation: Reservation;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYSTACK = 'paystack',
  ORANGE_MONEY = 'orange_money',
  MTN_MOBILE_MONEY = 'mtn_mobile_money',
}

export interface PaymentDetails {
  provider?: string;
  providerTransactionId?: string;
  providerReference?: string;
  fees?: number;
  netAmount?: number;
  metadata?: Record<string, any>;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  images?: string[];
  aspects?: ReviewAspects;
  isVerified: boolean;
  helpfulCount: number;
  isReported: boolean;
  reportReason?: string;
  user: User;
  venue?: Venue;
  event?: Event;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAspects {
  service?: number;
  ambiance?: number;
  value?: number;
  cleanliness?: number;
}

export interface Promotion {
  id: string;
  title: string;
  description?: string;
  code: string;
  type: PromotionType;
  value: number;
  minimumAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  usageLimitPerUser?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategories?: string[];
  applicableVenues?: string[];
  applicableEvents?: string[];
  images?: string[];
  createdBy: User;
  venue?: Venue;
  event?: Event;
  createdAt: string;
  updatedAt: string;
}

export enum PromotionType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
}

// User interface moved to auth.ts to avoid duplication

