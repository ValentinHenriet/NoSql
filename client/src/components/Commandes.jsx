import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Commandes() {
  const [idUtilisateur, setIdUtilisateur] = useState('');
  const [commandes, setCommandes] = useState('');
  const [timeReqAdd,setTimeReqAdd]=useState();
  const [timeReqDel,setTimeReqDel]=useState();
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
    await axios.get(`http://localhost:3001/commandes/${idUtilisateur}`)
      .then(response => {
        let afterReq=Date.now();
        let timeReq=afterReq-beforeReq;
        const commandes = response.data;
        console.log(commandes);
        setCommandes(
          <ul>
          {commandes.map((item) => (
            <li>
              id_utilisateur: <b>{item.id_utilisateur}</b>, id_produit:<b>{item.id_produit}</b>
            </li>            
          ))}
          <p>temps de la requête: <b>{timeReq} ms</b></p>
        </ul>
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleClick2 = async () => {
    let beforeReq=Date.now();
    await axios.post(`http://localhost:3001/commandes/add`)
      .then(response => {
        let afterReq=Date.now();
        setTimeReqAdd(afterReq-beforeReq);
        console.log(response);        
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleClick3 = async () => {
    let beforeReq=Date.now();
    await axios.delete(`http://localhost:3001/commandes/delete`)
      .then(response => {
        let afterReq=Date.now();
        setTimeReqDel(afterReq-beforeReq);
        console.log(response);        
      })
      .catch(error => {
        console.log(error);
      });
  }


  return (
    <div>
      <h1>Liste des commandes</h1>
      <label>
        ID de l'utilisateur : 
        <input type="text" value={idUtilisateur} onChange={(event) => setIdUtilisateur(event.target.value)} />
      </label>
      <p><button onClick={handleClick}>Afficher les commandes de l'utilisateurs</button> {commandes ? commandes : <b>Aucun commandes à afficher.</b>}</p>
      <p><button onClick={handleClick2}>Insérer commandes</button> temps de la requête: <b>{timeReqAdd} ms</b></p>
      <p><button onClick={handleClick3}>Supprimer la table commandes</button> temps de la requête: <b>{timeReqDel} ms</b></p>
    </div>
  );
}

export default Commandes;