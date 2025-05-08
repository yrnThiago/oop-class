import React from 'react';
import { DataTable } from '../components/data-table';
import { Link } from 'react-router-dom';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

const clientesIniciais: Cliente[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 1234-5678' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 8765-4321' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(11) 9876-5432' },
];

const clientesColumns: { key: keyof Cliente; header: string }[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'email', header: 'E-mail' },
  { key: 'telefone', header: 'Telefone' },
];

class ClientesPage extends React.Component<{}, { clientes: Cliente[] }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      clientes: clientesIniciais
    };
  }

  handleAdd = (novoCliente: Partial<Cliente>) => {
    const id = Math.max(...this.state.clientes.map(c => c.id), 0) + 1;
    this.setState(prevState => ({
      clientes: [...prevState.clientes, { ...novoCliente, id } as Cliente]
    }));
  }

  handleEdit = (clienteEditado: Cliente) => {
    this.setState(prevState => ({
      clientes: prevState.clientes.map(c => c.id === clienteEditado.id ? clienteEditado : c)
    }));
  }

  handleDelete = (clienteParaExcluir: Cliente) => {
    this.setState(prevState => ({
      clientes: prevState.clientes.filter(c => c.id !== clienteParaExcluir.id)
    }));
  }

  render() {
    return (
      <div>
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
            <h1 className="text-2xl font-bold mb-4">Clientes</h1>
            <DataTable 
              data={this.state.clientes} 
              columns={clientesColumns} 
              onAdd={this.handleAdd}
              onEdit={this.handleEdit}
              onDelete={this.handleDelete}
            />
          </main>
        </div>
      </div>
    );
  }
}

export default ClientesPage;