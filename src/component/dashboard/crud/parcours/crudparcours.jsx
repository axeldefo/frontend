import React, { useState, useEffect } from 'react';
import './crudparcours.css';

const initialFormValues = {
  dateDebut: '',
  dateFin: '',
  titre: '',
  description: '',
  entreprise: '',
  lieu: '',
  type: '',
  acquis: [],
  logo: '',
};

function Crudparcours() {
  const [parcours, setParcours] = useState([]);
  const [selectedParcours, setSelectedParcours] = useState(null);
  const [formValues, setFormValues] = useState({ ...initialFormValues });
  const [pendingFormValues, setPendingFormValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchParcours();
  }, []);

  const fetchParcours = async () => {
    try {
      const response = await fetch('/api/parcours');
      if (!response.ok) {
        throw new Error('Failed to fetch parcours');
      }
      const data = await response.json();
      setParcours(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching parcours:', error);
    }
  };

  const handleParcoursClick = (parcours) => {
    setSelectedParcours(parcours);
    setFormValues({
      dateDebut: parcours.dateDebut,
      dateFin: parcours.dateFin,
      titre: parcours.titre,
      description: parcours.description,
      entreprise: parcours.entreprise,
      lieu: parcours.lieu,
      type: parcours.type,
      acquis: parcours.acquis.map((acqui) => acqui.nom).join(', '),
      logo: parcours.logo,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.dateDebut.trim()) {
      errors.dateDebut = "La date de début est requise";
    }
    if (!formValues.dateFin.trim()) {
      errors.dateFin = "La date de fin est requise";
    }
    if (!formValues.titre.trim()) {
      errors.titre = "Le titre est requis";
    }
    if (!formValues.description.trim()) {
      errors.description = "La description est requise";
    }
    if (!formValues.entreprise.trim()) {
      errors.entreprise = "Le nom de l'entreprise est requis";
    }
    if (!formValues.lieu.trim()) {
      errors.lieu = "Le lieu est requis";
    }
    if (!formValues.type.trim()) {
      errors.type = "Le type est requis";
    }
    if (!formValues.acquis.trim()) {
      errors.acquis = "Les acquis sont requis";
    }
    if (!formValues.logo.trim()) {
      errors.logo = "L'URL du logo est requise";
    }
    return errors;
  };

  const handleFormSubmit = async (e, action, parcours) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const acquisArray = formValues.acquis.split(',').map((acqui) => ({ nom: acqui.trim() }));

    const updatedFormValues = {
      ...formValues,
      acquis: acquisArray,
    };

    const confirmationMessage = `Êtes-vous sûr de vouloir ${action} ce parcours ?`;

    setPendingFormValues(updatedFormValues);
    setPopupMessage(confirmationMessage);
    setShowPopup(true);
  };

  const handleConfirmation = async () => {
    setShowPopup(false);
    try {
      let url = '/api/parcours';
      let method = 'POST';

      if (selectedParcours) {
        method = 'PUT';
        pendingFormValues.num = selectedParcours.num;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(pendingFormValues),
      });

      if (!response.ok) {
        throw new Error('Failed to save parcours');
      }

      setFormValues({ ...initialFormValues });
      setSelectedParcours(null);
      fetchParcours();
    } catch (error) {
      console.error('Error saving parcours:', error);
    }
  };

  const handleDeleteParcours = async () => {
    try {
      const response = await fetch(`/api/parcours/${selectedParcours.num}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete parcours');
      }

      setFormValues({ ...initialFormValues });
      setSelectedParcours(null);
      fetchParcours();
    } catch (error) {
      console.error('Error deleting parcours:', error);
    }
  };

  const popupButtons = (
    <div className="popup-buttons">
      <button onClick={() => setShowPopup(false)}>Annuler</button>
      <button onClick={handleConfirmation}>Oui</button>
    </div>
  );

  return (
    <div id="crudparcours">
    <h1 className='toph1'>Gestion des parcours</h1>
    <div className="crud-parcours-container">
      <div className="parcours-list">
        <h1 className='h1'>Parcours</h1>
        {loading ? (
          <p className='loading'>Loading...</p>
        ) : (
          parcours.map((parcours) => (
            <div
              key={parcours.num}
              className={`parcours-item ${selectedParcours === parcours ? 'selected' : ''}`}
              onClick={() => handleParcoursClick(parcours)}
            >
              <img src={parcours.logo} alt={parcours.titre} />
              <div className="parcours-info">
                <span className="parcours-title">{` ${parcours.num} - ${parcours.titre}`}</span>
                <p className="parcours-description">{parcours.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="nparcours-details">
        <h1 className='h1'>{selectedParcours ? 'Modifier le parcours' : 'Créer un parcours'}</h1>

        <form className='formu' onSubmit={(e) => handleFormSubmit(e, selectedParcours ? 'modifier' : 'créer', selectedParcours)}>
          <div className="form-group">
            <label htmlFor="dateDebut">Date de début :</label>
            <input type="text" id="dateDebut" name="dateDebut" value={formValues.dateDebut} onChange={handleInputChange} placeholder="Date de début" />
            {validationErrors.dateDebut && <span className="error-message">{validationErrors.dateDebut}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="dateFin">Date de fin :</label>
            <input type="text" id="dateFin" name="dateFin" value={formValues.dateFin} onChange={handleInputChange} placeholder="Date de fin" />
            {validationErrors.dateFin && <span className="error-message">{validationErrors.dateFin}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="titre">Titre :</label>
            <input type="text" id="titre" name="titre" value={formValues.titre} onChange={handleInputChange} placeholder="Titre" />
            {validationErrors.titre && <span className="error-message">{validationErrors.titre}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description :</label>
            <textarea id="description" name="description" value={formValues.description} onChange={handleInputChange} placeholder="Description" />
            {validationErrors.description && <span className="error-message">{validationErrors.description}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="entreprise">Entreprise :</label>
            <input type="text" id="entreprise" name="entreprise" value={formValues.entreprise} onChange={handleInputChange} placeholder="Entreprise" />
            {validationErrors.entreprise && <span className="error-message">{validationErrors.entreprise}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="lieu">Lieu :</label>
            <input type="text" id="lieu" name="lieu" value={formValues.lieu} onChange={handleInputChange} placeholder="Lieu" />
            {validationErrors.lieu && <span className="error-message">{validationErrors.lieu}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="type">Type :</label>
            <input type="text" id="type" name="type" value={formValues.type} onChange={handleInputChange} placeholder="Type" />
            {validationErrors.type && <span className="error-message">{validationErrors.type}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="acquis">Acquis :</label>
            <input type="text" id="acquis" name="acquis" value={formValues.acquis} onChange={handleInputChange} placeholder="Acquis (séparés par des virgules)" />
            {validationErrors.acquis && <span className="error-message">{validationErrors.acquis}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="logo">URL du logo :</label>
            <input type="text" id="logo" name="logo" value={formValues.logo} onChange={handleInputChange} placeholder="URL du logo" />
            {validationErrors.logo && <span className="error-message">{validationErrors.logo}</span>}
          </div>
          <div className="form-actions">
            <button type="submit">{selectedParcours ? 'Modifier' : 'Créer'}</button>
            {selectedParcours && (
              <>
                <button type="button" onClick={handleDeleteParcours}>Supprimer</button>
                <button type="button" onClick={() => setSelectedParcours(null)}>Annuler</button>
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

export default Crudparcours;
