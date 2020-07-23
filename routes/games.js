// modules
const express = require('express');
const router = express.Router();

// files
const connection = require('../connection');

// create a game
router.post('/', (req, res) => {
  const dataGame = req.body;

  connection.query('INSERT INTO game SET ?', [dataGame], (err, _) => {
    if(err){
      res.status(500).send('Erreur lors de la création du jeu');
    }
    res.status(201).send('Le jeu a bien été crée');
  });
});

// get all games or some, filtered by the game name in the search bar or category and developer in filters
router.get('/', (req, res) => {
  const { category, search, developer } = req.query;
  const requestSELECT = `SELECT
  g.idgame AS game_id,
  g.name AS game_name,
  g.img AS image_game,
  DATE_FORMAT(g.date_release, "%d-%m-%Y") AS date_release,
  d.iddeveloper AS developer_id,
  d.name AS developer_name,
  c.idcategory AS category_id,
  c.name AS category_name
  FROM category_game AS cg
  LEFT JOIN category AS c ON c.idcategory = cg.category_id
  LEFT JOIN game AS g ON g.idgame = cg.game_id
  LEFT JOIN developer AS d on d.iddeveloper = g.developer_id`;
  
  if(category || developer){
    connection.query(`${requestSELECT} WHERE c.name = ? OR d.name = ?`, [category, developer], (err, results) => {
        if(err){
          // res.sendStatus(500);
          res.status(500).send(err);
        }
        else if(results.length === 0){
          res.status(404).send('Aucun jeu ne correspond à ce filtre');
        }
        else{
          res.status(200).json(results);
        }
    });
  }
  else if(search){
    connection.query(`${requestSELECT}
      WHERE g.name LIKE ?
      OR c.name LIKE ?`, ['%' + search + '%', '%' + search + '%'], (err2, finds) => {
        if(err2){
          res.sendStatus(500);
        }
        else if(finds.length === 0){
          res.status(404).send('Aucun jeu ne correspond à votre recherche');
        }
        else{
          res.status(200).json(finds);
        }
    });
  }
  else{
    connection.query(requestSELECT, (err3, allGames) => {
      if(err3){
        res.status(500).send('Erreur lors de la récupération des jeux');
      }
      else{
        res.status(200).json(allGames);
      }
    });
  }
});

// get a game
router.get('/:id', (req, res) => {
  const idGame = req.params.id;

  connection.query('SELECT * FROM game WHERE idgame = ?', [idGame], (err, results) => {
    if(err){
      res.status(500).send('Erreur lors de la récupération du jeu');
    }
    res.status(200).json(results);
  });
});

module.exports = router;