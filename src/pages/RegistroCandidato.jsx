import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { crear_perfil } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { RUTAS, rutaInicioPorRol } from '../lib/rutas'
import {
    validarObligatorio, validarCorreo, validarTelefono, validarEdad,
    validarContrasena, validarConfirmacion, limpiarTelefono,
    soloErrores, enfocarPrimerError, mensajeErrorRegistro,
} from '../lib/validaciones'
import {
    Tarjeta, GrupoCampos, CampoFormulario, Opcion, MensajeError, Nota,
} from '../components/formulario/Formulario'

const INICIAL = {
    correo: '', celular: '', contrasena: '', contrasena2: '',
    nombres: '', apellidoPaterno: '', apellidoMaterno: '', edad: '',
    colonia: '', experiencia: '', habilidades: '',
    terminos: false, privacidad: false,
}

const REVISA = 'Revisa los campos marcados en rojo.'

// Orden en que aparecen los campos, para enfocar el primero con error
const ORDEN = [
    'correo', 'celular', 'contrasena', 'contrasena2',
    'nombres', 'apellidoPaterno', 'apellidoMaterno', 'edad',
    'colonia', 'terminos', 'privacidad',
]

function validar(d) {
    return soloErrores({
        correo: validarCorreo(d.correo),
        celular: validarTelefono(d.celular),
        contrasena: validarContrasena(d.contrasena),
        contrasena2: validarConfirmacion(d.contrasena, d.contrasena2),
        nombres: validarObligatorio(d.nombres, 'Escribe tu nombre.'),
        apellidoPaterno: validarObligatorio(d.apellidoPaterno, 'Escribe tu apellido paterno.'),
        edad: validarEdad(d.edad),
        colonia: validarObligatorio(d.colonia, 'Escribe tu colonia.'),
        terminos: d.terminos ? '' : 'Para crear tu cuenta, acepta los términos y condiciones.',
        privacidad: d.privacidad ? '' : 'Para crear tu cuenta, acepta la política de privacidad.',
    })
}

// RF-011, RF-012, RF-013: registro de candidato
export default function RegistroCandidato() {
    const { perfil } = useAuth()
    const navigate = useNavigate()

    const [datos, setDatos] = useState(INICIAL)
    const [errores, setErrores] = useState({})
    const [mensaje, setMensaje] = useState('')
    const [enviando, setEnviando] = useState(false)
    // null = todavía no se registra; 'sesion' = ya entró; 'confirmar' = falta confirmar el correo
    const [resultado, setResultado] = useState(null)
    const registrando = useRef(false)

    useEffect(() => { document.title = 'Registro de candidato | AMAC' }, [])

    // Si alguien que ya inició sesión abre esta página, lo mandamos a su inicio.
    // (No lo hacemos justo después de registrarse: ahí mostramos el aviso de aprobación.)
    useEffect(() => {
        if (perfil && !registrando.current) navigate(rutaInicioPorRol(perfil.rol), { replace: true })
    }, [perfil, navigate])

    const cambiar = (e) => {
        const { name, type, checked, value } = e.target
        setDatos((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }))
        // Al corregir un campo se quita su error
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

        // La tabla perfiles guarda un solo "nombre" y una sola "experiencia"
        const nombre = [datos.nombres, datos.apellidoPaterno, datos.apellidoMaterno]
            .map((t) => t.trim()).filter(Boolean).join(' ')
        const experiencia = [
            datos.experiencia.trim(),
            datos.habilidades.trim() && `Habilidades: ${datos.habilidades.trim()}`,
        ].filter(Boolean).join('\n\n')

        setEnviando(true)
        registrando.current = true
        const { data, error } = await crear_perfil(datos.correo.trim(), datos.contrasena, {
            rol: 'candidato',
            nombre,
            telefono: limpiarTelefono(datos.celular) || null,
            edad: Number(datos.edad),
            colonia: datos.colonia.trim(),
            experiencia: experiencia || null,
        })
        setEnviando(false)

        // Con "Confirm email" activado, Supabase no marca error si el correo ya existe:
        // regresa un usuario sin identidades.
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
            <h1>¡Tu cuenta fue creada!</h1>
            <div className="tarjeta registro-listo" role="status">
                {resultado === 'confirmar'
                    ? <p>Te enviamos un correo a <strong>{datos.correo.trim()}</strong>. Ábrelo y confirma tu cuenta para poder entrar.</p>
                    : <p>Ya iniciaste sesión con <strong>{datos.correo.trim()}</strong>.</p>}
                <Nota>
                    Antes de postularte, AMAC revisará y aprobará tu registro. Mientras tanto ya puedes ver las vacantes.
                </Nota>
                <Link className="btn btn-primario max-w" to={resultado === 'confirmar' ? RUTAS.login : RUTAS.inicio}>
                    {resultado === 'confirmar' ? 'IR A INICIAR SESIÓN' : 'VER VACANTES'}
                </Link>
            </div>
        </div>
    }

    return <div className="pagina-formulario">
        <h1>Registro de candidato</h1>
        <p className="intro">Llena tus datos para crear tu cuenta. Los campos con * son obligatorios.</p>

        <Tarjeta onSubmit={handleSubmit}>
            <MensajeError>{mensaje}</MensajeError>

            <GrupoCampos titulo="Datos de contacto">
                <div className="rejilla-campos">
                    <CampoFormulario id="correo" etiqueta="Correo electrónico *" type="email"
                        autoComplete="email" value={datos.correo} onChange={cambiar}
                        error={errores.correo} required />
                    <CampoFormulario id="celular" etiqueta="Celular" type="tel" inputMode="numeric"
                        autoComplete="tel-national" value={datos.celular} onChange={cambiar}
                        error={errores.celular} ayuda="10 dígitos. Ejemplo: 8112345678" />
                    <CampoFormulario id="contrasena" etiqueta="Contraseña *" type="password"
                        autoComplete="new-password" value={datos.contrasena} onChange={cambiar}
                        error={errores.contrasena} ayuda="Mínimo 8 caracteres." required />
                    <CampoFormulario id="contrasena2" etiqueta="Repetir contraseña *" type="password"
                        autoComplete="new-password" value={datos.contrasena2} onChange={cambiar}
                        error={errores.contrasena2} required />
                </div>
            </GrupoCampos>

            <GrupoCampos titulo="Datos personales">
                <div className="rejilla-campos">
                    <CampoFormulario id="nombres" etiqueta="Nombre(s) *" completo
                        autoComplete="given-name" value={datos.nombres} onChange={cambiar}
                        error={errores.nombres} required />
                    <CampoFormulario id="apellidoPaterno" etiqueta="Apellido paterno *"
                        autoComplete="family-name" value={datos.apellidoPaterno} onChange={cambiar}
                        error={errores.apellidoPaterno} required />
                    <CampoFormulario id="apellidoMaterno" etiqueta="Apellido materno"
                        value={datos.apellidoMaterno} onChange={cambiar} />
                    <CampoFormulario id="edad" etiqueta="Edad *" type="number" inputMode="numeric"
                        min="18" max="120" value={datos.edad} onChange={cambiar}
                        error={errores.edad} required />
                    <CampoFormulario id="colonia" etiqueta="Colonia *"
                        autoComplete="address-level3" value={datos.colonia} onChange={cambiar}
                        error={errores.colonia} required />
                </div>
            </GrupoCampos>

            <GrupoCampos titulo="Perfil profesional">
                <CampoFormulario id="experiencia" etiqueta="Experiencia laboral" como="textarea"
                    value={datos.experiencia} onChange={cambiar}
                    ayuda="Cuéntanos en qué has trabajado." />
                <CampoFormulario id="habilidades" etiqueta="Habilidades" como="textarea"
                    value={datos.habilidades} onChange={cambiar}
                    ayuda="Por ejemplo: atención a clientes, cocina, manejo de caja." />
            </GrupoCampos>

            <GrupoCampos titulo="Términos">
                {/* Las páginas de términos y privacidad aún no existen: cambiar el href cuando estén */}
                <Opcion id="terminos" checked={datos.terminos} onChange={cambiar} error={errores.terminos}
                    etiqueta={<>Acepto los <a className="enlace-fuerte" href="#">Términos y condiciones</a></>} />
                <Opcion id="privacidad" checked={datos.privacidad} onChange={cambiar} error={errores.privacidad}
                    etiqueta={<>Acepto la <a className="enlace-fuerte" href="#">Política de privacidad</a></>} />
            </GrupoCampos>

            <Nota>Al terminar, AMAC revisará y aprobará tu cuenta antes de que puedas postularte.</Nota>

            <button className="btn btn-primario max-w" type="submit" disabled={enviando}>
                {enviando ? 'CREANDO CUENTA…' : 'CREAR CUENTA'}
            </button>
        </Tarjeta>

        <p className="pregunta-cuenta">
            ¿Ya tienes cuenta? <Link className="enlace-fuerte" to={RUTAS.login}>Inicia sesión</Link>
        </p>
        <p className="pregunta-cuenta pregunta-cuenta--secundaria">
            ¿Eres una empresa? <Link className="enlace-fuerte" to={RUTAS.registroEmpresa}>Registra tu empresa</Link>
        </p>
    </div>
}
