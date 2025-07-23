const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "MyChatServerDB",
  password: "kingkai",
  port: 5432,
});

module.exports = pool;