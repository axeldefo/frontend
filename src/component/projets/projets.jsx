import React, { useState, useEffect } from 'react';
import { PiPlugChargingBold } from "react-icons/pi";
import { MdDateRange } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './projets.css';

const Projets = () => {
  const [projets, setProjets] = useState([]);
  const navigate = useNavigate(); // Create useNavigate instance

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const response = await fetch('api/projets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const projetsData = await response.json();
        setProjets(projetsData);
        console.log('Projets data:', projetsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProjets();
  }, []);

  const handleProjetClick = (projet) => {
    navigate(`/projets/${projet.num}`); // Navigate to project details route
  };

  return (
    <section id='projets'>
      <div id='p'>
        <h1 className='proj'>Mes Projets</h1>
        <div className="projets">
          {projets.map((projet, index) => (
            <div className="card-container" key={index}>
              <div>
              <img
                className="projet-image"
                src={projet.thumbnail}
                alt={projet.titre}
                onClick={() => handleProjetClick(projet)} // Call handleProjetClick on click
              /></div>
              <div className="techno">{projet.technologies.join(', ')}</div>
              <main className="main-content">
                <h1>{projet.titre}</h1>
                <p>{projet.descriptionIntro}</p>
                <div className="flex-row">
                  <h2 className="pourcent"><PiPlugChargingBold className='icon'/>{projet.pourcentage}%</h2>
                  <h2 className="annee"><MdDateRange className='icon'/>{projet.annee}</h2>
                </div>
              </main>
              <div className="trait"></div>
              <p className="tags">{projet.motsCles.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projets;
