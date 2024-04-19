import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ProjetView from './component/projetView/projetView.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';


// Create the BrowserRouter with all routes included
const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/projets/:num',
    element: <ProjetView />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={BrowserRouter} />
  </React.StrictMode>,
  document.getElementById('root')
);
