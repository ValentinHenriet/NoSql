const express = require('express');
const router = express.Router();
//const router = require("express").Router();
// Récupération de la variable pool depuis l'objet app
//const pool = require('../index').pool;
const app = require('../index');
//const pool = app.get('pool');

// Récupération de tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM utilisateurs');
    res.send(result.rows);
  } catch (err) {
    console.error("Erreur pour Récupération de tous les utilisateurs");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Récupération d'un utilisateur par son id
router.get('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    if (result.rowCount > 0) {
      res.send(result.rows[0]);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (err) {
    console.error("Erreur pour Récupération d'un utilisateur par son id");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;
