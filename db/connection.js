const { Pool } = require("pg");
const fs = require("fs");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const config = {};

if (ENV === "production") {
  config.user = process.env.DB_USER,
  config.password = process.env.DB_PASSWORD,
  config.host = process.env.DB_HOST,
  config.port = 28540,
  config.database = process.env.DB_NAME,
  config.ssl = {
      rejectUnauthorized: true,
      ca: fs.readFileSync("./ca.pem").toString(),
  }
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

module.exports = new Pool(config);
