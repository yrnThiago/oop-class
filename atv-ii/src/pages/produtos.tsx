import { useState } from 'react'
import { DataTable } from '../components/data-table'
import { Link } from 'react-router-dom'

interface Produto {
  id: number
  nome: string
  categoria: string
  preco: number
  estoque: number
}

const produtosIniciais: Produto[] = [
  { id: 1, nome: 'Ração Premium', categoria: 'Alimentação', preco: 89.90, estoque: 50 },
  { id: 2, nome: 'Brinquedo Interativo', categoria: 'Brinquedos', preco: 29.90, estoque: 30 },
  { id: 3, nome: 'Coleira Antipulgas', categoria: 'Acessórios', preco: 39.90, estoque: 40 },
]

const produtosColumns: { key: keyof Produto; header: string }[] = [
  { key: 'nome', header: 'Nome' },
  { key: 'categoria', header: 'Categoria' },
  { key: 'preco', header: 'Preço' },
  { key: 'estoque', header: 'Estoque' },
]

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosIniciais)

  const handleAdd = (novoProduto: Partial<Produto>) => {
    const id = Math.max(...produtos.map(p => p.id), 0) + 1
    setProdutos([...produtos, { ...novoProduto, id, preco: Number(novoProduto.preco), estoque: Number(novoProduto.estoque) } as Produto])
  }

  const handleEdit = (produtoEditado: Produto) => {
    setProdutos(produtos.map(p => p.id === produtoEditado.id ? { ...produtoEditado, preco: Number(produtoEditado.preco), estoque: Number(produtoEditado.estoque) } : p))
  }

  const handleDelete = (produtoParaExcluir: Produto) => {
    setProdutos(produtos.filter(p => p.id !== produtoParaExcluir.id))
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
      <h1 className="text-2xl font-bold mb-4">Produtos</h1>
      <DataTable 
        data={produtos} 
        columns={produtosColumns} 
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
        </div>
    </div>
  )
}