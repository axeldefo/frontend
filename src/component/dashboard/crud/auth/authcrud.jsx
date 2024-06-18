import React, { useState, useEffect } from 'react';
import './authcrud.css';

const initialFormValues = {
  nom: '',
  email: '',
  password: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

function Crudauth() {
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({ ...initialFormValues });
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();
      setUser(data);
      setLoading(false);
      // Remplir les champs avec les données du profil si l'utilisateur existe
      if (data) {
        setFormValues({
          nom: data.nom,
          email: data.email,
          password: '',
          currentPassword: '', // Ajout du champ pour le mot de passe actuel
          newPassword: '', // Ajout du champ pour le nouveau mot de passe
          confirmNewPassword: '', // Ajout du champ pour confirmer le nouveau mot de passe
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.nom.trim()) {
      errors.nom = "Le nom est requis";
    }
    if (!formValues.email.trim()) {
      errors.email = "L'email est requis";
    }
    if (!formValues.currentPassword.trim()) {
      errors.currentPassword = "Le mot de passe actuel est requis";
    }
    if (formValues.newPassword !== formValues.confirmNewPassword) {
      errors.confirmNewPassword = "Les mots de passe ne correspondent pas";
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const confirmationMessage = user ? 'Voulez-vous mettre à jour votre profil ?' : 'Voulez-vous créer un nouveau profil ?';

    setPopupMessage(confirmationMessage);
    setShowPopup(true);
  };

  const handleConfirmation = async () => {
    setShowPopup(false);
    try {
        const url = '/api/auth/update';
        const method = 'PUT';

        const requestBody = {
            ancienEmail: user.email, // Utiliser l'email actuel de l'utilisateur
            ancienPassword: formValues.currentPassword, // Utiliser le mot de passe actuel saisi dans le formulaire
            nom: formValues.nom,
            email: formValues.email,
            password: formValues.newPassword ? formValues.newPassword : formValues.currentPassword, // Utiliser le nouveau mot de passe saisi dans le formulaire
        };

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Récupérer les données de l'erreur
            throw new Error(errorData.message); // Lancer une erreur avec le message d'erreur
        }

        setFormValues({ ...initialFormValues });
        fetchUserProfile();
    } catch (error) {
        console.error('Error saving user profile:', error);
        // Afficher l'erreur à l'écran
        setPopupMessage(`Erreur lors de la sauvegarde du profil : ${error.message}`);
        setShowPopup(true);
    }
};


  const popupButtons = (
    <div className="popup-buttons">
      <button onClick={() => setShowPopup(false)}>Annuler</button>
      <button onClick={handleConfirmation}>Oui</button>
    </div>
  );

  return (
    <div className="crud-auth-container" id='crudauth'>

  <h1 className='toph'>Bienvenue sur votre espace personnel</h1>
      <div className="user-profile">
        <h1 className='h1'>Profil Utilisateur</h1>
        {loading ? (
          <p className='loading'>Chargement...</p>
        ) : (
          <div className="profile-info" onClick={() => setFormValues({ ...user, password: '' })}>
            <p><strong>Nom:</strong> {user && user.nom}</p>
            <p><strong>Email:</strong> {user && user.email}</p>
            <p><strong>Mot de passe:</strong> ********</p>
          </div>
        )}
      </div>
      <div className="user-details">
        <h1 className='h1'>{user ? 'Modifier le profil' : 'Créer un profil'}</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="nom">Nom :</label>
            <input type="text" id="nom" name="nom" value={formValues.nom} onChange={handleInputChange} placeholder="Nom" />
            {validationErrors.nom && <span className="error-message">{validationErrors.nom}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input type="email" id="email" name="email" value={formValues.email} onChange={handleInputChange} placeholder="Email" />
            {validationErrors.email && <span className="error-message">{validationErrors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel :</label>
            <input type="password" id="currentPassword" name="currentPassword" value={formValues.currentPassword} onChange={handleInputChange} placeholder="Mot de passe actuel" />
            {validationErrors.currentPassword && <span className="error-message">{validationErrors.currentPassword}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe :</label>
            <input type="password" id="newPassword" name="newPassword" value={formValues.newPassword} onChange={handleInputChange} placeholder="Nouveau mot de passe" />
            {validationErrors.newPassword && <span className="error-message">{validationErrors.newPassword}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe :</label>
            <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={formValues.confirmNewPassword} onChange={handleInputChange} placeholder="Confirmer le nouveau mot de passe" />
            {validationErrors.confirmNewPassword && <span className="error-message">{validationErrors.confirmNewPassword}</span>}
          </div>
          <div className="form-actions">
            <button type="submit">{ 'Modifier' }</button>
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
  );
}

export default Crudauth;
