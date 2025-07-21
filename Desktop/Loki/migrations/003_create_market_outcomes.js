exports.up = function(knex) {
  return knex.schema.createTable('market_outcomes', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('market_id').notNullable().references('id').inTable('markets').onDelete('CASCADE');
    table.string('outcome_text').notNullable();
    table.decimal('probability', 10, 8).defaultTo(0.50000000);
    table.decimal('total_volume', 15, 2).defaultTo(0.00);
    table.decimal('total_shares', 15, 4).defaultTo(0.0000);
    table.decimal('liquidity_shares', 15, 4).defaultTo(100.0000);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['market_id']);
    table.unique(['market_id', 'outcome_text']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('market_outcomes');
};