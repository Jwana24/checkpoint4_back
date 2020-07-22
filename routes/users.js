// modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// files
const connection = require('../connection');

// create an user account
router.post('/', (req, res) => {
  const hashPass = bcrypt.hashSync(req.body.password, 10);
  const dataUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashPass
  };

  connection.query('INSERT INTO user SET ?', [dataUser], (err, results) => {
    if(err){
      res.status(500).send('Erreur lors de votre inscription');
    }
    res.status(201).send('Votre compte a bien été crée');
  });
});

// authorization to access to the user profile
router.post('/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.NODE_SECRET_KEY, (err, authData) => {
    if(err){
      res.status(403).send('Une erreur a été détectée');
    }
    else{
      res.json({
        message: 'Access ok',
        authData
      });
    }
  });
  res.status(403).send('Une erreur a été détectée');
});

// user login by email and password
router.post('/login', (req, res) => {
  const dataUser = {
    email: req.body.email,
    password: req.body.password
  };

  connection.query('SELECT * FROM user WHERE email = ?', [dataUser.email], (err, user) => {
    if(err){
      res.status(500).send('Une erreur a été détectée');
    }
    else{
      const samePass = bcrypt.compareSync(dataUser.password, user[0].password);
      if(!samePass){
        res.status(500).send('Email ou mot de passe incorrect');
      }
      else{
        jwt.sign({ user }, process.env.NODE_SECRET_KEY, (_, token) => {
          res.json({ token });
        });
      }
    }
  });
});

// token verify
function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }
  else{
    res.sendStatus(500);
  }
};

module.exports = router;