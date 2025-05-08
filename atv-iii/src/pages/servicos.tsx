import React from 'react';
import { DataTable } from '../components/data-table';
import { Link } from 'react-router-dom';

interface Servico {
  id: number;
  nome: string;
  duracao: string;
  preco: number;
}

const servicosIniciais: Servico[] = [
  { id: 1, nome: 'Banho e Tosa', duracao: '2 horas', preco: 80.00 },
  { id: 2, nome: 'Consulta Veterinária', duracao: '1 hora', preco: 150.00 },
  { id: 3, nome: 'Adestramento', duracao: '1 hora', preco: 100.00 },
];

const servicosColumns: { key: keyof Servico; header: string }[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'duracao', header: 'Duração' },
  { key: 'preco', header: 'Preço' },
];

class ServicosPage extends React.Component<{}, { servicos: Servico[] }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      servicos: servicosIniciais
    };
  }

  handleAdd = (novoServico: Partial<Servico>) => {
    const id = Math.max(...this.state.servicos.map(s => s.id), 0) + 1;
    this.setState(prevState => ({
      servicos: [...prevState.servicos, { ...novoServico, id, preco: Number(novoServico.preco) } as Servico]
    }));
  }

  handleEdit = (servicoEditado: Servico) => {
    this.setState(prevState => ({
      servicos: prevState.servicos.map(s => s.id === servicoEditado.id ? { ...servicoEditado, preco: Number(servicoEditado.preco) } : s)
    }));
  }

  handleDelete = (servicoParaExcluir: Servico) => {
    this.setState(prevState => ({
      servicos: prevState.servicos.filter(s => s.id !== servicoParaExcluir.id)
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
            <h1 className="text-2xl font-bold mb-4">Serviços</h1>
            <DataTable 
              data={this.state.servicos} 
              columns={servicosColumns} 
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

export default ServicosPage;