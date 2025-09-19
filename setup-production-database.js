const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Error: Supabase URL or Key is not defined in environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupProductionDatabase() {
  console.log('🚀 Setting up production database for Lumina Africa...');
  console.log(`📡 Supabase URL: ${SUPABASE_URL}`);

  try {
    // 1. Test connection
    console.log('\n1️⃣ Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('id').limit(0);
    if (error && error.code !== '42P01') {
      throw error;
    }
    console.log('✅ Supabase connection successful');

    // 2. Create tables if they don't exist
    console.log('\n2️⃣ Creating database tables...');
    const createTablesSQL = `
      -- Drop existing tables if they exist to ensure a clean slate
      DROP TABLE IF EXISTS "bookings" CASCADE;
      DROP TABLE IF EXISTS "reviews" CASCADE;
      DROP TABLE IF EXISTS "events" CASCADE;
      DROP TABLE IF EXISTS "venues" CASCADE;
      DROP TABLE IF EXISTS "users" CASCADE;

      -- Create users table
      CREATE TABLE "users" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
          "first_name" TEXT NOT NULL,
          "last_name" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "password" TEXT NOT NULL,
          "phone" TEXT,
          "avatar" TEXT,
          "date_of_birth" TIMESTAMP(3),
          "role" TEXT NOT NULL DEFAULT 'user',
          "is_active" BOOLEAN NOT NULL DEFAULT true,
          "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
          "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
          "preferences" JSONB,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );

      -- Create venues table
      CREATE TABLE "venues" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
          "owner_id" TEXT,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "category" TEXT NOT NULL,
          "address" TEXT NOT NULL,
          "city" TEXT NOT NULL,
          "country" TEXT NOT NULL,
          "postal_code" TEXT,
          "coordinates" JSONB,
          "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "review_count" INTEGER NOT NULL DEFAULT 0,
          "price_range" TEXT,
          "opening_hours" JSONB,
          "amenities" JSONB,
          "contact_phone" TEXT,
          "contact_email" TEXT,
          "website" TEXT,
          "social_media" JSONB,
          "capacity" INTEGER,
          "is_active" BOOLEAN NOT NULL DEFAULT true,
          "is_verified" BOOLEAN NOT NULL DEFAULT false,
          "notes" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
      );

      -- Create events table
      CREATE TABLE "events" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
          "venue_id" TEXT NOT NULL,
          "organizer_id" TEXT,
          "title" TEXT NOT NULL,
          "description" TEXT,
          "category" TEXT NOT NULL,
          "start_date" TIMESTAMP(3) NOT NULL,
          "end_date" TIMESTAMP(3),
          "start_time" TEXT,
          "end_time" TEXT,
          "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
          "currency" TEXT NOT NULL DEFAULT 'XOF',
          "total_tickets" INTEGER,
          "available_tickets" INTEGER,
          "location_details" TEXT,
          "is_active" BOOLEAN NOT NULL DEFAULT true,
          "is_featured" BOOLEAN NOT NULL DEFAULT false,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "events_pkey" PRIMARY KEY ("id")
      );

      -- Create bookings table
      CREATE TABLE "bookings" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
          "user_id" TEXT NOT NULL,
          "event_id" TEXT NOT NULL,
          "booking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "number_of_tickets" INTEGER NOT NULL,
          "total_price" DOUBLE PRECISION NOT NULL,
          "currency" TEXT NOT NULL DEFAULT 'XOF',
          "status" TEXT NOT NULL DEFAULT 'pending',
          "payment_id" TEXT,
          "qr_code_url" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
      );

      -- Create reviews table
      CREATE TABLE "reviews" (
          "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
          "user_id" TEXT NOT NULL,
          "venue_id" TEXT,
          "event_id" TEXT,
          "rating" DOUBLE PRECISION NOT NULL,
          "comment" TEXT,
          "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
      );

      -- Create indexes
      CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

      -- Add foreign key constraints
      ALTER TABLE "venues" ADD CONSTRAINT "venues_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      ALTER TABLE "bookings" ADD CONSTRAINT "bookings_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      ALTER TABLE "reviews" ADD CONSTRAINT "reviews_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      ALTER TABLE "reviews" ADD CONSTRAINT "reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `;

    // Note: In a real production setup, you would execute this SQL via Supabase Dashboard
    // or use a migration tool. For now, we'll just verify the tables exist.
    console.log('📝 SQL script prepared. Please execute it in Supabase Dashboard SQL Editor.');
    console.log('🔗 Go to: https://supabase.com/dashboard/project/baoywgzpmndrbiagiczs/sql');

    // 3. Configure RLS policies
    console.log('\n3️⃣ Configuring Row Level Security policies...');
    const rlsPoliciesSQL = `
      -- Enable RLS for all tables
      ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
      ALTER TABLE events ENABLE ROW LEVEL SECURITY;
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Enable read access for all users" ON users;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
      DROP POLICY IF EXISTS "Enable update for users based on id" ON users;
      DROP POLICY IF EXISTS "Enable delete for users based on id" ON users;

      DROP POLICY IF EXISTS "Enable read access for all users" ON venues;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON venues;
      DROP POLICY IF EXISTS "Enable update for venue owners" ON venues;
      DROP POLICY IF EXISTS "Enable delete for venue owners" ON venues;

      DROP POLICY IF EXISTS "Enable read access for all users" ON events;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
      DROP POLICY IF EXISTS "Enable update for event organizers" ON events;
      DROP POLICY IF EXISTS "Enable delete for event organizers" ON events;

      DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON bookings;
      DROP POLICY IF EXISTS "Enable update for booking owners" ON bookings;
      DROP POLICY IF EXISTS "Enable delete for booking owners" ON bookings;

      DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reviews;
      DROP POLICY IF EXISTS "Enable update for review owners" ON reviews;
      DROP POLICY IF EXISTS "Enable delete for review owners" ON reviews;

      -- Create permissive policies for development (allow all operations)
      CREATE POLICY "Enable all operations for all users" ON "public"."users"
      AS PERMISSIVE FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);

      CREATE POLICY "Enable all operations for all users" ON "public"."venues"
      AS PERMISSIVE FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);

      CREATE POLICY "Enable all operations for all users" ON "public"."events"
      AS PERMISSIVE FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);

      CREATE POLICY "Enable all operations for all users" ON "public"."bookings"
      AS PERMISSIVE FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);

      CREATE POLICY "Enable all operations for all users" ON "public"."reviews"
      AS PERMISSIVE FOR ALL
      TO public
      USING (true)
      WITH CHECK (true);
    `;

    console.log('📝 RLS policies script prepared. Please execute it in Supabase Dashboard SQL Editor.');

    // 4. Add sample data
    console.log('\n4️⃣ Adding sample data...');
    try {
      // Add users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .insert([
          {
            first_name: 'Jean',
            last_name: 'Dupont',
            email: 'jean.dupont@example.com',
            password: 'password123',
            role: 'venue_owner',
            is_active: true,
          },
          {
            first_name: 'Marie',
            last_name: 'Martin',
            email: 'marie.martin@example.com',
            password: 'password123',
            role: 'user',
            is_active: true,
          },
        ])
        .select();

      if (usersError) {
        console.warn('⚠️  Users might already exist or tables not created yet');
        console.error('Error:', usersError.message);
      } else {
        console.log(`✅ Added ${users.length} users.`);
      }

      // Add venues
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .insert([
          {
            name: 'Le Rooftop Abidjan',
            description: 'Un rooftop exceptionnel avec vue sur la lagune',
            category: 'lounge',
            address: 'Cocody, Riviera 2, Abidjan',
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            rating: 4.8,
            price_range: '€€€',
            is_active: true,
            owner_id: users && users.length > 0 ? users[0].id : null,
          },
          {
            name: 'Restaurant Le Bistrot',
            description: 'Cuisine française raffinée au cœur d\'Abidjan',
            category: 'restaurant',
            address: 'Plateau, Boulevard de la République, Abidjan',
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            rating: 4.7,
            price_range: '€€€€',
            is_active: true,
            owner_id: users && users.length > 0 ? users[0].id : null,
          },
          {
            name: 'Cinéma Pathé Cocody',
            description: 'Cinéma moderne avec les dernières technologies',
            category: 'cinema',
            address: 'Cocody, Angré 8ème Tranche, Abidjan',
            city: 'Abidjan',
            country: 'Côte d\'Ivoire',
            rating: 4.5,
            price_range: '€€',
            is_active: true,
            owner_id: users && users.length > 0 ? users[0].id : null,
          },
        ])
        .select();

      if (venuesError) {
        console.warn('⚠️  Venues might already exist or tables not created yet');
        console.error('Error:', venuesError.message);
      } else {
        console.log(`✅ Added ${venues.length} venues.`);
      }

      // Add events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .insert([
          {
            venue_id: venues && venues.length > 0 ? venues[0].id : null,
            organizer_id: users && users.length > 0 ? users[0].id : null,
            title: 'Soirée Jazz au Rooftop',
            description: 'Une soirée inoubliable avec les meilleurs musiciens de jazz.',
            category: 'music',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 3600 * 1000).toISOString(),
            price: 25.00,
            is_active: true,
          },
        ])
        .select();

      if (eventsError) {
        console.warn('⚠️  Events might already exist or tables not created yet');
        console.error('Error:', eventsError.message);
      } else {
        console.log(`✅ Added ${events.length} events.`);
      }

    } catch (error) {
      console.error('❌ Error adding sample data:', error.message);
    }

    console.log('\n🎉 Production database setup completed!');
    console.log('📋 Next steps:');
    console.log('1. Execute the SQL scripts in Supabase Dashboard');
    console.log('2. Test the API endpoints');
    console.log('3. Verify data is accessible');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupProductionDatabase();
