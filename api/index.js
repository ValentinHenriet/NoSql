const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const utilisateursRoutes = require('./routes/utilisateurs');
const requeteInfluenceRoot=require('./routes/requeteInfluence');
const followersRoot=require('./routes/followers');
const produitsRoot=require('./routes/produits');
const commandesRoot=require('./routes/commandes');
const initBDDRoot=require('./routes/initBDD');

// Configuration de la base de données
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'francetelecom25',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch((err) => console.error('Erreur lors de la connexion à la base de données :', err));


app.locals.pool=pool;
// Ajout de la variable pool à l'objet app pour pouvoir l'utiliser dans les routes
//app.set('pool', pool);
app.use(express.json());
app.use(cors());
// Configuration des routes liées aux utilisateurs
app.use('/utilisateurs', utilisateursRoutes);
app.use('/requeteInfluence', requeteInfluenceRoot);
app.use('/followers', followersRoot);
app.use('/produits', produitsRoot);
app.use('/commandes', commandesRoot);
app.use('/initBDD', initBDDRoot);

// Démarrage du serveur
app.listen(3001, () => console.log('Serveur démarré sur le port 3001'));

//module.exports = app;
//module.exports = { Pool: pool };

