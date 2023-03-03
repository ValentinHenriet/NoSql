--Creation table utilisateurs

--reset la séquence
ALTER SEQUENCE utilisateurs_id_seq RESTART WITH 1;
ALTER SEQUENCE produits_id_produit_seq RESTART WITH 1;

--Creation table produits

-- Table Utilisateurs
CREATE TABLE Utilisateurs (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR(500)
);
--placer un index
CREATE INDEX idx_utilisateurs_id_utilisateur
ON utilisateurs (id_utilisateur);


-- Table Produits
CREATE TABLE Produits (
  id_produit SERIAL PRIMARY KEY,
  nom_produit VARCHAR(500)
);

-- Table Commandes
CREATE TABLE Commandes (
  id_utilisateur INT,
  id_produit INT,
  FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
  FOREIGN KEY (id_produit) REFERENCES Produits(id_produit)
);

-- Table Followers
CREATE TABLE Followers (
  id_utilisateur INT,
  id_follower INT,
  FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id_utilisateur),
  FOREIGN KEY (id_follower) REFERENCES Utilisateurs(id_utilisateur)
);

--Initialisation des tables pour tester les requêtes dans de bonnes conditions
DELETE FROM Commandes;
DELETE FROM Followers;
DELETE FROM Produits;
DELETE FROM Utilisateurs;--25 secondes si il y a 20 000 utilisateurs(long car il y a index)
--Query returned successfully in 42 secs 494 msec. (2min pour 20 000 utilisateurs et 200 000)

ALTER SEQUENCE utilisateurs_id_seq RESTART WITH 1;
ALTER SEQUENCE produits_id_produit_seq RESTART WITH 1;

INSERT INTO utilisateurs (nom) 
SELECT substr(md5(random()::text),1,10)
FROM generate_series(1,10000);
---288 ms et avec index sur id_utilisateur 566ms

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
END $$;

--9min 25 sec et pour 100 000 utilisateurs 1000 produits Query returned successfully in 25 min 50 secs.
-- --------------------------------------------------------------------------------

-- INSERTION DANS NOS TABLES

-- Insertion dans Utilisateurs

INSERT INTO utilisateurs (nom) 
SELECT substr(md5(random()::text),1,10)
FROM generate_series(1,10000);
--alternative insertiton 10 utilisateurs
INSERT INTO Utilisateurs (nom)
VALUES
  ('utilisateur1'),
  ('utilisateur2'),
  ('utilisateur3'),
  ('utilisateur4'),
  ('utilisateur5'),
  ('utilisateur6'),
  ('utilisateur7'),
  ('utilisateur8'),
  ('utilisateur9'),
  ('utilisateur10');

-- Insertion dans Produits

insert into produits(nom_produit)
select substr(md5(random()::text),1,10)
from generate_series(1,100);
--alternative insertion 10 produits 
INSERT INTO Produits (nom_produit)
VALUES
  ('produits1'),
  ('produits2'),
  ('produits3'),
  ('produits4'),
  ('produits5'),
  ('produits6'),
  ('produits7'),
  ('produits8'),
  ('produits9'),
  ('produits10');

-- Insertion dans Followers (beaucoup plus rapide)

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
-- Query returned successfully in 2 min 02 secs et 20 secondes avec index sur id_utilisateur et 10 000 utilisateurs

-- Requête d'insertion ci-dessous trop longue 
DO $$
DECLARE
  utilisateur RECORD;
  i INTEGER;
  nb_followers INTEGER;
BEGIN
  FOR utilisateur IN SELECT * FROM utilisateurs
  LOOP
    nb_followers := FLOOR(RANDOM() * 20);
    FOR i IN 1..nb_followers LOOP
      INSERT INTO followers (id_utilisateur, id_follower)
      SELECT utilisateur.id_utilisateur, u2.id_utilisateur
      FROM utilisateurs u2
      WHERE u2.id_utilisateur != utilisateur.id_utilisateur
        AND NOT EXISTS (
          SELECT 1
          FROM followers
          WHERE id_utilisateur = utilisateur.id_utilisateur
            AND id_follower = u2.id_utilisateur
        )
      ORDER BY RANDOM()
      LIMIT 1;
    END LOOP;
  END LOOP;
END $$;

-- Query returned successfully in 7 min 12 secs

-- Insertion dans Commandes (par contre un id peut commander plusieurs fois le même produit)

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
END $$;
--Query returned successfully in 1 secs 671 msec. (100 products)
----------
--suppression de 10 000 utilisateurs
DELETE FROM commandes 
WHERE id_utilisateur IN (SELECT id_utilisateur FROM utilisateurs LIMIT 10000);

DELETE FROM followers 
WHERE id_utilisateur IN (SELECT id_utilisateur FROM utilisateurs LIMIT 10000);

DELETE FROM utilisateurs 
WHERE id_utilisateur IN (SELECT id_utilisateur FROM utilisateurs LIMIT 10000);
--31secondes pour cette requête

-- ---------------------------------------------------------------------------------

--Requete 1
WITH RECURSIVE circles(id_utilisateur, id_follower, niveau) AS (
    SELECT id_utilisateur, id_follower, 1 
    FROM followers 
    WHERE id_utilisateur = 3
  UNION
    SELECT f.id_utilisateur, f.id_follower, c.niveau + 1 
    FROM followers f
    JOIN circles c ON c.id_utilisateur = f.id_follower
    WHERE c.niveau < 4
)
SELECT p.id_produit, COUNT(DISTINCT c.id_utilisateur) AS nombre_commandes
FROM commandes c
JOIN circles ci ON c.id_utilisateur = ci.id_follower
JOIN produits p ON c.id_produit = p.id_produit
GROUP BY p.id_produit;

----

 WITH RECURSIVE circle(id_utilisateur, nom, profondeur) AS (
         SELECT id_utilisateur, nom, 0
           FROM utilisateurs WHERE id_utilisateur =  2
         UNION ALL
         SELECT u.id_utilisateur, u.nom, inclus.profondeur + 1 
           FROM circle AS inclus, utilisateurs AS u  
           JOIN followers follower ON u.id_utilisateur = follower.id_utilisateur 
           WHERE inclus.id_utilisateur = follower.id_follower AND inclus.profondeur <  + 3 ) 
       SELECT p.nom_produit,p.id_produit, COUNT(p.id_produit) as nombre_commandes 
       FROM utilisateurs amis 
       JOIN commandes a ON amis.id_utilisateur = a.id_utilisateur 
       JOIN produits p ON a.id_produit = p.id_produit 
       WHERE amis.id_utilisateur IN
         (SELECT id_utilisateur FROM circle) 
       GROUP BY p.id_produit;
--correction
 WITH RECURSIVE circle(id_utilisateur, nom, profondeur) AS (
         SELECT id_utilisateur, nom, 0
           FROM utilisateurs WHERE id_utilisateur =  20002
         UNION ALL
         SELECT u.id_utilisateur, u.nom, inclus.profondeur + 1 
           FROM circle AS inclus, utilisateurs AS u  
           JOIN followers follower ON u.id_utilisateur = follower.id_follower 
           WHERE inclus.id_utilisateur = follower.id_utilisateur AND inclus.profondeur <  2) 
SELECT p.nom_produit,p.id_produit, COUNT(p.id_produit) as nombre_commandes 
FROM utilisateurs amis 
JOIN commandes a ON amis.id_utilisateur = a.id_utilisateur 
JOIN produits p ON a.id_produit = p.id_produit 
WHERE amis.id_utilisateur IN
 (SELECT id_utilisateur FROM circle)
GROUP BY p.id_produit;

--Requete 2
WITH RECURSIVE circles(id_utilisateur, id_follower, niveau) AS (
SELECT id_utilisateur, id_follower, 1
FROM followers
WHERE id_utilisateur = 2
UNION
SELECT f.id_utilisateur, f.id_follower, c.niveau + 1
FROM followers f
JOIN circles c ON c.id_follower = f.id_utilisateur
WHERE c.niveau < 4
)
SELECT p.id_produit, COUNT(DISTINCT c.id_utilisateur) AS nombre_commandes
FROM commandes c
JOIN circles ci ON c.id_utilisateur = ci.id_follower
JOIN produits p ON c.id_produit = p.id_produit
WHERE p.id_produit = 99 -- Remplacer 1234 par l'ID du produit souhaité
GROUP BY p.id_produit;
--requete alt
WITH RECURSIVE circle(id_utilisateur, nom, profondeur) AS (
      SELECT id_utilisateur, nom, 0
      FROM utilisateurs WHERE id_utilisateur =  10001
      UNION ALL
      SELECT u.id_utilisateur, u.nom, inclus.profondeur + 1
        FROM circle AS inclus,utilisateurs AS u
        JOIN followers follower ON u.id_utilisateur = follower.id_utilisateur
        WHERE inclus.id_utilisateur = follower.id_follower AND inclus.profondeur < 2)
SELECT p.nom_produit,p.id_produit, COUNT(p.id_produit) as nombre_commandes
FROM utilisateurs amis
JOIN commandes a ON amis.id_utilisateur = a.id_utilisateur
JOIN produits p ON a.id_produit = p.id_produit
JOIN circle inclus ON inclus.id_utilisateur = amis.id_utilisateur
WHERE p.id_produit = 87
GROUP BY p.id_produit;
--correction 
  WITH RECURSIVE circle(id_utilisateur, nom, profondeur) AS (
         SELECT id_utilisateur, nom, 0
           FROM utilisateurs WHERE id_utilisateur =  20002
         UNION ALL
         SELECT u.id_utilisateur, u.nom, inclus.profondeur + 1 
           FROM circle AS inclus, utilisateurs AS u  
           JOIN followers follower ON u.id_utilisateur = follower.id_follower 
           WHERE inclus.id_utilisateur = follower.id_utilisateur AND inclus.profondeur <  2) 
SELECT p.nom_produit,p.id_produit, COUNT(p.id_produit) as nombre_commandes 
FROM utilisateurs amis 
JOIN commandes a ON amis.id_utilisateur = a.id_utilisateur 
JOIN produits p ON a.id_produit = p.id_produit 
WHERE amis.id_utilisateur IN
 (SELECT id_utilisateur FROM circle) and p.id_produit = 202
GROUP BY p.id_produit;

--Requete 3
WITH RECURSIVE circles(id_utilisateur, id_follower, niveau) AS (
    SELECT id_utilisateur, id_follower, 1
    FROM followers
    UNION
    SELECT f.id_utilisateur, f.id_follower, c.niveau + 1
    FROM followers f
    JOIN circles c ON c.id_follower = f.id_utilisateur
    WHERE c.niveau < 4
)
SELECT p.id_produit, COUNT(DISTINCT c.id_utilisateur) AS nombre_personnes
FROM commandes c
JOIN circles ci ON c.id_utilisateur = ci.id_follower
JOIN produits p ON c.id_produit = p.id_produit
WHERE p.id_produit = 8 -- Remplacer 1234 par l'ID du produit souhaité
GROUP BY p.id_produit;





