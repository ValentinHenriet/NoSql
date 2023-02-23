import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Utilisateurs() {
  const [idUtilisateur, setIdUtilisateur] = useState('');
  const [utilisateurs, setUtilisateurs] = useState('');

  /*useEffect(() => {
    if (idUtilisateur) {
      axios.get(`http://localhost:3001/utilisateurs/${idUtilisateur}`)
        .then(response => {
          const utilisateur = response.data;
          setUtilisateurs(
            <ul>
              <li key={utilisateur.id}>{utilisateur.nom}</li>
            </ul>
          );
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setUtilisateurs('');
    }
  }, [idUtilisateur]);*/

  const handleClick = () => {
    axios.get(`http://localhost:3001/utilisateurs/${idUtilisateur}`)
      .then(response => {
        const utilisateur = response.data;
        setUtilisateurs(
          <ul>
            <li key={utilisateur.id}>{utilisateur.nom}</li>
          </ul>
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <label>
        ID de l'utilisateur : 
        <input type="text" value={idUtilisateur} onChange={(event) => setIdUtilisateur(event.target.value)} />
      </label>
      <button onClick={handleClick}>Afficher l'utilisateur</button>
      {utilisateurs ? utilisateurs : <p>Aucun utilisateur à afficher.</p>}
    </div>
  );
}

export default Utilisateurs;