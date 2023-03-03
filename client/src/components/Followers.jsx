import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Followers() {
  const [idUtilisateur, setIdUtilisateur] = useState('');
  const [followers, setFollowers] = useState('');
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
    await axios.get(`http://localhost:3001/followers/${idUtilisateur}`)
      .then(response => {
        let afterReq=Date.now();
        let timeReq=afterReq-beforeReq;
        const followers = response.data;
        console.log(followers);
        setFollowers(
          <ul>
          {followers.map((item) => (
            <li>
              id_utilisateur: <b>{item.id_utilisateur}</b>, id_follower:<b>{item.id_follower}</b>
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
    await axios.post(`http://localhost:3001/followers/add`)
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
    await axios.delete(`http://localhost:3001/followers/delete`)
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
      <h1>Liste des followers</h1>
      <label>
        ID de l'utilisateur : 
        <input type="text" value={idUtilisateur} onChange={(event) => setIdUtilisateur(event.target.value)} />
      </label>
      <p><button onClick={handleClick}>Afficher les followers de l'utilisateurs</button> {followers ? followers : <b>Aucun followers à afficher.</b>}</p>
      <p><button onClick={handleClick2}>Insérer followers</button> temps de la requête: <b>{timeReqAdd} ms</b>(attention minimum 1 minutes pour 20 000 utilisateurs)</p>
      <p><button onClick={handleClick3}>Supprimer l'ensemble des followers</button> temps de la requête: <b>{timeReqDel} ms</b></p>
    </div>
  );
}

export default Followers;