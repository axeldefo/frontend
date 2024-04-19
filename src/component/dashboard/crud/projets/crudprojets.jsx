import React, { useState, useEffect } from 'react';
import './crudprojets.css';

function Crudprojets() {
  const [projets, setProjets] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formValues, setFormValues] = useState({
    titre: '',
    descriptionIntro: '',
    motsCles: '',
    thumbnail: '',
    imagesIllustration: ['', '', '', '', ''], // 5 champs pour les images d'illustration
    technologies: '',
    annee: '',
    pourcentage: '',
    descriptionComplete: '',
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if(localStorage.getItem('isConnected') === 'false' && localStorage.getItem('dashboard') === true) {
      localStorage.setItem('dashboard', false);
    }
  }, []);


  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const response = await fetch('/api/projets');
      if (!response.ok) {
        throw new Error('Failed to fetch projets');
      }
      const data = await response.json();
      setProjets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projets:', error);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setFormValues({
      titre: project.titre,
      descriptionIntro: project.descriptionIntro,
      motsCles: project.motsCles.join(', '),
      thumbnail: project.thumbnail,
      imagesIllustration: project.imagesIllustration,
      technologies: project.technologies.join(', '),
      annee: project.annee.toString(),
      pourcentage: project.pourcentage.toString(),
      descriptionComplete: project.descriptionComplete,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Vérifications des limites de caractères
    if (formValues.descriptionIntro.length > 80) {
      alert('La description introductive ne peut pas dépasser 80 caractères.');
      return;
    }

    if (formValues.descriptionComplete.split(/\s+/).length > 250) {
      alert('La description complète ne peut pas dépasser 250 mots.');
      return;
    }

    const motsClesCount = formValues.motsCles.split(',').filter(Boolean).length;
    if (motsClesCount > 10) {
      alert('Il ne peut y avoir plus de 10 mots-clés.');
      return;
    }

    const motsClesArray = formValues.motsCles.split(/\s*,\s*/).filter(Boolean); // Split by comma with optional spaces
    const technologiesArray = formValues.technologies.split(/\s*,\s*/).filter(Boolean);

    const updatedFormValues = {
      ...formValues,
      motsCles: motsClesArray, // Update with array of keywords
      technologies: technologiesArray, // Update with array of technologies
    };


    try {
      let url = '/api/projets';
      let method = 'POST';
      // Supprimer l'attribut "num" de l'objet JSON
      delete updatedFormValues.num;

      if (selectedProject) {
        method = 'PUT';
        updatedFormValues.num = selectedProject.num;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Assuming accessToken is available
        },
        body: JSON.stringify(updatedFormValues),
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      // Clear form values and fetch updated projects
      setFormValues({
        titre: '',
        descriptionIntro: '',
        motsCles: '',
        thumbnail: '',
        imagesIllustration: ['', '', '', '', ''], // Resetting images illustration fields
        technologies: '',
        annee: '',
        pourcentage: '',
        descriptionComplete: '',
      });
      setSelectedProject(null);
      fetchProjets();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projets/${selectedProject.num}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Assuming accessToken is available
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      // Clear form values and fetch updated projects
      setFormValues({
        titre: '',
        descriptionIntro: '',
        motsCles: '',
        thumbnail: '',
        imagesIllustration: ['', '', '', '', ''], // Resetting images illustration fields
        technologies: '',
        annee: '',
        pourcentage: '',
        descriptionComplete: '',
      });
      setSelectedProject(null);
      fetchProjets();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleImageInputChange = (index, value) => {
    const updatedImages = [...formValues.imagesIllustration];
    updatedImages[index] = value;
    setFormValues({ ...formValues, imagesIllustration: updatedImages });
  };

  return (
    <div className="crud-projets-container">
      <div className="projets-list">
        <h1 className='h1'>Projets</h1>
        {loading ? ( // Display loading text while projects are loading
          <p>Loading...</p>
        ) : (
          projets.map((project) => (
            <div
              key={project.num}
              className={`project-item ${selectedProject === project ? 'selected' : ''}`}
              onClick={() => handleProjectClick(project)}
            >
              <img src={project.thumbnail} alt={project.titre} />
              <div className="project-info">
                <span className="project-title">{` ${project.num} - ${project.titre}`}</span>
                <p className="project-description">{project.descriptionIntro}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="project-details">
        <h1 className='h1'>{selectedProject ? 'Modifier le projet' : 'Créer un projet'}</h1>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="titre">Titre :</label>
            <input type="text" id="titre" name="titre" value={formValues.titre} onChange={handleInputChange} placeholder="Titre" />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionIntro">Description Intro :</label>
            <input type="text" id="descriptionIntro" name="descriptionIntro" value={formValues.descriptionIntro} onChange={handleInputChange} placeholder="Description Intro" />
          </div>
          <div className="form-group">
            <label htmlFor="thumbnail">URL du thumbnail :</label>
            <input type="text" id="thumbnail" name="thumbnail" value={formValues.thumbnail} onChange={handleInputChange} placeholder="URL du thumbnail" />
          </div>
          <div className="form-group">
            <label htmlFor="annee">Année :</label>
            <input type="text" id="annee" name="annee" value={formValues.annee} onChange={handleInputChange} placeholder="Année" />
          </div>
          <div className="form-group">
            <label htmlFor="pourcentage">Pourcentage :</label>
            <input type="text" id="pourcentage" name="pourcentage" value={formValues.pourcentage} onChange={handleInputChange} placeholder="Pourcentage" />
          </div>
          <div className="form-group">
            <label htmlFor="technologies">Technologies utilisées :</label>
            <input type="text" id="technologies" name="technologies" value={formValues.technologies} onChange={handleInputChange} placeholder="Technologies utilisées (séparées par des virgules)" />
          </div>

  
          {[0, 1, 2, 3, 4].map((index) => (
            <div key={index} className="form-group ima">
              <label htmlFor={`imageIllustration${index + 1}`}>{`Image d'illustration ${index + 1}`} :</label>
              <input
                className='ima'
                type="text"
                id={`imageIllustration${index + 1}`}
                value={formValues.imagesIllustration[index]}
                onChange={(e) => handleImageInputChange(index, e.target.value)}
                placeholder={`Image d'illustration ${index + 1}`}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="motsCles">Mots Clés :</label>
            <textarea id="motsCles" name="motsCles" value={formValues.motsCles} onChange={handleInputChange} placeholder="Mots Clés (séparés par des virgules)" />
          </div>
          <div className="form-group">
            <label htmlFor="descriptionComplete">Description complète :</label>
            <textarea id="descriptionComplete" name="descriptionComplete" value={formValues.descriptionComplete} onChange={handleInputChange} placeholder="Description complète" />
          </div>

          <div className="form-actions">
            <button type="submit">{selectedProject ? 'Modifier' : 'Créer'}</button>
            {selectedProject && (
              <>
                <button type="button" onClick={handleDeleteProject}>Supprimer</button>
                <button type="button" onClick={() => setSelectedProject(null)}>Annuler</button>
              </>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}

export default Crudprojets;
