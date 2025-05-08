import React from 'react';
import { Link, Outlet } from 'react-router-dom';

class Layout extends React.Component {
  render() {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-primary-foreground shadow-md">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex space-x-4">
              <li><Link to="/clientes" className="hover:underline">Clientes</Link></li>
              <li><Link to="/pets" className="hover:underline">Pets</Link></li>
              <li><Link to="/produtos" className="hover:underline">Produtos</Link></li>
              <li><Link to="/servicos" className="hover:underline">Serviços</Link></li>
            </ul>
          </nav>
        </header>
        <main className="flex-grow container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
    );
  }
}

export default Layout;