--Creation table utilisateurs

--Creation table produits

-- Table Utilisateurs
CREATE TABLE Utilisateurs (
  id_utilisateur SERIAL PRIMARY KEY,
  nom VARCHAR(500)
);

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
from generate_series(1,500);
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

-- Insertion dans Followers (la 1ère est fausse car il y a des utilisateurs qui ont plusieurs fois le même follower)

do $$
declare
	utilisateur record;
	i integer;
	nb_followers integer;
begin
	for utilisateur in select * from utilisateurs
	loop
		nb_followers := floor(random()*20);
		for i in 1..nb_followers loop
			insert into followers (id_utilisateur, id_follower)
			select utilisateur.id_utilisateur, u2.id_utilisateur
			from utilisateurs u2
			where u2.id_utilisateur != utilisateur.id_utilisateur
			order by random()
			limit 1;
		end loop;
	end loop;
end $$;
-- correction 
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





