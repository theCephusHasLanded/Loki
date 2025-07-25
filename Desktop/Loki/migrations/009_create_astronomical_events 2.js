exports.up = function(knex) {
  return knex.schema.createTable('astronomical_events', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('event_type').notNullable();
    table.timestamp('event_date').notNullable();
    table.text('description');
    table.decimal('significance', 5, 2).defaultTo(0.00);
    table.json('celestial_bodies');
    table.json('coordinates');
    table.json('watson_analysis');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['event_type']);
    table.index(['event_date']);
    table.index(['significance']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('astronomical_events');
};