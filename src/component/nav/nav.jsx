
import React, { useState, useEffect }  from 'react';
import { RiDoorOpenLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Connexion from '../connexion/connexion';
import './nav.css';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleItemClick = (index) => {
    setActiveItem(index);
    if (index == '#connexion') { 
      setTimeout(() => {document.querySelector(' .close-icon').classList.add('hidden');}, 0); 
    } else {
      setShowMenu(false); 
      document.querySelector('.close-icon').classList.remove('hidden'); 
  }
};

useEffect(() => {
  const handleScroll = () => {
    const moiSection = document.getElementById('moi');
    const parcoursSection = document.getElementById('parcours');
    const projetsSection = document.getElementById('projets');
    const contactSection = document.getElementById('contact');

    const scrollPosition = window.scrollY;

    if (scrollPosition < moiSection.offsetTop) {
      setActiveItem('#moi');
    } else if (
      scrollPosition >= moiSection.offsetTop &&
      scrollPosition < parcoursSection.offsetTop
    ) {
      setActiveItem('#parcours');
    } else if (
      scrollPosition >= projetsSection.offsetTop &&
      scrollPosition < contactSection.offsetTop
    ) {
      setActiveItem('#projets');
    } else if (scrollPosition >= contactSection.offsetTop) {
      setActiveItem('#contact');
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

  return (
    <nav className="navbar">
        <a href='#moi' className="logo">
          Axel Defo
        </a>
        <div className={`nav-elements ${showMenu ? 'active' : ''}`}>
          <ul>
            <li>
              <a href="#parrcours" className={activeItem ==='#parcours' ? 'active' : ''} onClick={() => handleItemClick('#parcours')}>Parcours</a>
            </li>
            <li>
              <a href="#projets" className={activeItem === '#projets' ? 'active' : ''} onClick={() => handleItemClick('#projets')}>Projets</a>
            </li>
            <li>
              <a href="#contact" className={activeItem === '#contact' ? 'active' : ''} onClick={() => handleItemClick('#contact')}>Contact</a>
            </li>
            <li>
              <Connexion className={`con ${activeItem === '#connexion' ? 'active' : ''}`}   onClick={() => handleItemClick('#connexion')} ></Connexion>
            </li>
          </ul>
        </div>
        <div className="menu-icon" onClick={() => toggleMenu()}>
          {showMenu ? <IoClose className="close-icon"/> : <RiDoorOpenLine />}
        </div>
        {showMenu && (
          <span className='copyright'>
          © 2024 Kxng, Tous droits réservés.
          </span>
        )}
    </nav>
  )
}

export default Navbar