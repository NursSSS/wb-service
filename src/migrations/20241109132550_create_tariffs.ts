import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tariffs', (table) => {
    table.increments('id').primary();
    table.string('warehouseName').notNullable();
    table.string('boxDeliveryAndStorageExpr').notNullable();
    table.string('boxDeliveryBase');
    table.string('boxDeliveryLiter');
    table.string('boxStorageBase');
    table.string('boxStorageLiter');
    table.date('date').notNullable();
    table.unique(['warehouseName', 'date']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tariffs');
}