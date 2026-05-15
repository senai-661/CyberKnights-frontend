import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PHome from './pages/PHome/PHome'
import PLogin from './pages/PLogin/PLogin'
import PListagensClientes from './components/Listagens/ListagensClientes/ListagensClientes'
import PListagensPedidos from './components/Listagens/ListagensPedido/ListagensPedidos'
import PListagensProdutos from './components/Listagens/ListagensProdutos/ListagensProdutos'
import ProtectedRoute from './components/Rotas/ProtectedRoutes'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Principal: Landing Page do MedFlow */}
        <Route path='/' element={<PHome />} /> 
        <Route path='/login' element = {<PLogin/>}/>
        <Route path='/lista/cliente' element={<ProtectedRoute element={<PListagensClientes />} />}/>
        <Route path='/lista/pedido' element={<ProtectedRoute element={<PListagensPedidos />} />}/>
        <Route path='/lista/produto' element={<ProtectedRoute element={<PListagensProdutos />} />}/> 

      </Routes>
    </BrowserRouter>
  )
}

export default App;