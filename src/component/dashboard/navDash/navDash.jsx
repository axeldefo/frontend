import React, { useState } from 'react';
import Deconnexion from '../deconnexion/deconnexion';
import { RiDoorOpenLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import './navDash.css';

const NavDash = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (index) => {
    if (index === '#deconnexion') {
      setTimeout(() => {
        document.querySelector('.close-icon').classList.add('hidden');
      }, 0);
    } else {
      setShowMenu(false);
      document.querySelector('.close-icon').classList.remove('hidden');
    }
  };

  const handleDeconnexionClick = () => {
    setActiveItem('#deconnexion');
    handleItemClick('#deconnexion');
  };

  return (
    <nav className="navbar">
      <a href='#moi' className="logo">
        Axel Defo
      </a>
      <div className={`nav-elements ${showMenu ? 'active' : ''}`}>
        <ul>
          <li>
            <a href="#crudprojets" className={activeItem === '#crudprojets' ? 'active' : ''} onClick={() => setActiveItem('#crudprojets')} disabled={activeItem === '#deconnexion'}>Projets</a>
          </li>
          <li>
            <a href="#stats" className={activeItem === '#stats' ? 'active' : ''} onClick={() => setActiveItem('#stats')} disabled={activeItem === '#deconnexion'}>Stats</a>
          </li>
          <li>
            <Deconnexion className={`con ${activeItem === '#deconnexion' ? 'active' : ''}`} onClick={handleDeconnexionClick} ></Deconnexion>
          </li>
        </ul>
      </div>
      <div className="menu-icon" onClick={() => toggleMenu()}>
          {showMenu ? <IoClose className="close-icon"/> : <RiDoorOpenLine />}
        </div>
    </nav>
  );
};

export default NavDash;
