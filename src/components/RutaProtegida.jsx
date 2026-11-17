import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function RutaProtegida({ rol, children }) {
const { perfil, cargando } = useAuth()
if (cargando) return <p role="status">Cargando…</p>
if (!perfil) return <Navigate to="/login" replace />
if (perfil.rol !== rol) return <Navigate to="/" replace />
return children
}