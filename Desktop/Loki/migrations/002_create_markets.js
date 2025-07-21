exports.up = function(knex) {
  return knex.schema.createTable('markets', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title').notNullable();
    table.text('description').notNullable();
    table.enum('market_type', ['binary', 'categorical', 'scalar']).defaultTo('binary');
    table.timestamp('end_date').notNullable();
    table.text('resolution_criteria').notNullable();
    table.uuid('creator_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.decimal('total_volume', 15, 2).defaultTo(0.00);
    table.enum('status', ['active', 'closed', 'resolved']).defaultTo('active');
    table.decimal('liquidity_parameter', 10, 4).defaultTo(100.0000);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['status']);
    table.index(['creator_id']);
    table.index(['end_date']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('markets');
};