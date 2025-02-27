// Script to migrate events and event_registrations tables from text IDs to UUID
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

// Initialize the PostgreSQL client
const client = postgres(process.env.DATABASE_URL);

async function runMigration() {
  console.log("Starting migration from text IDs to UUIDs...");

  try {
    // First, check the actual table structure
    console.log("Checking event_registrations table structure...");
    const eventRegColumns = await client`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'event_registrations'
    `;
    console.log("Event Registrations Columns:", eventRegColumns);

    console.log("Checking events table structure...");
    const eventsColumns = await client`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'events'
    `;
    console.log("Events Columns:", eventsColumns);

    // Create backup tables
    console.log("Creating backup tables...");
    await client`CREATE TABLE IF NOT EXISTS "events_backup" AS SELECT * FROM "events"`;
    await client`CREATE TABLE IF NOT EXISTS "event_registrations_backup" AS SELECT * FROM "event_registrations"`;

    // If you want to continue with the migration, uncomment the code below
    /*
    // Drop foreign key constraints
    console.log("Dropping foreign key constraints...");
    await client`ALTER TABLE "event_registrations" DROP CONSTRAINT IF EXISTS "event_registrations_event_id_events_id_fk"`;
    // Update column names based on inspection results
    
    // Convert data types for events table
    console.log("Converting events table columns to UUID...");
    await client`ALTER TABLE "events" ALTER COLUMN "id" TYPE uuid USING id::uuid`;
    await client`ALTER TABLE "events" ALTER COLUMN "startup_id" TYPE uuid USING startup_id::uuid`;
    
    // Convert data types for event_registrations table 
    console.log("Converting event_registrations table columns to UUID...");
    await client`ALTER TABLE "event_registrations" ALTER COLUMN "id" TYPE uuid USING id::uuid`;
    await client`ALTER TABLE "event_registrations" ALTER COLUMN "event_id" TYPE uuid USING event_id::uuid`;
    // Use the correct column name for user ID based on inspection
    
    // Recreate foreign key constraints
    console.log("Recreating foreign key constraints...");
    await client`
      ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" 
      FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE
    `;
    // Add other constraints based on inspection results
    */

    console.log("Inspection completed!");
  } catch (error) {
    console.error("Script failed:", error);
  } finally {
    // Close the database connection
    await client.end();
  }
}

runMigration();
