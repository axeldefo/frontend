import React from "react";
import { createBrowserApp, createRoutesFromElements, Route } from "react-router-dom";
import Accueil from "./pages/Accueil";
import Dashboard from "./pages/Dashboard";
import Moi from "./components/moi";
import Parcours from "./components/parcours";
import Projets from "./components/projets";

const routes = createRoutesFromElements(
  <Route path="/" element={<Accueil />}>
    <Route index element={<Moi />} />
    <Route path="parcours" element={<Parcours />} />
    <Route path="projets" element={<Projets />} />
  </Route>,
  <Route path="/dashboard" element={<Dashboard />} />
);

const App = () => {
  const Router = createBrowserApp(routes);
  return <Router />;
};

export default App;