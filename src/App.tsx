import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PHome from './pages/PHome/PHome'
import PLogin from './pages/PLogin/PLogin'

//  Import dos componentes de listagem
import PListagensClientes from './components/Listagens/ListagensCliente/ListagensClientes'
import PListagensPedidos from './components/Listagens/ListagensPedido/ListagensPedidos'
import PListagensProdutos from './components/Listagens/ListagensProduto/ListagemProduto'

//  Import dos componentes de detalhes
import DetalhesCliente from './components/Listagens/DetalhesCliente/DetalheCliente'
import DetalhesPedidos from './components/Listagens/DetalhesPedidos/DetalhesPedidos'
import DetalhesProdutos from './components/Listagens/DetalhesProdutos/DetalhesProdutos'
import ProtectedRoute from './components/Rotas/ProtectedRoutes'

//  Import dos componentes de cadastro
import PCadastroCliente from './pages/PCadastro/PCadastroCliente/PCadastroCliente'
import PCadastroProduto from './pages/PCadastro/PCadastroProduto/PCadastroProduto'
import PCadastroPedido from './pages/PCadastro/PCadastroPedido/PCadastroPedido'

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

        {/*  Detalhes — rotas novas */}
        <Route path='/detalhes/cliente/:id_cliente' element={<ProtectedRoute element={<DetalhesCliente />} />} />
        <Route path='/detalhes/pedido/:id_pedido'   element={<ProtectedRoute element={<DetalhesPedidos />} />} />
        <Route path='/detalhes/produto/:id_produto' element={<ProtectedRoute element={<DetalhesProdutos />} />} />

        {/* Cadastros */}
        <Route path='/cadastro/cliente' element={<PCadastroCliente />} />
        <Route path='/cadastro/produto' element={<PCadastroProduto />} />
        <Route path='/cadastro/pedido' element={<PCadastroPedido />} />
      </Routes>

    </BrowserRouter>

  )

}

export default App