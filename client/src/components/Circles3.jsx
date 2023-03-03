import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Circles3() {
    const [niveau, setNiveau] = useState("");
    const [idProduit, setIdProduit] = useState("");
    const [result, setResult] = useState([]);
    const [timeReq,setTimeReq]=useState();
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      //await publicRequest.get("/requeteInfluence/circles1",{
      /*await axios.get("http://localhost:3001/requeteInfluence",{
        id:id,
        niveau:niveau
      })*/
      console.log(niveau);
      console.log(idProduit);
      let beforeReq=Date.now();
      axios.get(`http://localhost:3001/requeteInfluence/circles3?niveau=${niveau}&idProduit=${idProduit}`)
      .then(response => {
        //const data = await response.json();
        let afterReq=Date.now();
        setTimeReq(afterReq-beforeReq);
        console.log(response);
        console.log(response.data);
        setResult(response.data);
      })
      .catch(error => {
        console.log(error);
      });
      
    };
  
    return (
      <div>
        <h1>Requête 3</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Niveau :
            <input
              type="text"
              value={niveau}
              onChange={(event) => setNiveau(event.target.value)}
            />
          </label>
          <label>
            idProduit :
            <input
              type="text"
              value={idProduit}
              onChange={(event) => setIdProduit(event.target.value)}
            />
          </label>
          <button type="submit">Rechercher</button>
        </form>
        <ul>
          {result.map((item) => (
            <li>
              ID produit: <b>{item.id_produit}</b>, Nombre de personnes:{" "}
              <b>{item.nombre_personnes}</b>
            </li>
          ))}
          <p>temps de la requête: <b>{timeReq} ms</b></p>
        </ul>
      </div>
    );
  }

export default Circles3;