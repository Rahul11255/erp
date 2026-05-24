exports.up = function (knex) {

  return knex.schema.createTable("users", (table) => {

    table.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    table.string("google_id")
      .unique();
    table.string("email")
      .notNullable()
      .unique();
    table.string("name");
    table.text("avatar");
    table.enu("role", ["EMPLOYEE", "MANAGER"], {
      useNative: true,
      enumName: "user_roles",
    })
    .defaultTo("EMPLOYEE");

    table.timestamp("created_at")
      .defaultTo(knex.fn.now());

  });

};


exports.down = function (knex) {

  return knex.schema
    .dropTableIfExists("users")
    .raw("DROP TYPE IF EXISTS user_roles");

};