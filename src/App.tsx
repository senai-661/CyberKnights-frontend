import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PHome from './pages/PHome/PHome'
import PLogin from './pages/PLogin/PLogin'

import PListagensClientes from './components/Listagens/ListagensClientes/ListagensClientes'
import PCadastroCliente from './pages/PCadastro/PCadastroCliente/PCadastroCliente'
import PListagensPedidos from './components/Listagens/ListagensPedido/ListagensPedidos'
import PListagensProdutos from './components/Listagens/ListagensProduto/ListagemProduto'

// ✅ Importe os componentes de detalhes
import DetalhesCliente from './components/Listagens/DetalhesCliente/DetalheCliente'
import DetalhesPedidos from './components/Listagens/DetalhesPedidos/DetalhesPedidos'
import DetalhesProdutos from './components/Listagens/DetalhesProdutos/DetalhesProdutos'
import ProtectedRoute from './components/Rotas/ProtectedRoutes'

function App() {
  return (

    <BrowserRouter>

      <Routes>
        {/* Rota Principal */}
        <Route path='/' element={<PHome />} />
        <Route path='/login' element={<PLogin />} />

        {/* Listagens */}
        <Route path='/lista/cliente' element={<ProtectedRoute element={<PListagensClientes />} />} />
        <Route path='/lista/pedido'  element={<ProtectedRoute element={<PListagensPedidos />} />} />
        <Route path='/lista/produto' element={<ProtectedRoute element={<PListagensProdutos />} />} />

        {/* ✅ Detalhes — rotas novas */}
        <Route path='/detalhes/cliente/:id_cliente' element={<ProtectedRoute element={<DetalhesCliente />} />} />
        <Route path='/detalhes/pedido/:id_pedido'   element={<ProtectedRoute element={<DetalhesPedidos />} />} />
        <Route path='/detalhes/produto/:id_produto' element={<ProtectedRoute element={<DetalhesProdutos />} />} />

        {/* Cadastros */}
        <Route path='/cadastro/cliente' element={<PCadastroCliente />} />
      </Routes>

    </BrowserRouter>

  )

}

export default App
