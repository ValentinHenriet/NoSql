const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const utilisateursRoutes = require('./routes/utilisateurs');
const requeteInfluenceRoot=require('./routes/requeteInfluence');
// Configuration de la base de données
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
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
// Démarrage du serveur
app.listen(3001, () => console.log('Serveur démarré sur le port 3001'));

//module.exports = app;
//module.exports = { Pool: pool };

