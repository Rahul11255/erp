const knex = require("knex");

require("dotenv").config();

const config = {
  client: "pg",

  connection: {
    connectionString: process.env.DATABASE_URL,

    ssl: {
      rejectUnauthorized: false,
    },
  },

  pool: {
    min: 2,
    max: 10,
  },
};

const db = knex(config);


db.raw("SELECT 1")
  .then(() => {
    console.log("✅ PostgreSQL Connected Successfully");
  })
  .catch((error) => {
    console.log("❌ PostgreSQL Connection Failed");
    console.log(error.message);
  });


module.exports = db;