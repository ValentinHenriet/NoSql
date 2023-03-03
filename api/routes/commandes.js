const express = require('express');
const router = express.Router();
//const router = require("express").Router();
// Récupération de la variable pool depuis l'objet app
//const pool = require('../index').pool;
const app = require('../index');
//const pool = app.get('pool');

// Récupération de tous les commandes
router.get('/', async (req, res) => {
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM commandes');
    res.send(result.rows);
  } catch (err) {
    console.error("Erreur pour Récupération de toutes les commandes");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// Récupération d'une commande par l'id d'un utilisateur
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query('SELECT * FROM commandes WHERE id_utilisateur = $1', [id]);
    if (result.rowCount > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send('Commandes non trouvé pour cet utilisateur');
    }
  } catch (err) {
    console.error("Erreur pour récupération de commandes par l'id d'un utilisateur");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.post("/add", async (req, res) => {
  console.log("in add commandes");
  try {
    const pool = req.app.locals.pool;
    const result = await pool.query(`
    DO $$ 
    DECLARE
        u record;
        p record;
        i integer;
    BEGIN
        FOR u IN SELECT * FROM utilisateurs LOOP
            FOR i IN 1..(random()*5)::integer LOOP
                SELECT * FROM produits ORDER BY random() LIMIT 1 INTO p;
                INSERT INTO commandes (id_utilisateur, id_produit) 
                VALUES (u.id_utilisateur, p.id_produit);
            END LOOP;
        END LOOP;
    END $$;`);
    res.send(result);
  } catch (err) {
    console.error("Erreur pour insertion de commandes");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.delete("/delete", async (req, res) => {
  try {
    console.log("in delete commandes");
    const pool = req.app.locals.pool;
    const result = await pool.query(`
    DELETE FROM commandes
    `);
    res.send(result);
  } catch (err) {
    console.error("Erreur pour delete commandes");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});




module.exports = router;
