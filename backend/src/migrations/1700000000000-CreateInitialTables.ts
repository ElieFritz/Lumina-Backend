import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Créer la table users
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "firstName" character varying(50) NOT NULL,
        "lastName" character varying(50) NOT NULL,
        "email" character varying(100) NOT NULL,
        "password" character varying NOT NULL,
        "phone" character varying(20),
        "role" character varying NOT NULL DEFAULT 'user',
        "status" character varying NOT NULL DEFAULT 'active',
        "isEmailVerified" boolean NOT NULL DEFAULT false,
        "emailVerificationToken" character varying,
        "passwordResetToken" character varying,
        "passwordResetExpires" TIMESTAMP,
        "profileImage" character varying,
        "dateOfBirth" date,
        "gender" character varying(10),
        "bio" text,
        "preferences" json,
        "socialLinks" json,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Créer la table venues
    await queryRunner.query(`
      CREATE TABLE "venues" (
        "id" SERIAL NOT NULL,
        "name" character varying(100) NOT NULL,
        "description" text NOT NULL,
        "category" character varying NOT NULL,
        "address" character varying(200) NOT NULL,
        "city" character varying(50) NOT NULL,
        "country" character varying(50) NOT NULL,
        "postalCode" character varying(10),
        "coordinates" geometry(Point,4326),
        "rating" numeric(3,2) NOT NULL DEFAULT '0',
        "reviewCount" integer NOT NULL DEFAULT '0',
        "priceRange" character varying(10) NOT NULL,
        "openingHours" json,
        "amenities" json,
        "contactInfo" json,
        "status" character varying NOT NULL DEFAULT 'pending',
        "isVerified" boolean NOT NULL DEFAULT false,
        "isFeatured" boolean NOT NULL DEFAULT false,
        "capacity" integer NOT NULL DEFAULT '0',
        "averagePrice" numeric(10,2),
        "currency" character varying(10) NOT NULL DEFAULT 'XOF',
        "tags" json,
        "notes" text,
        "ownerId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_venues" PRIMARY KEY ("id")
      )
    `);

    // Créer la table venue_images
    await queryRunner.query(`
      CREATE TABLE "venue_images" (
        "id" SERIAL NOT NULL,
        "url" character varying(500) NOT NULL,
        "alt" character varying(200),
        "isMain" boolean NOT NULL DEFAULT false,
        "sortOrder" integer NOT NULL DEFAULT '0',
        "width" integer,
        "height" integer,
        "format" character varying(50),
        "fileSize" bigint,
        "venueId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_venue_images" PRIMARY KEY ("id")
      )
    `);

    // Créer la table events
    await queryRunner.query(`
      CREATE TABLE "events" (
        "id" SERIAL NOT NULL,
        "title" character varying(200) NOT NULL,
        "description" text NOT NULL,
        "category" character varying NOT NULL,
        "startDate" TIMESTAMP NOT NULL,
        "endDate" TIMESTAMP NOT NULL,
        "doorOpenTime" TIMESTAMP,
        "totalTickets" integer NOT NULL DEFAULT '0',
        "availableTickets" integer NOT NULL DEFAULT '0',
        "soldTickets" integer NOT NULL DEFAULT '0',
        "ticketType" character varying NOT NULL DEFAULT 'paid',
        "price" numeric(10,2) NOT NULL DEFAULT '0',
        "currency" character varying(10) NOT NULL DEFAULT 'XOF',
        "earlyBirdPrice" numeric(10,2),
        "earlyBirdEndDate" TIMESTAMP,
        "vipPrice" numeric(10,2),
        "vipTickets" integer,
        "status" character varying NOT NULL DEFAULT 'draft',
        "isActive" boolean NOT NULL DEFAULT false,
        "isFeatured" boolean NOT NULL DEFAULT false,
        "minAge" integer NOT NULL DEFAULT '0',
        "requirements" json,
        "tags" json,
        "termsAndConditions" text,
        "refundPolicy" text,
        "socialLinks" json,
        "rating" numeric(3,2) NOT NULL DEFAULT '0',
        "reviewCount" integer NOT NULL DEFAULT '0',
        "venueId" integer NOT NULL,
        "organizerId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_events" PRIMARY KEY ("id")
      )
    `);

    // Créer la table event_images
    await queryRunner.query(`
      CREATE TABLE "event_images" (
        "id" SERIAL NOT NULL,
        "url" character varying(500) NOT NULL,
        "alt" character varying(200),
        "isMain" boolean NOT NULL DEFAULT false,
        "sortOrder" integer NOT NULL DEFAULT '0',
        "width" integer,
        "height" integer,
        "format" character varying(50),
        "fileSize" bigint,
        "eventId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_event_images" PRIMARY KEY ("id")
      )
    `);

    // Créer la table bookings
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" SERIAL NOT NULL,
        "bookingNumber" character varying(50) NOT NULL,
        "ticketQuantity" integer NOT NULL DEFAULT '1',
        "totalAmount" numeric(10,2) NOT NULL,
        "currency" character varying(10) NOT NULL DEFAULT 'XOF',
        "status" character varying NOT NULL DEFAULT 'pending',
        "paymentStatus" character varying NOT NULL DEFAULT 'pending',
        "paymentMethod" character varying,
        "paymentReference" character varying(100),
        "transactionId" character varying(100),
        "paymentDetails" json,
        "attendeeInfo" json,
        "specialRequests" text,
        "qrCode" json,
        "checkedInAt" TIMESTAMP,
        "cancelledAt" TIMESTAMP,
        "cancellationReason" text,
        "refundAmount" numeric(10,2) NOT NULL DEFAULT '0',
        "refundedAt" TIMESTAMP,
        "refundReason" text,
        "metadata" json,
        "userId" integer NOT NULL,
        "eventId" integer NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_bookings_bookingNumber" UNIQUE ("bookingNumber"),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id")
      )
    `);

    // Créer la table reviews
    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id" SERIAL NOT NULL,
        "rating" integer NOT NULL DEFAULT '5',
        "comment" text,
        "type" character varying NOT NULL,
        "aspects" json,
        "images" json,
        "isVerified" boolean NOT NULL DEFAULT false,
        "isPublic" boolean NOT NULL DEFAULT false,
        "helpfulCount" integer NOT NULL DEFAULT '0',
        "reportCount" integer NOT NULL DEFAULT '0',
        "isReported" boolean NOT NULL DEFAULT false,
        "reportReason" text,
        "metadata" json,
        "userId" integer NOT NULL,
        "venueId" integer,
        "eventId" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id")
      )
    `);

    // Créer les index pour les performances
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_venues_category" ON "venues" ("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_venues_city" ON "venues" ("city")`);
    await queryRunner.query(`CREATE INDEX "IDX_venues_status" ON "venues" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_events_category" ON "events" ("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_events_startDate" ON "events" ("startDate")`);
    await queryRunner.query(`CREATE INDEX "IDX_events_status" ON "events" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_bookings_userId" ON "bookings" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_bookings_eventId" ON "bookings" ("eventId")`);
    await queryRunner.query(`CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_reviews_userId" ON "reviews" ("userId")`);
    await queryRunner.query(`CREATE INDEX "IDX_reviews_venueId" ON "reviews" ("venueId")`);
    await queryRunner.query(`CREATE INDEX "IDX_reviews_eventId" ON "reviews" ("eventId")`);

    // Créer les clés étrangères
    await queryRunner.query(`ALTER TABLE "venues" ADD CONSTRAINT "FK_venues_ownerId" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE "venue_images" ADD CONSTRAINT "FK_venue_images_venueId" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_events_venueId" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_events_organizerId" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE SET NULL`);
    await queryRunner.query(`ALTER TABLE "event_images" ADD CONSTRAINT "FK_event_images_eventId" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_eventId" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_reviews_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_reviews_venueId" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_reviews_eventId" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les clés étrangères
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_reviews_eventId"`);
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_reviews_venueId"`);
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_reviews_userId"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_eventId"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_userId"`);
    await queryRunner.query(`ALTER TABLE "event_images" DROP CONSTRAINT "FK_event_images_eventId"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_events_organizerId"`);
    await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_events_venueId"`);
    await queryRunner.query(`ALTER TABLE "venue_images" DROP CONSTRAINT "FK_venue_images_venueId"`);
    await queryRunner.query(`ALTER TABLE "venues" DROP CONSTRAINT "FK_venues_ownerId"`);

    // Supprimer les index
    await queryRunner.query(`DROP INDEX "IDX_reviews_eventId"`);
    await queryRunner.query(`DROP INDEX "IDX_reviews_venueId"`);
    await queryRunner.query(`DROP INDEX "IDX_reviews_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_status"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_eventId"`);
    await queryRunner.query(`DROP INDEX "IDX_bookings_userId"`);
    await queryRunner.query(`DROP INDEX "IDX_events_status"`);
    await queryRunner.query(`DROP INDEX "IDX_events_startDate"`);
    await queryRunner.query(`DROP INDEX "IDX_events_category"`);
    await queryRunner.query(`DROP INDEX "IDX_venues_status"`);
    await queryRunner.query(`DROP INDEX "IDX_venues_city"`);
    await queryRunner.query(`DROP INDEX "IDX_venues_category"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);

    // Supprimer les tables
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "event_images"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "venue_images"`);
    await queryRunner.query(`DROP TABLE "venues"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
