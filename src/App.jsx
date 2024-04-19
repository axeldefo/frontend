import React, { useState, useEffect } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import './App.css';
import Accueil from './pages/accueil/accueil.jsx';
import Dashboard from "./pages/dashboard/dashboard";

function App() {
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

  


  return (
    <div className="app">
      {(position.x !== -100 && position.y !== -100) && (
        <div className="circle" style={{ left: position.x, top: position.y }}></div>
      )}


        <Routes>
            <Route path="*" element= { <Accueil />}></Route>
            <Route path="/dashboard" element={<Dashboard />}> </Route>
            
        </Routes>

    </div>
  );
}

export default App;
