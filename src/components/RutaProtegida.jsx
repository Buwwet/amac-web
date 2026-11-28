import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { RUTAS } from '../lib/rutas'

// RF-010. Solo esconde pantallas: la seguridad real está en las políticas RLS.
export default function RutaProtegida({ rol, children }) {
    const { perfil, cargando } = useAuth()
    const location = useLocation()

    if (cargando) return <p role="status">Cargando…</p>
    // Guardamos a dónde quería ir para regresarlo ahí después de iniciar sesión
    if (!perfil) return <Navigate to={RUTAS.login} replace state={{ desde: location.pathname }} />
    if (perfil.rol !== rol) return <Navigate to={RUTAS.inicio} replace />
    return children
}
