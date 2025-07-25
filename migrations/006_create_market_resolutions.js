exports.up = function(knex) {
  return knex.schema.createTable('market_resolutions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('market_id').notNullable().references('id').inTable('markets').onDelete('CASCADE');
    table.uuid('winning_outcome_id').references('id').inTable('market_outcomes');
    table.uuid('resolved_by').notNullable().references('id').inTable('users');
    table.json('resolution_data');
    table.text('resolution_notes');
    table.timestamp('resolved_at').defaultTo(knex.fn.now());
    table.index(['market_id']);
    table.index(['winning_outcome_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('market_resolutions');
};