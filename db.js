const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_tDiRzN3XAx7S@ep-muddy-haze-abuynqxc-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
