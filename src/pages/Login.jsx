import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { iniciar_session } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { RUTAS, rutaInicioPorRol } from '../lib/rutas'
import { validarObligatorio, soloErrores, enfocarPrimerError } from '../lib/validaciones'
import { Tarjeta, CampoFormulario, MensajeError } from '../components/formulario/Formulario'

// RF-008: inicio de sesión para candidatos y empresas
export default function Login() {
    const { sesion, perfil, cargando } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const desde = location.state?.desde // si llegó aquí desde una ruta protegida

    const [correo, setCorreo] = useState('')
    const [contrasena, setContrasena] = useState('')
    const [errores, setErrores] = useState({})
    const [mensaje, setMensaje] = useState('')
    const [enviando, setEnviando] = useState(false)

    useEffect(() => { document.title = 'Iniciar sesión | AMAC' }, [])

    // En cuanto hay sesión y el contexto terminó de cargar el perfil (al iniciar
    // sesión, o si ya había sesión), mandamos a cada rol a su página.
    // También si la cuenta no tiene perfil (p. ej. creada antes del trigger): así no se queda "trabado".
    useEffect(() => {
        if (sesion && !cargando) navigate(desde ?? rutaInicioPorRol(perfil?.rol), { replace: true })
    }, [sesion, cargando, perfil, desde, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensaje('')

        // Campos vacíos -> mensaje de campo obligatorio
        const nuevos = soloErrores({
            correo: validarObligatorio(correo, 'Escribe tu correo electrónico.'),
            contrasena: validarObligatorio(contrasena, 'Escribe tu contraseña.'),
        })
        setErrores(nuevos)
        if (Object.keys(nuevos).length > 0) {
            enfocarPrimerError(nuevos, ['correo', 'contrasena'])
            return
        }

        setEnviando(true)
        const { error } = await iniciar_session(correo.trim(), contrasena)
        setEnviando(false)

        if (error) {
            // Mensaje genérico: no decimos cuál de los dos datos falló
            if (error.code === 'email_not_confirmed') {
                setMensaje('Tu correo aún no está confirmado. Busca el correo de AMAC en tu bandeja de entrada.')
            } else if (error.status === 400 || error.code === 'invalid_credentials') {
                setMensaje('Correo o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.')
            } else {
                setMensaje('No pudimos iniciar sesión. Revisa tu conexión e inténtalo de nuevo.')
            }
            setContrasena('')
            document.getElementById('correo')?.focus()
        }
        // Si no hubo error, el useEffect de arriba redirige cuando llegue el perfil
    }

    return <div className="pagina-formulario">
        <h1 id="titulo-login">Iniciar sesión</h1>
        <p className="intro">Entra con tu correo y contraseña.</p>

        <Tarjeta onSubmit={handleSubmit} aria-labelledby="titulo-login">
            <MensajeError>{mensaje}</MensajeError>

            <CampoFormulario
                id="correo" etiqueta="Correo electrónico" type="email" autoComplete="email"
                value={correo} onChange={(e) => setCorreo(e.target.value)}
                error={errores.correo} required
            />
            <CampoFormulario
                id="contrasena" etiqueta="Contraseña" type="password" autoComplete="current-password"
                value={contrasena} onChange={(e) => setContrasena(e.target.value)}
                error={errores.contrasena} required
            />

            <button className="btn btn-primario max-w" type="submit" disabled={enviando}>
                {enviando ? 'ENTRANDO…' : 'INICIAR SESIÓN'}
            </button>
        </Tarjeta>

        <p className="pregunta-cuenta">
            ¿No tienes cuenta? <Link className="enlace-fuerte" to={RUTAS.registroCandidato}>Regístrate</Link>
        </p>
        <p className="pregunta-cuenta pregunta-cuenta--secundaria">
            ¿Eres una empresa? <Link className="enlace-fuerte" to={RUTAS.registroEmpresa}>Registra tu empresa</Link>
        </p>
    </div>
}