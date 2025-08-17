
import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Inicio from './pages/Inicio'
import ProtectedRoute from './components/ProtectedRoute'
import { SesionCerrada } from './pages/SesionCerrada'
import Clientes from './pages/Clientes'
import Solicitudes from './pages/Solicitudes'
import InformesPage from './pages/Informes'
import Configuracion from './pages/Configuracion'

import GastosGoogleAPI from './pages/GastosGoogleAPI'

import ResetConfirm from './pages/ResetConfirm'
import ResetRequest from './pages/ResetRequest'
import Empresas from './pages/empresas'
import Usuarios from './pages/Usuarios'



function App() {

  return (
  <>
  
    <Routes>
      {/* Rutas publicas */}
      <Route path= "/login" element={<Login/>}/> 
      <Route path= "/sesion-cerrada" element={<SesionCerrada/>} />
      <Route path="/gastos" element={<GastosGoogleAPI />} />
      <Route path="/recuperar-contraseña" element={<ResetRequest />} />
      <Route path="/restablecer" element={<ResetConfirm />} />
      <Route path="/empresa" element={<Empresas />} />
      <Route path="/usuarios" element={<Usuarios />} />





      
      {/* Rutas Protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
        }>
        <Route index element={<Inicio/>}/>
        <Route path="/clientes" element={ <Clientes /> }/>
        <Route path= "/solicitudes" element={<Solicitudes/>}/>
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/informes" element={<InformesPage />} />
        

      </Route>

    </Routes>
  </>
  )
}

export default App
