import React from "react";
import Utilisateurs from "../components/Utilisateurs";
import Circles1 from "../components/Circles1";
import Circles2 from "../components/Circles2";
import Circles3 from "../components/Circles3";
import Followers from "../components/Followers";
import Produits from '../components/Produits';
import Commandes from '../components/Commandes';
import InitBDD from "../components/InitBDD";
const SQLPage = () => {
    return (
      <div>
        <InitBDD/>        
        <Circles1 />
        <Circles2 />
        <Circles3 />
        <Utilisateurs />        
        <Produits/>
        <Followers/>
        <Commandes/>
      </div>
    );
  };
  
  export default SQLPage;