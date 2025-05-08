import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import ClientesPage from './pages/clientes';
import PetsPage from './pages/pets';
import ProdutosPage from './pages/produtos';
import ServicosPage from './pages/servicos';
import Layout from './pages/layout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/clientes" replace />,
  },
  {
    path: "/clientes",
    element: <ClientesPage />,
  },
  {
    path: "/pets",
    element: <PetsPage />
  },
  {
    path: "/produtos",
    element: <ProdutosPage />,
  },
  {
    path: "/servicos",
    element: <ServicosPage />,

  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
