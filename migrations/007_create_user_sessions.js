exports.up = function(knex) {
  return knex.schema.createTable('user_sessions', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('session_token').notNullable().unique();
    table.string('refresh_token').notNullable().unique();
    table.string('ip_address');
    table.string('user_agent');
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index(['user_id']);
    table.index(['session_token']);
    table.index(['refresh_token']);
    table.index(['expires_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_sessions');
};