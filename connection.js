const mysql = require('mysql');
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.NODE_HOST,
  user: process.env.NODE_USER,
  password: process.env.NODE_PASSWORD,
  database: process.env.NODE_DATABASE
});

module.exports = connection;