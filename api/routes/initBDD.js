const express = require('express');
const router = express.Router();
//const router = require("express").Router();
// Récupération de la variable pool depuis l'objet app
//const pool = require('../index').pool;
const app = require('../index');
//const pool = app.get('pool');

// Initialisation des commandes
router.post('/', async (req, res) => {
  try {
    console.log("in initBdd");
    const pool = req.app.locals.pool;
    const result = await pool.query(`
    DELETE FROM Commandes;
    DELETE FROM Followers;
    DELETE FROM Produits;
    DELETE FROM Utilisateurs;
    
    ALTER SEQUENCE utilisateurs_id_seq RESTART WITH 1;
    ALTER SEQUENCE produits_id_produit_seq RESTART WITH 1;
    
    INSERT INTO utilisateurs (nom) 
    SELECT substr(md5(random()::text),1,10)
    FROM generate_series(1,10000);
    
    insert into produits(nom_produit)
    select substr(md5(random()::text),1,10)
    from generate_series(1,100);
    
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
    ) AS u2;
    
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
    console.log("end req initBDD");
    res.send(result);
  } catch (err) {
    console.error("Erreur pour Récupération de toutes les commandes");
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

module.exports = router;