import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Produits() {
  const [idProduit, setIdProduit] = useState('');
  const [produit, setProduit] = useState('');
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
    await axios.get(`http://localhost:3001/produits/${idProduit}`)
      .then(response => {
        let afterReq=Date.now();
        let timeReq=afterReq-beforeReq;
        const produit = response.data;
        setProduit(
          <ul>
            nom_produit:<b>{produit.nom_produit}</b> temps de la requête: <b>{timeReq} ms</b>
          </ul>          
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  const handleClick2 = async () => {
    let beforeReq=Date.now();
    await axios.post(`http://localhost:3001/produits/add`)
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
    await axios.delete(`http://localhost:3001/produits/delete`)
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
      <h1>Liste des produits</h1>
      <label>
        ID du produit : 
        <input type="text" value={idProduit} onChange={(event) => setIdProduit(event.target.value)} />
      </label>
      <p><button onClick={handleClick}>Afficher le nom du produit</button> {produit ? produit : <b>Aucun produit à afficher.</b>}</p>
      <p><button onClick={handleClick2}>Insérer 100 produits</button> temps de la requête: <b>{timeReqAdd} ms</b></p>
      <p><button onClick={handleClick3}>Supprimer la table produits</button> temps de la requête: <b>{timeReqDel} ms</b></p>
    </div>
  );
}

export default Produits;