import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './projetView.css';

const ProjetView = () => {
  const location = useLocation();
  const [projet, setProjet] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const [position, setPosition] = useState({ x: -100, y: -100 });

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
  
  const extractNumFromUrl = (url) => {
    const regex = /\/(\d+)$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const num = extractNumFromUrl(location.pathname);
    if (num) {
      console.log('Fetching projet:', num);
      const fetchProjet = async () => {
        try {
          const response = await fetch(`/api/projets/${num}`);
          if (!response.ok) {
            throw new Error('Failed to fetch projet');
          }
          const data = await response.json();
          setProjet(data);
        } catch (error) {
          console.error('Error fetching projet:', error);
        }
      };

      fetchProjet();
    }
  }, [location.pathname]);
  

  return (
    <>
      {projet && (
        <>
          {(position.x !== -100 && position.y !== -100) && (
            <div className="circle" style={{ left: position.x, top: position.y }}></div>
          )}
          <div className="project-details">
            <Link to="/#projets" ><button className='con'>Retour</button></Link>
            <h1 className="title">{projet.titre}</h1>
            <img src={projet.thumbnail} alt="Thumbnail" className="project-thumbnail"  />
            <div className="project-info">

              <h1 className="descr">{projet.descriptionIntro}</h1>
              <div className="project-info-item">
                <h3 className="info-title">Pourcentage de réalisation</h3>
                <p className="info-content">{projet.pourcentage}%</p>
              </div>
              <div className="project-info-item">
                <h3 className="info-title">Technologies utilisées</h3>
                <p className="info-content">{projet.technologies.join(', ')}</p>
              </div>
              <div className="project-info-item">
                <h3 className="info-title">Mots-clés</h3>
                <p className="info-content">{projet.motsCles.join(', ')}</p>
              </div>
              <div className="project-info-item">
                <h3 className="info-title">Description</h3>
                <p className="info-content">{projet.descriptionComplete}</p>
              </div>
                <h3 className="info-title">Images d'illustration</h3>
                
            </div>
            <div className="s">
            <Slider {...settings} className="illustration-slider">
                  {projet.imagesIllustration.map((image, index) => (
                    <div key={index}>
                      <img  src={image} alt={`Illustration ${index + 1}`} className="illustration-image" />
                    </div>
                  ))}
            </Slider>
            </div>
          </div>
        </>
      )}
    </>
  );
}; 

export default ProjetView;
