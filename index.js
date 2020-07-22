// modules
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
const dotenv = require('dotenv').config();
const port = process.env.NODE_PORT || 3000;

// files
const api = require('./routes');

app.use('/api', api);

app.listen(port, (err) => {
  if(err){
    throw new Error('Oops ! Something bad happened !');
  }
  console.log(`The server running on port ${port}`);
});