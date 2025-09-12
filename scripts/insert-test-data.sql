-- Script d'insertion de données de test pour EventLink Africa

-- Insérer des utilisateurs de test
INSERT INTO "users" ("firstName", "lastName", "email", "password", "phone", "role", "status", "isEmailVerified") VALUES
('Admin', 'User', 'admin@lumina.africa', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', '+2250701234567', 'admin', 'active', true),
('John', 'Doe', 'john.doe@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', '+2250701234568', 'user', 'active', true),
('Marie', 'Koné', 'marie.kone@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2K', '+2250701234569', 'venue_owner', 'active', true);

-- Insérer des venues de test
INSERT INTO "venues" ("name", "description", "category", "address", "city", "country", "latitude", "longitude", "rating", "reviewCount", "priceRange", "status", "isVerified", "isFeatured", "capacity", "averagePrice", "currency", "ownerId") VALUES
('Restaurant Le Baobab', 'Cuisine africaine authentique dans un cadre chaleureux', 'restaurant', '123 Avenue de la République', 'Abidjan', 'Côte d''Ivoire', 5.3599, -4.0083, 4.5, 127, '€€', 'active', true, true, 80, 15000, 'XOF', 3),
('Cinéma Canal Olympia', 'Cinéma moderne avec les dernières sorties', 'cinema', '456 Boulevard de la Paix', 'Abidjan', 'Côte d''Ivoire', 5.36, -4.0084, 4.2, 89, '€€', 'active', true, true, 200, 5000, 'XOF', 3),
('Lounge Sky Bar', 'Bar panoramique avec vue sur la ville', 'lounge', '789 Rue des Cocotiers', 'Abidjan', 'Côte d''Ivoire', 5.3601, -4.0085, 4.7, 156, '€€€', 'active', true, true, 50, 25000, 'XOF', 3);

-- Insérer des images pour les venues
INSERT INTO "venue_images" ("url", "alt", "isMain", "sortOrder", "venueId") VALUES
('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', 'Restaurant Le Baobab - Vue extérieure', true, 1, 1),
('https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500', 'Cinéma Canal Olympia - Salle de projection', true, 1, 2),
('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500', 'Lounge Sky Bar - Terrasse panoramique', true, 1, 3);

-- Insérer des événements de test
INSERT INTO "events" ("title", "description", "category", "startDate", "endDate", "totalTickets", "availableTickets", "soldTickets", "price", "currency", "status", "isActive", "isFeatured", "venueId", "organizerId") VALUES
('Concert Youssou N''Dour', 'Concert exceptionnel du légendaire chanteur sénégalais', 'concert', '2024-12-15 20:00:00', '2024-12-15 23:00:00', 100, 45, 55, 25000, 'XOF', 'published', true, true, 1, 3),
('Avant-première Black Panther 3', 'Projection en avant-première du nouveau film Marvel', 'cinema', '2024-12-20 19:30:00', '2024-12-20 22:00:00', 150, 120, 30, 5000, 'XOF', 'published', true, true, 2, 3),
('Soirée Jazz au Lounge', 'Soirée jazz avec groupe local et cocktails signature', 'lounge', '2024-12-18 21:00:00', '2024-12-18 01:00:00', 50, 25, 25, 15000, 'XOF', 'published', true, true, 3, 3);

-- Insérer des images pour les événements
INSERT INTO "event_images" ("url", "alt", "isMain", "sortOrder", "eventId") VALUES
('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500', 'Concert Youssou N''Dour - Affiche', true, 1, 1),
('https://images.unsplash.com/photo-1489599804151-0b0b0b0b0b0b?w=500', 'Black Panther 3 - Affiche du film', true, 1, 2),
('https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500', 'Soirée Jazz - Ambiance lounge', true, 1, 3);

-- Insérer des réservations de test
INSERT INTO "bookings" ("bookingNumber", "ticketQuantity", "totalAmount", "currency", "status", "paymentStatus", "paymentMethod", "attendeeInfo", "userId", "eventId") VALUES
('EL001ABC123', 2, 50000, 'XOF', 'confirmed', 'paid', 'mobile_money', '{"firstName":"John","lastName":"Doe","email":"john.doe@example.com","phone":"+2250701234568"}', 2, 1),
('EL002DEF456', 1, 5000, 'XOF', 'confirmed', 'paid', 'card', '{"firstName":"Marie","lastName":"Koné","email":"marie.kone@example.com","phone":"+2250701234569"}', 3, 2);

-- Insérer des avis de test
INSERT INTO "reviews" ("rating", "comment", "type", "isVerified", "isPublic", "userId", "venueId") VALUES
(5, 'Excellent restaurant avec une cuisine authentique et un service impeccable !', 'venue', true, true, 2, 1),
(4, 'Cinéma moderne avec de bonnes conditions de projection.', 'venue', true, true, 3, 2),
(5, 'Lounge exceptionnel avec une vue magnifique sur la ville.', 'venue', true, true, 2, 3);

-- Mettre à jour les compteurs
UPDATE "venues" SET "reviewCount" = (SELECT COUNT(*) FROM "reviews" WHERE "venueId" = "venues"."id" AND "type" = 'venue');
UPDATE "events" SET "soldTickets" = (SELECT COALESCE(SUM("ticketQuantity"), 0) FROM "bookings" WHERE "eventId" = "events"."id" AND "status" = 'confirmed');
UPDATE "events" SET "availableTickets" = "totalTickets" - "soldTickets";
