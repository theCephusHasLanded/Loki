exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('password_hash').nullable().alter();
    table.string('email').nullable().alter();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('password_hash').notNullable().alter();
    table.string('email').notNullable().alter();
  });
};
