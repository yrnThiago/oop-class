import { useState } from 'react'
import { DataTable } from '../components/data-table'
import { Link } from 'react-router-dom'

interface Pet {
  id: number
  nome: string
  especie: string
  raca: string
  dono: string
}

const petsIniciais: Pet[] = [
  { id: 1, nome: 'Rex', especie: 'Cachorro', raca: 'Labrador', dono: 'João Silva' },
  { id: 2, nome: 'Miau', especie: 'Gato', raca: 'Siamês', dono: 'Maria Santos' },
  { id: 3, nome: 'Piu-Piu', especie: 'Pássaro', raca: 'Canário', dono: 'Pedro Oliveira' },
]

const petsColumns: { key: keyof Pet; header: string }[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'especie', header: 'Espécie' },
  { key: 'raca', header: 'Raça' },
  { key: 'dono', header: 'Dono' },
]

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(petsIniciais)

  const handleAdd = (novoPet: Partial<Pet>) => {
    const id = Math.max(...pets.map(p => p.id), 0) + 1
    setPets([...pets, { ...novoPet, id } as Pet])
  }

  const handleEdit = (petEditado: Pet) => {
    setPets(pets.map(p => p.id === petEditado.id ? petEditado : p))
  }

  const handleDelete = (petParaExcluir: Pet) => {
    setPets(pets.filter(p => p.id !== petParaExcluir.id))
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
                <h1 className="text-2xl font-bold mb-4">Pets</h1>
                <DataTable 
                    data={pets} 
                    columns={petsColumns} 
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    />
            </main>
        </div>
    </div>
    )
}