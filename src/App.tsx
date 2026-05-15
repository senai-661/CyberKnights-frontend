import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PHome from './pages/PHome/PHome'
import PLogin from './pages/PLogin/PLogin'

import PListagensClientes from './components/Listagens/ListagensClientes/ListagensClientes'
import PListagensPedidos from './components/Listagens/ListagensPedido/ListagensPedidos'
import PListagensProdutos from './components/Listagens/ListagensProduto/ListagemProduto'

import PDetalhesCliente from './components/Listagens/DetalhesCliente/PDetalhesCliente'
import PDetalhesPedido from './components/Listagens/DetalhesPedido/PDetalhesPedido'
import PDetalhesProduto from './components/Listagens/DetalhesProduto/PDetalhesProduto'

import ProtectedRoute from './components/Rotas/ProtectedRoutes'

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path='/' element={<PHome />} />

        <Route path='/login' element={<PLogin />} />

        <Route
          path='/lista/cliente'
          element={<ProtectedRoute element={<PListagensClientes />} />}
        />

        <Route
          path='/lista/pedido'
          element={<ProtectedRoute element={<PListagensPedidos />} />}
        />

        <Route
          path='/lista/produto'
          element={<ProtectedRoute element={<PListagensProdutos />} />}
        />

        {/* DETALHES CLIENTE */}
        <Route
          path='/detalhes/cliente/:id'
          element={<ProtectedRoute element={<PDetalhesCliente />} />}
        />

        {/* DETALHES PRODUTO */}
        <Route
          path='/detalhes/produto/:id'
          element={<ProtectedRoute element={<PDetalhesProduto />} />}
        />

        {/* DETALHES PEDIDO */}
        <Route
          path='/detalhes/pedido/:id'
          element={<ProtectedRoute element={<PDetalhesPedido />} />}
        />

      </Routes>

    </BrowserRouter>

  )

}

export default App;