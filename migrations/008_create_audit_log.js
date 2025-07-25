exports.up = function(knex) {
  return knex.schema.createTable('audit_log', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('action').notNullable();
    table.string('resource_type').notNullable();
    table.string('resource_id');
    table.json('metadata');
    table.string('ip_address');
    table.string('user_agent');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['action']);
    table.index(['resource_type']);
    table.index(['created_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('audit_log');
};