import React, {useEffect, useState} from "react";
import './dashboard.css'
import NavDash from "../../component/dashboard/navDash/navDash";
import Crudprojets from "../../component/dashboard/crud/projets/crudprojets";
import Stats from "../../component/dashboard/stats/stats";



function Dashboard() {

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
    <div className="dashboard">
      {(position.x !== -100 && position.y !== -100) && (
        <div className="circle" style={{ left: position.x, top: position.y }}></div>
      )}
      <NavDash />
      <Stats />
      <Crudprojets />
      
    </div>
  );
}

export default Dashboard;