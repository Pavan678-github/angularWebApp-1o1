const {Pool} = require("pg");
const db = require('../configs/db.config');

const pool = new Pool(db);

module.exports ={
    pool
}