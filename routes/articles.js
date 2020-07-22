// modules
const express = require('express');
const router = express.Router();

// files
const connection = require('../connection');

// create an article
router.post('/', (req, res) => {
  const dataArticle = req.body;

  connection.query('INSERT INTO article SET ?', [dataArticle], (err, _) => {
    if(err){
      res.status(500).send('Erreur lors de la création de l\'article');
    }
    res.status(201).send('L\'article a bien été crée');
  });
});

// get all articles or some, filtered by title in the search bar or game name in filters
router.get('/', (req, res) => {
  const { name, search } = req.query;
  
  if(name){
    connection.query(`SELECT *
    FROM article AS a
    JOIN game AS g ON g.idgame = a.game_id
    WHERE g.name = ?`, [name], (err, results) => {
      if(err){
        res.sendStatus(500);
      }
      else if(results.length === 0){
        res.status(404).send('Aucun article ne correspond à ce filtre');
      }
      else{
        res.status(200).json(results);
      }
    });
  }
  else if(search){
    connection.query(`SELECT *
    FROM article AS a
    JOIN game AS g ON g.idgame = a.game_id
    WHERE a.title LIKE ?
    OR g.name LIKE ?`, ['%' + search + '%', '%' + search + '%'], (err2, finds) => {
      if(err2){
        res.sendStatus(500);
      }
      else if(finds.length === 0){
        res.status(404).send('Aucun article ne correspond à votre recherche');
      }
      else{
        res.status(200).json(finds);
      }
    });
  }
  else{
    connection.query(`SELECT *
    FROM article AS a
    JOIN game AS g ON g.idgame = a.game_id`, (err3, allArticles) => {
      if(err3){
        res.status(500).send('Erreur lors de la récupération des articles');
      }
      else{
        res.status(200).json(allArticles);
      }
    });
  }
});

// get an article
router.get('/:id', (req, res) => {
  const idArticle = req.params.id;

  connection.query('SELECT * FROM article WHERE idarticle = ?', [idArticle], (err, results) => {
    if(err){
      res.status(500).send('Erreur lors de la récupération de l\'article');
    }
    res.status(200).json(results);
  });
});

module.exports = router;