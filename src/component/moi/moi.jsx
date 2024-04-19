import React, { useState, useEffect } from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import './moi.css';

function Moi() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchMonProfil = async () => {
      try {
        const response = await fetch('api/moi/1', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const moiData = await response.json();
        setData(moiData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMonProfil();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <section id="moi">
    <div className="moi">
        <h2 className='nom'>Bonjour, je suis {data.nom}</h2>
        <h1 className='titre'>{data.salutation}</h1>
        <p className='description'>{data.description}</p>
        <div className="social">
            <a href={data.linkedin} target="_blank" rel="noreferrer">
                <BsLinkedin />
            </a>
            <a href={data.github} target="_blank" rel="noreferrer">
                <FaGithub />
            </a>
        </div>

    </div>
    </section>
    
  );
}

export default Moi;
