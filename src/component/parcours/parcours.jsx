import React, { useState, useEffect } from 'react';
import './parcours.css';

const Parcours = () => {
  const [parcours, setParcours] = useState([]);

  useEffect(() => {
    const fetchParcours = async () => {
      try {
        const response = await fetch('api/parcours', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const parcoursData = await response.json();
        setParcours(parcoursData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchParcours();
  }, []);

  const toggleDetails = (index) => {
    const updatedParcours = parcours.map((item, i) => {
      if (i === index) {
        return { ...item, isOpen: !item.isOpen };
      } else if (item.isOpen) {
        return { ...item, isOpen: false };
      }
      return item;
    });
    setParcours(updatedParcours);
  };

  return (
    <section id='parcours'>
    <div className="parcours-container">
        <h1 className='parc'>Mon parcours</h1>
      {parcours.map((item, index) => (
        <div key={index} className={`parcours-item ${item.isOpen ? 'open' : ''}`}>
          <div className="parcours-header" onClick={() => toggleDetails(index)}>
            <div className="parcours-info">
              <span>{item.titre} @ {item.entreprise}</span>
              <span>{item.dateDebut} - {item.dateFin}</span>
            </div>
            <span className={`toggle-icon ${item.isOpen ? 'open' : 'closed'}`} onClick={() => toggleDetails(index)}>
                {item.isOpen ? '-' : '+'}
            </span>
        </div>
          {item.isOpen && (
            <div className="parcours-details">
              <div className="details-header">
                <span>{item.lieu}</span>
                <span>{item.type}</span>
              </div>
              <p className="description">{item.description}</p>
              <ul className="acquis-list">
                {item.acquis.map((acquis, idx) => (
                  <li key={idx}>{acquis.nom}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
    </section>
  );
};

export default Parcours;
