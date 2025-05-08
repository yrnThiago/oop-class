import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './pages/layout'
import ClientesPage from './pages/clientes'
import PetsPage from './pages/pets'
import ProdutosPage from './pages/produtos'
import ServicosPage from './pages/servicos'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ClientesPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="pets" element={<PetsPage />} />
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="servicos" element={<ServicosPage />} />
        </Route>
      </Routes>
    </Router>
  )
}