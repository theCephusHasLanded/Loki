exports.up = function(knex) {
  return knex.schema.createTable('market_predictions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('market_id').notNullable().references('id').inTable('markets').onDelete('CASCADE');
    table.uuid('astronomical_event_id').references('id').inTable('astronomical_events');
    table.decimal('confidence', 5, 4).notNullable();
    table.json('predictions');
    table.json('patterns');
    table.string('model_version');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['market_id']);
    table.index(['astronomical_event_id']);
    table.index(['confidence']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('market_predictions');
};