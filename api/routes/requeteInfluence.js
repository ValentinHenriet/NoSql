const express = require('express');
const router = express.Router();
//const router = require("express").Router();
// Récupération de la variable pool depuis l'objet app
//const pool = require('../index').pool;
const app = require('../index');
//const pool = app.get('pool');

// Récupération d'un utilisateur par son id
router.get('/circles1', async (req, res) => {
  //const id = req.params.id;
    //const id=req.body.id;
    //const niveau=req.body.niveau;
    const id=req.query.id;
    const niveau=req.query.niveau;
  try {
    console.log(id);
    console.log(niveau);
    console.log('in circles1');
    const pool = req.app.locals.pool;
    //const result = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
    const result = await pool.query(`
    WITH RECURSIVE circle(id_utilisateur, nom, profondeur) AS (
      SELECT id_utilisateur, nom, 0
        FROM utilisateurs WHERE id_utilisateur =  ${id}
      UNION ALL
      SELECT u.id_utilisateur, u.nom, inclus.profondeur + 1 
        FROM circle AS inclus, utilisateurs AS u  
        JOIN followers follower ON u.id_utilisateur = follower.id_follower 
        WHERE inclus.id_utilisateur = follower.id_utilisateur AND inclus.profondeur <  ${niveau}) 
    SELECT p.nom_produit,p.id_produit, COUNT(p.id_produit) as nombre_commandes 
    FROM utilisateurs amis 
    JOIN commandes a ON amis.id_utilisateur = a.id_utilisateur 
    JOIN produits p ON a.id_produit = p.id_produit 
    WHERE amis.id_utilisateur IN
    (SELECT id_utilisateur FROM circle)
    GROUP BY p.id_produit;
  `);
    if (result.rowCount > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send('cirles1 pas trouvé');
    }
  } catch (err) {
    console.error("Erreur pour circles1 par l'id utilisateur ou le level");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});


router.get('/circles2', async (req, res) => {
    //const id = req.params.id;
      const id=req.query.id;
      const niveau=req.query.niveau;
      const idProduit=req.query.idProduit;
    try {
      const pool = req.app.locals.pool;
      //const result = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
      const result = await pool.query(`
      WITH RECURSIVE circle(id_utilisateur, nom, profondeur) AS (
        SELECT id_utilisateur, nom, 0
          FROM utilisateurs WHERE id_utilisateur =  ${id}
        UNION ALL
        SELECT u.id_utilisateur, u.nom, inclus.profondeur + 1 
          FROM circle AS inclus, utilisateurs AS u  
          JOIN followers follower ON u.id_utilisateur = follower.id_follower 
          WHERE inclus.id_utilisateur = follower.id_utilisateur AND inclus.profondeur <  ${niveau}) 
      SELECT p.nom_produit,p.id_produit, COUNT(p.id_produit) as nombre_commandes 
      FROM utilisateurs amis 
      JOIN commandes a ON amis.id_utilisateur = a.id_utilisateur 
      JOIN produits p ON a.id_produit = p.id_produit 
      WHERE amis.id_utilisateur IN
      (SELECT id_utilisateur FROM circle) and p.id_produit = ${idProduit}
      GROUP BY p.id_produit;
    `);
      if (result.rowCount > 0) {
        res.send(result.rows);
      } else {
        res.status(404).send('circles2 pas trouvé');
      }
    } catch (err) {
      console.error("Erreur pour circles2 par l'id utilisateur ou le level ou l'id produit");
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
  });
  
router.get('/circles3', async (req, res) => {
    //const id = req.params.id;
      const niveau=req.query.niveau;
      const idProduit=req.query.idProduit;
    try {
      const pool = req.app.locals.pool;
      //const result = await pool.query('SELECT * FROM utilisateurs WHERE id = $1', [id]);
      const result = await pool.query(`
        WITH RECURSIVE circles(id_utilisateur, id_follower, niveau) AS (
            SELECT id_utilisateur, id_follower, 1
            FROM followers
            UNION
            SELECT f.id_utilisateur, f.id_follower, c.niveau + 1
            FROM followers f
            JOIN circles c ON c.id_follower = f.id_utilisateur
            WHERE c.niveau < ${niveau}
        )
        SELECT p.id_produit, COUNT(DISTINCT c.id_utilisateur) AS nombre_personnes
        FROM commandes c
        JOIN circles ci ON c.id_utilisateur = ci.id_follower
        JOIN produits p ON c.id_produit = p.id_produit
        WHERE p.id_produit = ${idProduit} -- Remplacer 1234 par l'ID du produit souhaité
        GROUP BY p.id_produit;
    `);
      if (result.rowCount > 0) {
        res.send(result.rows);
      } else {
        res.status(404).send('circles3 pas trouvé');
      }
    } catch (err) {
      console.error("Erreur pour circles3 par le level ou l'id produit");
      console.error(err);
      res.status(500).send('Erreur serveur');
    }
  });
module.exports = router;
