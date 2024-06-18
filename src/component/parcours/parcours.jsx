import React, { useState, useEffect } from 'react';
import { FaLocationDot } from "react-icons/fa6";
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
    <section id='parrcours'>
    <div className="parrcours-container">
        <h1 className='parc'>Mon parcours</h1>
      {parcours.map((item, index) => (
        <div key={index} className={`parrcours-item ${item.isOpen ? 'open' : ''}`}>
          <div className="parrcours-header" onClick={() => toggleDetails(index)}>
            <div className="parrcours-info">
              <span>{item.titre} @ {item.entreprise}</span>
            </div>
              
              <span className={`toggle-icon ${item.isOpen ? 'open' : 'closed'}`} onClick={() => toggleDetails(index)}>
              <span className='date'>{item.dateDebut} - {item.dateFin}</span> {item.isOpen ? '-' : '+'}
              </span>
        </div>
          {item.isOpen && (
            <div className="parrcours-details">
              <div className="details-header">
                <span className="location"><FaLocationDot className='FaLocationDot'/>{item.lieu}</span>
                <span className='formation'>{item.type}</span>
              </div>
              <p className="description">{item.description}</p>
              <ul className="acquis-list">
                {item.acquis.map((acquis, idx) => (
                  <li key={idx}className='acquis'>{acquis.nom}</li>
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
