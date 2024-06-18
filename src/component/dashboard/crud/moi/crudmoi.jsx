import React, { useState, useEffect } from 'react';
import './crudmoi.css';

const initialFormValues = {
  nom: '',
  salutation: '',
  description: '',
  linkedin: '',
  github: '',
  email: '',
};

function CrudMoi() {
  const [moi, setMoi] = useState({});
  const [moiList, setMoiList] = useState([]);
  const [formValues, setFormValues] = useState({ ...initialFormValues });
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchMoi();
  }, []);

  const fetchMoi = async () => {
    try {
      const response = await fetch('/api/moi', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch "À propos de moi" data');
      }
      const data = await response.json();
      setMoiList(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching "À propos de moi" data:', error);
    }
  };

  const handleMoiClick = (moiData) => {
    setMoi(moiData);
    setFormValues(moiData);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }
    if (!formValues.salutation.trim()) {
      errors.salutation = 'La salutation est requise';
    }
    if (!formValues.description.trim()) {
      errors.description = 'La description est requise';
    }
    if (!formValues.linkedin.trim()) {
      errors.linkedin = 'Le profil LinkedIn est requis';
    }
    if (!formValues.github.trim()) {
      errors.github = 'Le profil GitHub est requis';
    }
    if (!formValues.email.trim()) {
      errors.email = 'L\'adresse email est requise';
    } else if (!isValidEmail(formValues.email)) {
      errors.email = 'L\'adresse email n\'est pas valide';
    }
    return errors;
  };

  const isValidEmail = (email) => {
    // Fonction de validation d'email simple
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const confirmationMessage = `Êtes-vous sûr de vouloir ${
      moi.num ? 'mettre à jour' : 'créer'
    } votre profil ?`;

    setPopupMessage(confirmationMessage);
    setShowPopup(true);
  };

  const handleConfirmation = async () => {
    setShowPopup(false);
    try {
      let url = '/api/moi';
      let method = 'POST';

      if (moi.num) {
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error('Failed to save "À propos de moi" data');
      }

      fetchMoi();
    } catch (error) {
      console.error('Error saving "À propos de moi" data:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const response = await fetch(`/api/moi/${moi.num}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      setFormValues({ ...initialFormValues });
      setMoi({});
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const popupButtons = (
    <div className="popup-buttons">
      <button onClick={() => setShowPopup(false)}>Annuler</button>
      <button onClick={handleConfirmation}>Oui</button>
    </div>
  );

  return (
    <div id="crudmoi">
    <h1 className='toph1'>Gestion des profils</h1>
    <div  className="crud-moi-container" >

    <div className="moi-list">
        <h2>Liste des profils</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {moiList.map((moiData, index) => (
              <li key={moiData.num} onClick={() => handleMoiClick(moiData)}>
                {index + 1}. {moiData.nom}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="moi-details">
        <h1 className="h1">À propos de moi</h1>

        <form className="form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom :</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formValues.nom}
              onChange={handleInputChange}
              placeholder="Nom"
            />
            {validationErrors.nom && (
              <span className="error-message">{validationErrors.nom}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="salutation">Salutation :</label>
            <input
              type="text"
              id="salutation"
              name="salutation"
              value={formValues.salutation}
              onChange={handleInputChange}
              placeholder="Salutation"
            />
            {validationErrors.salutation && (
              <span className="error-message">{validationErrors.salutation}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description :</label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              placeholder="Description"
            />
            {validationErrors.description && (
              <span className="error-message">{validationErrors.description}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="linkedin">Profil LinkedIn :</label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              value={formValues.linkedin}
              onChange={handleInputChange}
              placeholder="Profil LinkedIn"
            />
            {validationErrors.linkedin && (
              <span className="error-message">{validationErrors.linkedin}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="github">Profil GitHub :</label>
            <input
              type="text"
              id="github"
              name="github"
              value={formValues.github}
              onChange={handleInputChange}
              placeholder="Profil GitHub"
            />
            {validationErrors.github && (
              <span className="error-message">{validationErrors.github}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Adresse Email :</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Adresse Email"
            />
            {validationErrors.email && (
              <span className="error-message">{validationErrors.email}</span>
            )}
          </div>
          <div className="form-actions">
            <button type="submit">{moi.num ? 'Modifier' : 'Créer'}</button>
            {moi.num && (
              <>
                <button type="button" onClick={handleDeleteProfile}>
                  Supprimer
                </button>
                <button type="button" onClick={() => setMoi({})}>
                  Annuler
                </button>
              </>
            )}
          </div>
        </form>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <p>{popupMessage}</p>
              {popupButtons}
            </div>
          </div>
        )}
      </div>

    </div>
    </div>
  );
}

export default CrudMoi;
