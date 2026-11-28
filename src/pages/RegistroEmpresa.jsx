import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { crear_perfil } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { RUTAS, rutaInicioPorRol } from '../lib/rutas'
import {
    validarObligatorio, validarCorreo, validarTelefono,
    validarContrasena, validarConfirmacion, limpiarTelefono,
    soloErrores, enfocarPrimerError, mensajeErrorRegistro,
} from '../lib/validaciones'
import {
    Tarjeta, GrupoCampos, CampoFormulario, Opcion, MensajeError, Nota,
} from '../components/formulario/Formulario'

const GIROS = [
    'Tecnología y Software',
    'Comercio / Retail',
    'Servicios Profesionales',
    'Manufactura / Industria',
    'Salud y Bienestar',
    'Educación',
    'Alimentos',
    'Otro',
]

const INICIAL = {
    nombre: '', giro: '', telefono: '', colonia: '',
    correo: '', contrasena: '', contrasena2: '',
    terminos: false,
}

const REVISA = 'Revisa los campos marcados en rojo.'

const ORDEN = ['nombre', 'giro', 'telefono', 'colonia', 'correo', 'contrasena', 'contrasena2', 'terminos']

function validar(d) {
    return soloErrores({
        nombre: validarObligatorio(d.nombre, 'Escribe el nombre de la empresa.'),
        giro: validarObligatorio(d.giro, 'Selecciona el giro de la empresa.'),
        telefono: validarTelefono(d.telefono, true),
        correo: validarCorreo(d.correo),
        contrasena: validarContrasena(d.contrasena),
        contrasena2: validarConfirmacion(d.contrasena, d.contrasena2),
        terminos: d.terminos ? '' : 'Para registrar la empresa, acepta los términos y la política de privacidad.',
    })
}

// RF-015 (versión simplificada de la Entrega 3): registro de empresa
export default function RegistroEmpresa() {
    const { perfil } = useAuth()
    const navigate = useNavigate()

    const [datos, setDatos] = useState(INICIAL)
    const [errores, setErrores] = useState({})
    const [mensaje, setMensaje] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [resultado, setResultado] = useState(null) // null | 'sesion' | 'confirmar'
    const registrando = useRef(false)

    useEffect(() => { document.title = 'Registro de empresa | AMAC' }, [])

    useEffect(() => {
        if (perfil && !registrando.current) navigate(rutaInicioPorRol(perfil.rol), { replace: true })
    }, [perfil, navigate])

    const cambiar = (e) => {
        const { name, type, checked, value } = e.target
        setDatos((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }))
        if (errores[name]) {
            const { [name]: _quitado, ...resto } = errores
            setErrores(resto)
            // Si ya corrigió todo, quitamos el aviso de arriba
            if (Object.keys(resto).length === 0 && mensaje === REVISA) setMensaje('')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMensaje('')

        const nuevos = validar(datos)
        setErrores(nuevos)
        if (Object.keys(nuevos).length > 0) {
            setMensaje(REVISA)
            enfocarPrimerError(nuevos, ORDEN)
            return
        }

        setEnviando(true)
        registrando.current = true
        const { data, error } = await crear_perfil(datos.correo.trim(), datos.contrasena, {
            rol: 'empresa',
            nombre: datos.nombre.trim(),
            giro: datos.giro,
            telefono: limpiarTelefono(datos.telefono),
            colonia: datos.colonia.trim() || null,
        })
        setEnviando(false)

        const yaExistia = data?.user && data.user.identities?.length === 0
        if (error || yaExistia) {
            registrando.current = false
            setMensaje(yaExistia ? mensajeErrorRegistro({ code: 'user_already_exists' }) : mensajeErrorRegistro(error))
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }

        setResultado(data.session ? 'sesion' : 'confirmar')
        window.scrollTo({ top: 0 })
    }

    if (resultado) {
        return <div className="pagina-formulario">
            <h1>¡Empresa registrada!</h1>
            <div className="tarjeta registro-listo" role="status">
                {resultado === 'confirmar'
                    ? <p>Te enviamos un correo a <strong>{datos.correo.trim()}</strong>. Ábrelo y confirma la cuenta para poder entrar.</p>
                    : <p><strong>{datos.nombre.trim()}</strong> ya tiene su cuenta y la sesión está iniciada.</p>}
                <Link className="btn btn-primario max-w"
                    to={resultado === 'confirmar' ? RUTAS.login : rutaInicioPorRol('empresa')}>
                    {resultado === 'confirmar' ? 'IR A INICIAR SESIÓN' : 'CONTINUAR'}
                </Link>
            </div>
        </div>
    }

    return <div className="pagina-formulario">
        <h1>Registro de empresa</h1>
        <p className="intro">Registra tu empresa para publicar vacantes. Los campos con * son obligatorios.</p>

        <Tarjeta onSubmit={handleSubmit}>
            <MensajeError>{mensaje}</MensajeError>

            <GrupoCampos titulo="Datos de la empresa">
                <div className="rejilla-campos">
                    <CampoFormulario id="nombre" etiqueta="Nombre de la empresa *" completo
                        autoComplete="organization" value={datos.nombre} onChange={cambiar}
                        error={errores.nombre} required />
                    <CampoFormulario id="giro" etiqueta="Giro *" como="select" opciones={GIROS}
                        value={datos.giro} onChange={cambiar} error={errores.giro} required />
                    <CampoFormulario id="telefono" etiqueta="Teléfono *" type="tel" inputMode="numeric"
                        autoComplete="tel-national" value={datos.telefono} onChange={cambiar}
                        error={errores.telefono} ayuda="10 dígitos." required />
                    <CampoFormulario id="colonia" etiqueta="Colonia o municipio" completo
                        value={datos.colonia} onChange={cambiar} />
                </div>
            </GrupoCampos>

            <GrupoCampos titulo="Datos de acceso">
                <div className="rejilla-campos">
                    <CampoFormulario id="correo" etiqueta="Correo electrónico *" type="email" completo
                        autoComplete="email" value={datos.correo} onChange={cambiar}
                        error={errores.correo} required />
                    <CampoFormulario id="contrasena" etiqueta="Contraseña *" type="password"
                        autoComplete="new-password" value={datos.contrasena} onChange={cambiar}
                        error={errores.contrasena} ayuda="Mínimo 8 caracteres." required />
                    <CampoFormulario id="contrasena2" etiqueta="Repetir contraseña *" type="password"
                        autoComplete="new-password" value={datos.contrasena2} onChange={cambiar}
                        error={errores.contrasena2} required />
                </div>
            </GrupoCampos>

            <GrupoCampos titulo="Términos">
                {/* Las páginas de términos y privacidad aún no existen: cambiar el href cuando estén */}
                <Opcion id="terminos" checked={datos.terminos} onChange={cambiar} error={errores.terminos}
                    etiqueta={<>Acepto los <a className="enlace-fuerte" href="#">Términos y condiciones</a> y
                        la <a className="enlace-fuerte" href="#">Política de privacidad</a></>} />
            </GrupoCampos>

            <Nota>Con la cuenta de empresa podrás publicar vacantes y revisar a quién se postula.</Nota>

            <button className="btn btn-primario max-w" type="submit" disabled={enviando}>
                {enviando ? 'REGISTRANDO…' : 'REGISTRAR EMPRESA'}
            </button>
        </Tarjeta>

        <p className="pregunta-cuenta">
            ¿La empresa ya tiene cuenta? <Link className="enlace-fuerte" to={RUTAS.login}>Inicia sesión</Link>
        </p>
        <p className="pregunta-cuenta pregunta-cuenta--secundaria">
            ¿Buscas trabajo? <Link className="enlace-fuerte" to={RUTAS.registroCandidato}>Regístrate como candidato</Link>
        </p>
    </div>
}
