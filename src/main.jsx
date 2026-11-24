import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/variables.css'
import './css/base.css'
import './css/layout.css'
import './css/componentes.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { AMACProvider } from './context/AMACContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AMACProvider>
      <BrowserRouter>
      <Routes>
          <Route path='admin'>
              {/* TODO añadir app de admin */}
          </Route>
          <Route path="/user/*" element={<App />}>
          </Route>
      </Routes>
        
      </BrowserRouter>
      </AMACProvider>
    </AuthProvider>
  </StrictMode>,
)
