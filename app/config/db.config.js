const Pool=require('pg').Pool;

const pool = new Pool({
  host:"localhost",
  port:5432,
  user:"postgres",
  password:"Global12$",
  database:"nodedb"
});

module.exports = pool;

