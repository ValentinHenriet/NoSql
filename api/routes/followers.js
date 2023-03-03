const express = require('express');
const router = express.Router();
//const router = require("express").Router();
// Récupération de la variable pool depuis l'objet app
//const pool = require('../index').pool;
const app = require('../index');
//const pool = app.get('pool');

// Récupération de tous les followers
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM followers');
    res.send(result.rows);
  } catch (err) {
    console.error("Erreur pour Récupération de tous les followers");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Récupération d'un followers par l'id d'un utilisateur
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM followers WHERE id_utilisateur = $1', [id]);
    if (result.rowCount > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send('Utilisateur non trouvé');
    }
  } catch (err) {
    console.error("Erreur pour Récupération des followers pour un utilisateur");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.post("/add", async (req, res) => {
  console.log("in add followers");
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
    INSERT INTO followers (id_utilisateur, id_follower)
    SELECT DISTINCT utilisateur.id_utilisateur, u2.id_utilisateur
    FROM utilisateurs AS utilisateur
    CROSS JOIN LATERAL (
      SELECT id_utilisateur
      FROM utilisateurs
      WHERE id_utilisateur != utilisateur.id_utilisateur
        AND NOT EXISTS (
          SELECT 1
          FROM followers
          WHERE id_utilisateur = utilisateur.id_utilisateur
            AND id_follower = id_utilisateur
        )
      ORDER BY RANDOM()
      LIMIT FLOOR(RANDOM() * 20)
    ) AS u2;`);
    res.send(result);
  } catch (err) {
    console.error("Erreur pour insertion de followers");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.delete("/delete", async (req, res) => {
  try {
    console.log("in delete followers");
    const pool = req.app.locals.pool;
    const result = await pool.query(`
    DELETE FROM followers
    `);
    res.send(result);
  } catch (err) {
    console.error("Erreur pour suppression followers");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});




module.exports = router;
