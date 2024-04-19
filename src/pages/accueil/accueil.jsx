import React from "react";
import  Navbar from '../../component/nav/nav'
import  Moi  from '../../component/moi/moi'
import Projets from "../../component/projets/projets";
import Parcours from "../../component/parcours/parcours";
import Contact from "../../component/contact/contact";
import './accueil.css'



function Accueil() {

  return (
    <div className="accueil">
      <Navbar />
      <Moi />
      <Parcours/>
      <Projets />
      <Contact className="lock-scroll"/>
    </div>
  );
}

export default Accueil;