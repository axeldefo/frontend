import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './connexion.css';

function Connexion() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(localStorage.getItem('isConnected') === 'true'); // State to track connection status
  const formRef = useRef(null);
  const navigate = useNavigate();

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleDashboard = () => {
    localStorage.setItem('dashboard', 'true'); 
    navigate('/dashboard');
    };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleMdpChange = (event) => {
    setMdp(event.target.value);
  };


  const getProfileData = async () => {
    try {
      const response = await fetch('api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Erreur de réseau: ${response.status}`);
      }
  
      const profileData = await response.json();
      localStorage.setItem('nom', profileData.nom);
      // Vous pouvez utiliser la valeur de 'nom' comme vous le souhaitez ici
  
    } catch (error) {
      console.error('Erreur lors de la récupération des données de profil:', error);
    }
  };

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email,
      password: mdp,
    };

    if (!isValidEmail(email)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }

    if (!data.email || !data.password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erreur de réseau: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.accessToken) {
        throw new Error('Jeton d\'accès manquant dans la réponse');
      }

      localStorage.setItem('accessToken', responseData.accessToken);
      localStorage.setItem('user',data.email);
      setIsConnected(true); // Set connection status to true

      await getProfileData(); // Get profile data after successful login
      setError(null); 
    } catch (error) {
      setIsConnected(false); // Set connection status to false
      setError('Identifiants incorrects. Veuillez réessayer.');
      console.error('Erreur de connexion:', error);
    }
  };


  // Function to check if email is valid
  const isValidEmail = (email) => {
    // Simple email validation using regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  return (
    <>
      <button onClick={handleOpen} className='con'>Connexion</button>
      {isOpen && (
        <div ref={formRef} className="form-containerc">
          {isConnected ? (
            <div className="dialog">

              <p>Bonjour {localStorage.getItem('nom')}!</p>
              <p>Vous êtes connecté.</p>

              <button className='connected' onClick={handleDashboard}>Dashboard</button>
              <button className='connected' onClick={handleClose}>Fermer</button>
            </div>
          ) : (
            <>
              <h2>Connexion</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-groupc">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="email@portfolio.com"
                    required
                  />
                </div>
                <div className="form-groupc">
                  <label htmlFor="mdp">Mot de passe:</label>
                  <input
                    type="password"
                    id="mdp"
                    name="mdp"
                    value={mdp}
                    onChange={handleMdpChange}
                    placeholder="Mot de passe"
                    required
                  />
                </div>
                <div className="form-actionsc">
                  <button type="submit" className="primary-btn">
                    Connexion
                  </button>
                  <button type="button" className="back-btn" onClick={handleClose}>
                    Retour
                  </button>
                </div>
                {error && <p className="error-message">{error}</p>}
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Connexion;
