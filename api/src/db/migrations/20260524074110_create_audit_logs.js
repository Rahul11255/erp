exports.up = function (knex) {
  return knex.schema.createTable("audit_logs", (table) => {
    table.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));

    table.uuid("request_id")
      .references("id")
      .inTable("purchase_requests")
      .onDelete("CASCADE");      

    table.string("action")
      .notNullable();   // 'created', 'submitted', 'approved', 'rejected'

    table.string("from_status")
      .nullable();     // status before change

    table.string("to_status")
      .nullable();     // status after change

    table.uuid("performed_by")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");


    table.timestamp("created_at")
      .defaultTo(knex.fn.now());

    table.index("request_id");
    table.index("performed_by");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("audit_logs");
};