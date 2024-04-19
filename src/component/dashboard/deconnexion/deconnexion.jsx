import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../connexion/connexion.css';

function Deconnexion() {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();
  
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleLogout = () => {
    localStorage.clear()
    handleClose();
    navigate('/');
  };

  const handleCancel = () => {
    handleClose();
  };

   useEffect(() => {
    if (localStorage.getItem('nom') === null) {
      navigate('/');
    }
  }
  , []); 

  return (
    <>
      <button onClick={handleOpen} className='con'  style={{ marginBottom: '25px' }} >Déconnexion</button>
      {isOpen && (
        <div ref={formRef} className="form-containerc">
          <div className="dialog">
          <p>Bonjour {localStorage.getItem('nom')}!</p>
            <p>Voulez-vous vous déconnecter?</p>
            <button className='connected' onClick={handleLogout}>Déconnexion</button>
            <button className='connected' onClick={handleCancel}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Deconnexion;
