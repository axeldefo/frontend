import React, { useState, useEffect } from 'react';
import { PiPlugChargingBold } from "react-icons/pi";
import { MultiSelectComboBox } from '@hilla/react-components/MultiSelectComboBox.js';
import {ComboBox} from '@hilla/react-components/ComboBox.js'
import { MdDateRange } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './projets.css';

const Projets = () => {
  const [projets, setProjets] = useState([]);
  const [motsCles, setMotsCles] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [pourcentages, setPourcentages] = useState([]);
  const [filteredProjets, setFilteredProjets] = useState([]);
  const [selectedMotsCles, setSelectedMotsCles] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedPourcentage, setSelectedPourcentage] = useState('');
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
        setFilteredProjets(projetsData);

        // Extract unique motsCles, technologies and pourcentages
        const allMotsCles = projetsData.reduce((acc, projet) => acc.concat(projet.motsCles), []);
        setMotsCles([...new Set(allMotsCles)]);

        const allTechnologies = projetsData.reduce((acc, projet) => acc.concat(projet.technologies), []);
        setTechnologies([...new Set(allTechnologies)]);

        const allPourcentages = projetsData.map(projet => projet.pourcentage);
        setPourcentages([...new Set(allPourcentages)]);

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

  const handleMotsClesChange = (selectedItems) => {
    setSelectedMotsCles(selectedItems);
  };

  const handleTechnologiesChange = (selectedItems) => {
    setSelectedTechnologies(selectedItems);
  };

  const handlePourcentageChange = (event) => {
    setSelectedPourcentage(event.detail.value);
  };

  useEffect(() => {
    let filtered = projets;

    if (selectedMotsCles.length > 0) {
      filtered = filtered.filter(projet => 
        selectedMotsCles.every(motCle => projet.motsCles.includes(motCle))
      );
    }

    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(projet => 
        selectedTechnologies.every(tech => projet.technologies.includes(tech))
      );
    }

    if (selectedPourcentage) {
      filtered = filtered.filter(projet => 
        projet.pourcentage.toString() === selectedPourcentage.toString()
      );
    }

    setFilteredProjets(filtered);
  }, [selectedMotsCles, selectedTechnologies, selectedPourcentage, projets]);

  return (
    <section id='projets'>
      <div id='p'>
        <h1 className='proj'>Mes Projets</h1>
        <div className="multi-select-combo-box">
          <MultiSelectComboBox
            label="Filtrer par mots-clés"
            items={motsCles}
            selectedItems={selectedMotsCles}
            onSelectedItemsChanged={({ detail }) => handleMotsClesChange(detail.value)}
            style={{ 
              marginBottom: '20px' 
            }}
          />
          <MultiSelectComboBox
            label="Filtrer par technologies"
            items={technologies}
            selectedItems={selectedTechnologies}
            onSelectedItemsChanged={({ detail }) => handleTechnologiesChange(detail.value)}
            style={{ 
              marginBottom: '20px' 
            }}
          />
          <ComboBox
            label="Filtrer par pourcentage de réalisation"
            items={pourcentages}
            value={selectedPourcentage}
            onValueChanged={handlePourcentageChange}
            style={{  
              marginBottom: '20px' 
            }}
          />
        </div>
        <div className="projets">
          {filteredProjets.map((projet, index) => (
            <div className="card-container" key={index} onClick={() => handleProjetClick(projet)}>
              <div>
                <img
                  className="projet-image"
                  src={projet.thumbnail}
                  alt={projet.titre}
                />
              </div>
              <div className="techno">{projet.technologies.join(', ')}</div>
              <main className="main-content">
                <h1>{projet.titre}</h1>
                <p>{projet.descriptionIntro}</p>
                <div className="flex-row">
                  <h2 className="pourcent"><PiPlugChargingBold className='icon' />{projet.pourcentage}%</h2>
                  <h2 className="annee"><MdDateRange className='icon' />{projet.annee}</h2>
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
