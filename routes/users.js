// modules
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// files
const connection = require('../connection');

// get the user
router.get("/:id", (req, res) => {
  const idUser = req.params.id 
  connection.query("SELECT * from user WHERE iduser = ?",[idUser], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
    } else {
      res.json(results);
    }
  });
});

// create an user account
router.post('/', (req, res) => {
  const hashPass = bcrypt.hashSync(req.body.password, 10);
  const dataUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    nickname: req.body.nickname,
    email: req.body.email,
    description: req.body.description,
    password: hashPass
  };

  connection.query('INSERT INTO user SET ?', [dataUser], (err, _) => {
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
        user[0].password = '';
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

// update an user
router.put('/:id', (req, res) => {
  if(req.body.password != undefined){
    const hashPass = bcrypt.hashSync(req.body.password, 10);
    const dataUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      nickname: req.body.nickname,
      email: req.body.email,
      description: req.body.description,
      password: hashPass
    };
    const paramsUser = req.params.id;
    
    connection.query('UPDATE user SET ? WHERE iduser = ?', [dataUser, paramsUser], (err, _) => {
      if(err){
        // res.status(500).send('Erreur lors de la modification de votre profil');
        res.status(500).send(err);
      }
      else{
        res.status(200).send('Vos données ont bien été modifié');
      }
    });
  }
  else{
    const dataUser = req.body;
    const paramUser = req.params.id;
    connection.query('UPDATE user SET ? WHERE iduser = ?', [dataUser, paramUser], (err2, _) => {
      if(err2){
        // res.status(500).send('Erreur lors de la modification de votre profil');
        res.status(500).send(err2);
      }
      else{
        res.status(200).send('Vos données ont bien été modifié');
      }
    })
  }
});

module.exports = router;