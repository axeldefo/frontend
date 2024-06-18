import React, {useEffect, useState} from "react";
import './dashboard.css'
import NavDash from "../../component/dashboard/navDash/navDash";
import Crudprojets from "../../component/dashboard/crud/projets/crudprojets";
import Stats from "../../component/dashboard/stats/stats";
import CrudMoi from "../../component/dashboard/crud/moi/crudmoi";
import Crudparcours from "../../component/dashboard/crud/parcours/crudparcours";
import CrudAuth from "../../component/dashboard/crud/auth/authcrud";


function Dashboard() {

  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    // Fonction pour récupérer le profil toutes les 15 minutes
    const fetchProfile = () => {
      fetchProfileData(); // Appel initial
      const interval = setInterval(fetchProfileData, 15 * 60 * 1000); // Appel toutes les 15 minutes
      return () => clearInterval(interval); // Nettoyage de l'intervalle lors du démontage du composant
    };

    fetchProfile();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        // Si la réponse n'est pas OK, vérifiez si c'est une erreur d'authentification
        if (response.status === 401) {
          // Affichez la boîte de dialogue
          alert("Vous allez être déconnecté dans 5 secondes");

          // Redirection vers la page de connexion après 5 secondes
          setTimeout(() => {
            localStorage.clear();
            navigate('/');
          }, 5000);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const updatePosition = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('touchmove', updatePosition);
    
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('touchmove', updatePosition);
    };
  }, []);
  
  return (
    <div className="dashboard">
      {(position.x !== -100 && position.y !== -100) && (
        <div className="circle" style={{ left: position.x, top: position.y }}></div>
      )}
      <NavDash />
      <CrudAuth />
      <CrudMoi />
      <Crudparcours/>
      <Crudprojets />
      <Stats />

      
    </div>
  );
}

export default Dashboard;