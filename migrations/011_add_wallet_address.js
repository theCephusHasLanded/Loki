exports.up = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.string('wallet_address').nullable().unique();
    table.index(['wallet_address']);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('users', function(table) {
    table.dropIndex(['wallet_address']);
    table.dropColumn('wallet_address');
  });
};
