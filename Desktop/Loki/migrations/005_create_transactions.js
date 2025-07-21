exports.up = function(knex) {
  return knex.schema.createTable('transactions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('market_id').notNullable().references('id').inTable('markets').onDelete('CASCADE');
    table.uuid('outcome_id').notNullable().references('id').inTable('market_outcomes').onDelete('CASCADE');
    table.enum('transaction_type', ['buy', 'sell']).notNullable();
    table.decimal('amount', 15, 2).notNullable();
    table.decimal('shares', 15, 4).notNullable();
    table.decimal('price', 10, 8).notNullable();
    table.decimal('fee', 10, 2).notNullable();
    table.decimal('slippage', 10, 8).defaultTo(0.00000000);
    table.string('transaction_hash').unique();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['market_id']);
    table.index(['transaction_type']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};