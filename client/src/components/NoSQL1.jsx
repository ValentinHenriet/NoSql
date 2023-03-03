import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NoSQL1() {
    const [id, setId] = useState("");
    const [niveau, setNiveau] = useState("");
    const [result, setResult] = useState([]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      //await publicRequest.get("/requeteInfluence/circles1",{
      /*await axios.get("http://localhost:3001/requeteInfluence",{
        id:id,
        niveau:niveau
      })*/
      console.log(id);
      console.log(niveau);
      axios.get(`http://localhost:7689/users/${id}/followed-influencers`)
      .then(response => {
        //const data = await response.json();
        console.log(response);
        console.log(response.data);
        console.log("ok");
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
            ID utilisateur :
            <input
              type="text"
              value={id}
              onChange={(event) => setId(event.target.value)}
            />
          </label>
          <label>
            Niveau :
            <input
              type="text"
              value={niveau}
              onChange={(event) => setNiveau(event.target.value)}
            />
          </label>
          <button type="submit">Rechercher</button>
        </form>
        <ul>
            {result.map((item) => (
            <li key={item.ordered_product}>
                ID produit: {item.ordered_product}, Nombre de commandes:{" "}
                {item.num_orders}
            </li>
            ))}
        </ul>
      </div>
    );
  }

export default NoSQL1;