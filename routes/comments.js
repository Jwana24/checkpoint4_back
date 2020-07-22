// modules
const express = require('express');
const router = express.Router();

// files
const connection = require('../connection');

// create a comment linked to a user and an article
router.post('/users/:idUser/articles/:idArticle', (req, res) => {
  const dataArticle = req.body;
  const idUser = req.params.idUser;
  const idArticle = req.params.idArticle;

  connection.query('INSERT INTO comment SET ?', [dataArticle, idUser, idArticle], (err, _) => {
    if(err){
      res.status(500).send('Erreur lors de la publication du commentaire');
    }
    else{
      res.status(201).send('Le commentaire a bien été posté');
    }
  });
});

// get all comments of one article
router.get('/articles/:id', (req, res) => {
  const idArticle = req.params.id;

  connection.query('SELECT * FROM comment WHERE article_id = ?', [idArticle], (err, results) => {
    if(err){
      res.status(500).send('Erreur lors de la récupération des commentaires');
    }
    else if(results.length === 0){
      res.status(404).send('Aucun commentaire');
    }
    else{
      res.status(200).json(results);
    }
  });
});

// get all comments of one user
router.get('/users/:id', (req, res) => {
  const idUser = req.params.id;

  connection.query('SELECT * FROM comment WHERE user_id = ?', [idUser], (err, results) => {
    if(err){
      res.status(500).send('Erreur lors de la récupération des commentaires');
    }
    else if(results.length === 0){
      res.status(404).send('Aucun commentaire');
    }
    else{
      res.status(200).json(results);
    }
  });
});

// delete a comment (detached the link) linked to an user
router.put('/:idComment/users/:idUser', (req, res) => {
  const idParamsComment = req.params.idComment;
  const idParamsUser = req.params.idUser;
  const idUser = req.body.user_id;
  const bodyUser = idUser || null;

  connection.query('UPDATE comment SET user_id = ? WHERE idcomment = ? AND user_id = ?', [bodyUser, idParamsComment, idParamsUser], (err, _) => {
    if(err){
      // res.status(500).send('Erreur lors de la modification du commentaire');
      res.status(500).send(err);
    } else {
      res.sendStatus(200)
    }
  });
});

// delete a comment (detached the link) linked to an article
router.put('/:idComment/articles/:idArticle', (req, res) => {
  const idParamsComment = req.params.idComment;
  const idParamsArticle = req.params.idArticle;
  const idArticle= req.body.user_id;
  const bodyArticle= idArticle|| null;

  connection.query('UPDATE comment SET article_id = ? WHERE idcomment = ? AND article_id = ?', [bodyArticle, idParamsComment, idParamsArticle], (err, _) => {
    if(err){
      // res.status(500).send('Erreur lors de la modification du commentaire');
      res.status(500).send(err);
    } else {
      res.sendStatus(200)
    }
  });
});

module.exports = router;