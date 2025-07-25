exports.up = function(knex) {
  return knex.schema.createTable('positions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('market_id').notNullable().references('id').inTable('markets').onDelete('CASCADE');
    table.uuid('outcome_id').notNullable().references('id').inTable('market_outcomes').onDelete('CASCADE');
    table.decimal('shares', 15, 4).notNullable();
    table.decimal('avg_price', 10, 8).notNullable();
    table.decimal('total_investment', 15, 2).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['market_id']);
    table.index(['outcome_id']);
    table.unique(['user_id', 'market_id', 'outcome_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('positions');
};