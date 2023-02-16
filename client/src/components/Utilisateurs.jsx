import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/utilisateurs')
      .then(response => {
        setUtilisateurs(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {utilisateurs.map(utilisateur => (
          <li key={utilisateur.id}>{utilisateur.nom}</li>
        ))}
      </ul>
    </div>
  );
}

export default Utilisateurs;
