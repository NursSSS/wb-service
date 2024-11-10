import knex from 'knex';
import config from './knexfile.ts';

const db = knex(config.development);

async function runMigrations() {
  try {
    await db.migrate.latest();
    console.log('Migrations complete');
  } catch (err) {
    console.error('Migration failed', err);
  } finally {
    await db.destroy();
  }
}

runMigrations();