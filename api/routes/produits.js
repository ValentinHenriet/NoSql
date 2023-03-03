const express = require('express');
const router = express.Router();
//const router = require("express").Router();
// Récupération de la variable pool depuis l'objet app
//const pool = require('../index').pool;
const app = require('../index');
//const pool = app.get('pool');

// Récupération de tous les produits
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM produits');
    res.send(result.rows);
  } catch (err) {
    console.error("Erreur pour Récupération de tous les produits");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Récupération d'un produits par son id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM produits WHERE id_produit = $1', [id]);
    if (result.rowCount > 0) {
      res.send(result.rows[0]);
    } else {
      res.status(404).send('Produit non trouvé');
    }
  } catch (err) {
    console.error("Erreur pour recherche d'un produit par son id");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.post("/add", async (req, res) => {
  console.log("in add produits");
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`insert into produits(nom_produit)
    select substr(md5(random()::text),1,10)
    from generate_series(1,100)`);
    res.send(result);
  } catch (err) {
    console.error("Erreur pour insertion de 100 produits par son id");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.delete("/delete", async (req, res) => {
  try {
    console.log("in delete produits");
    const pool = req.app.locals.pool;
    const result = await pool.query(`
    DELETE FROM produits
    `);
    res.send(result);
  } catch (err) {
    console.error("Erreur pour delete produits");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});




module.exports = router;
