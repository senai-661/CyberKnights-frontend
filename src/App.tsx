import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PHome from './pages/PHome/PHome'
import PLogin from './pages/PLogin/PLogin'
import PListagemCliente from './pages/PListagem/PListagemCliente/PListagemCliente'
import PListagemPedido from './pages/PListagem/PListagemPedido/PListagemPedido'
import PListagemProduto from './pages/PListagem/PListagemProduto/PListagemProduto'

// import ProtectedRoute from './components/Rotas/ProtectedRoutes'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PHome />} />
        <Route path='/login' element={<PLogin />} />
        <Route path='/lista/clientes' element={<PListagemCliente />} />
        <Route path='/lista/pedidos' element={<PListagemPedido />} />
        <Route path='/lista/produtos' element={<PListagemProduto />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App