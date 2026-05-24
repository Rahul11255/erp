exports.up = function (knex) {
  return knex.schema

    .raw(`CREATE TYPE priority_level AS ENUM ('LOW', 'MEDIUM', 'HIGH')`)
    .raw(`CREATE TYPE request_status AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')`)

    .createTable("purchase_requests", (table) => {
      table.uuid("id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"));

      table.string("item_name")
        .notNullable();

      table.decimal("quantity", 10, 2)
        .notNullable();

      table.string("unit")             
        .notNullable();

      table.string("department")
        .notNullable();

      table.date("required_date")
        .notNullable();

      table.text("justification");     

      table.enu("priority", ["LOW", "MEDIUM", "HIGH"], {
        useNative: true,
        enumName: "priority_level",
        existingType: true,
      })
      .defaultTo("MEDIUM");

      table.enu("status", ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"], {
        useNative: true,
        enumName: "request_status",
        existingType: true,
      })
      .defaultTo("DRAFT");

      // Foreign keys
      table.uuid("created_by")
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");

      table.uuid("reviewed_by")         
        .references("id")
        .inTable("users")
        .onDelete("SET NULL")
        .nullable();

      table.text("remarks")             
        .nullable();

      table.timestamp("created_at")
        .defaultTo(knex.fn.now());

      table.timestamp("updated_at")
        .defaultTo(knex.fn.now());

      // Indexes for faster filtering
      table.index("status");
      table.index("department");
      table.index("priority");
      table.index("created_by");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("purchase_requests")
    .raw("DROP TYPE IF EXISTS priority_level")
    .raw("DROP TYPE IF EXISTS request_status");
};