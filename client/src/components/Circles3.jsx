import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { publicRequest } from "../requestMethods";

function Circles3() {
    const [niveau, setNiveau] = useState("");
    const [idProduit, setIdProduit] = useState("");
    const [result, setResult] = useState([]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      //await publicRequest.get("/requeteInfluence/circles1",{
      /*await axios.get("http://localhost:3001/requeteInfluence",{
        id:id,
        niveau:niveau
      })*/
      console.log(niveau);
      console.log(idProduit)
      axios.get(`http://localhost:3001/requeteInfluence/circles3?niveau=${niveau}&idProduit=${idProduit}`)
      .then(response => {
        //const data = await response.json();
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
              ID produit: {item.id_produit}, Nombre de personnes:{" "}
              {item.nombre_personnes}
            </li>
          ))}
        </ul>
      </div>
    );
  }

export default Circles3;