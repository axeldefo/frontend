import React from "react";
import './dashboard.css'
import NavDash from "../../component/dashboard/navDash/navDash";
import Crudprojets from "../../component/dashboard/crud/projets/crudprojets";



function Dashboard() {

  return (
    <div className="dashboard">
      <NavDash />
      <Crudprojets />
    </div>
  );
}

export default Dashboard;