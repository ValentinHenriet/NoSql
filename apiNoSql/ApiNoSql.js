const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');

const app = express();
const port = 7689;

// Créer un driver Neo4j
const driver = neo4j.driver('neo4j://localhost:', neo4j.auth.basic('neo4j', '12345678'));
app.use(cors());

// Endpoint pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run('MATCH (u:User) RETURN u');
    const users = result.records.map(record => record.get('u').properties);
    res.send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving users from Neo4j');
  } finally {
    await session.close();
  }
});

// Endpoint pour récupérer les produits achetés par un utilisateur spécifique
app.get('/users/:id/products', async (req, res) => {
  const session = driver.session();
  const userId = req.params.id;
  try {
    const req = `MATCH(u:User {id:${userId}})-[:PURCHASED]->(p:Product) RETURN p` ;
    console.log(req);
    const result = await session.run(req);
    console.log(result);
    const products = result.records.map(record => record.get('p').properties);
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving products for user with ID ${userId} from Neo4j`);
  } finally {
    await session.close();
  }
});

// Endpoint pour récupérer les informations d'influenceur et de produits commandés pour les utilisateurs suivis par un utilisateur spécifique
app.get('/users/:id/followed-influencers', async (req, res) => {
  const session = driver.session();
  const userId = req.params.id;
  try {
    const req = `
      MATCH (follower:User)-[:Follows]->(u:User)-[:BUY]->(p:Product)
      WHERE u.id = ${userId}
      WITH p.name as ordered_product, count(*) as num_orders
      RETURN ordered_product, num_orders`;
    console.log(req);
    const result = await session.run(req);
    const data = result.records.map(record => ({
      ordered_product: record.get('ordered_product'),
      num_orders: record.get('num_orders').toNumber()
    }));
    
    res.send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Error retrieving followed influencers for user with ID ${userId} from Neo4j`);
  } finally {
    await session.close();
  }
});

  
// Endpoint pour récupérer le nombre de produits achetés par les utilisateurs qui suivent l'utilisateur ayant acheté le produit 762
app.get('/products/:name/users/followers/count', async (req, res) => {
    const session = driver.session();
    const productName = req.params.name;
    try {
      const req = `MATCH (follower:User)-[:FOLLOWS]->(u:User)-[:PURCHASED]->(p:Product {name: "${productName}"})
      WITH p
      MATCH (u:User)-[:PURCHASED]->(p)
      WITH u, p
      CALL apoc.path.subgraphNodes(u, {
        maxLevel: 3,
        relationshipFilter: 'FOLLOWS>'
      }) YIELD node
      WHERE node:User
      RETURN p.name as product, count(p) as number_of_purchases`;
      console.log(req);
      const result = await session.run(req);
      const purchases = result.records.map(record => ({
        product: record.get('product'),
        number_of_purchases: record.get('number_of_purchases').low
      }));
      res.send(purchases);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error retrieving number of purchases for users who follow users that purchased product ${productName} from Neo4j`);
    } finally {
      await session.close();
    }
  });


// Démarrer le serveur
app.listen(port, () => {
  console.log(`Neo4j API server listening at http://localhost:${port}`);
});
