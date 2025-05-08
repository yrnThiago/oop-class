import { useState } from 'react'
import { DataTable } from '../components/data-table'
import { Link } from 'react-router-dom'

interface Servico {
  id: number
  nome: string
  duracao: string
  preco: number
}

const servicosIniciais: Servico[] = [
  { id: 1, nome: 'Banho e Tosa', duracao: '2 horas', preco: 80.00 },
  { id: 2, nome: 'Consulta Veterinária', duracao: '1 hora', preco: 150.00 },
  { id: 3, nome: 'Adestramento', duracao: '1 hora', preco: 100.00 },
]

const servicosColumns: { key: keyof Servico; header: string }[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'duracao', header: 'Duração' },
  { key: 'preco', header: 'Preço' },
]

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>(servicosIniciais)

  const handleAdd = (novoServico: Partial<Servico>) => {
    const id = Math.max(...servicos.map(s => s.id), 0) + 1
    setServicos([...servicos, { ...novoServico, id, preco: Number(novoServico.preco) } as Servico])
  }

  const handleEdit = (servicoEditado: Servico) => {
    setServicos(servicos.map(s => s.id === servicoEditado.id ? { ...servicoEditado, preco: Number(servicoEditado.preco) } : s))
  }

  const handleDelete = (servicoParaExcluir: Servico) => {
    setServicos(servicos.filter(s => s.id !== servicoParaExcluir.id))
  }

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
        data={servicos} 
        columns={servicosColumns} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
        </div>
    </div>
  )
}