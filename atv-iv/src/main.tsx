import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ClientesPage from './pages/clientes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/clientes" replace />,
  },
  {
    path: "/clientes",
    element: <ClientesPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
