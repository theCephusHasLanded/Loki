exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').notNullable().unique();
    table.string('username').notNullable().unique();
    table.string('password_hash').notNullable();
    table.decimal('wallet_balance', 15, 2).defaultTo(0.00);
    table.enum('kyc_status', ['pending', 'approved', 'rejected']).defaultTo('pending');
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.index(['email']);
    table.index(['username']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};