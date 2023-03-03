import React, { useState, useEffect } from 'react';
import axios from 'axios';

function InitBDD() {
  const [timeReq,setTimeReq]=useState();
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

  const handleClick = async () => {
    let beforeReq=Date.now();
    await axios.post(`http://localhost:3001/initBDD/`)
      .then(response => {
        let afterReq=Date.now();
        let timeReq=afterReq-beforeReq;
        setTimeReq(timeReq);
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <div>
      <h1>Initialisation de la bdd</h1>
      <p><button onClick={handleClick}>Initialiser la bdd</button>temps de la requête: <b>{timeReq} ms</b></p> (peut prendre 10 min)
    </div>
  );
}

export default InitBDD;