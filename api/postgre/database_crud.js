const PG = require('pg');

const { Pool } = PG;

const DBCONF = {
  host: process.env.POSTGRE_HOST,
  port: process.env.POSTGRE_PORT,
  user: process.env.POSTGRE_USER,
  password: process.env.POSTGRE_PASSWORD,
  database: process.env.POSTGRE_DATABASE,
};

function connect(config = DBCONF) {
  let pool = null;
  try {
    pool = new Pool(config);
  } catch (e) {
    throw new Error(`databaseConnect: ${e.message}`);
  }
  return pool;
}

async function select(db, query) {
  try {
    const result = await db.query(query);
    return result;
  } catch (e) {
    throw new Error(`Field Select: ${e.message}`);
  }
}

module.exports = {
  connect,
  select,
};
