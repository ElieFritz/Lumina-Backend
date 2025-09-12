import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateImportedPlacesTable1700000000001 implements MigrationInterface {
  name = 'CreateImportedPlacesTable1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'imported_places',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'place_id',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'lat',
            type: 'decimal',
            precision: 10,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'lng',
            type: 'decimal',
            precision: 11,
            scale: 8,
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'google_types',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'categories',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'rating',
            type: 'decimal',
            precision: 3,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'user_ratings_total',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'opening_hours',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'photo_references',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'photo_urls',
            type: 'text',
            isArray: true,
            isNullable: true,
          },
          {
            name: 'business_status',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'price_level',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'source',
            type: 'enum',
            enum: ['google_places', 'manual', 'imported'],
            default: "'google_places'",
          },
          {
            name: 'status',
            type: 'enum',
            enum: ['imported', 'claimed', 'verified', 'rejected', 'pending_verification'],
            default: "'imported'",
          },
          {
            name: 'import_date',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'last_checked',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'claim_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'claim_contact_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'claim_contact_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'claim_justification',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'verified_date',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'verified_by',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'verification_notes',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'google_maps_url',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['owner_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    // Create indexes using raw SQL
    await queryRunner.query(`CREATE INDEX "IDX_imported_places_place_id" ON "imported_places" ("place_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_imported_places_status" ON "imported_places" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_imported_places_source" ON "imported_places" ("source")`);
    await queryRunner.query(`CREATE INDEX "IDX_imported_places_location" ON "imported_places" ("lat", "lng")`);
    await queryRunner.query(`CREATE INDEX "IDX_imported_places_owner_id" ON "imported_places" ("owner_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_imported_places_import_date" ON "imported_places" ("import_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('imported_places');
  }
}
