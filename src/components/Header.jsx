import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import Popup from "./Popup";
import { useAuth } from "../context/AuthContext";
import { RUTAS } from "../lib/rutas";

// Enlaces del menú según quién esté conectado (RF-010)
function enlacesPorRol(rol) {
    if (rol === 'empresa') return [
        { texto: 'INICIO', to: RUTAS.inicio },
        { texto: 'MIS VACANTES', to: RUTAS.empresaVacantes },
        { texto: 'SOLICITUDES', to: RUTAS.empresaSolicitudes },
        { texto: 'AYUDA', to: RUTAS.ayuda },
    ]
    if (rol === 'candidato') return [
        { texto: 'INICIO', to: RUTAS.inicio },
        { texto: 'VACANTES', to: RUTAS.inicio },
        { texto: 'SOLICITUDES', to: RUTAS.misSolicitudes },
        { texto: 'AYUDA', to: RUTAS.ayuda },
    ]
    // Visitante (sin sesión)
    return [
        { texto: 'INICIO', to: RUTAS.inicio },
        { texto: 'VACANTES', to: RUTAS.inicio },
        { texto: 'AYUDA', to: RUTAS.ayuda },
    ]
}

// Primer nombre para el saludo: "Luis Carlos Ramírez" -> "Luis"
function primerNombre(perfil) {
    if (perfil.rol === 'empresa') return perfil.nombre
    return perfil.nombre?.trim().split(/\s+/)[0] || 'Mi perfil'
}

// Círculo con el logo de la empresa o la inicial del nombre
function Avatar({ perfil }) {
    if (perfil.img_url) return <img className="avatar" src={perfil.img_url} alt="" />
    return <span className="avatar" aria-hidden="true">{(perfil.nombre ?? '?').trim().charAt(0).toUpperCase()}</span>
}

export default function Header() {
    const { sesion, perfil, cargando, cerrarSesion } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setOpen] = useState(false);

    const togglePopup = () => setOpen(!isOpen);
    const closePopup = () => setOpen(false);

    const enlaces = enlacesPorRol(perfil?.rol);
    const rutaPerfil = perfil?.rol === 'empresa' ? RUTAS.perfilEmpresa : RUTAS.perfilCandidato;

    // RF-009: cerrar sesión y volver al inicio
    const salir = async () => {
        closePopup();
        await cerrarSesion();
        navigate(RUTAS.inicio, { replace: true });
    }

    // Parte derecha del menú: entrar/registrarse o perfil/salir.
    // Mientras se revisa la sesión no mostramos nada, para que no "parpadee".
    const zonaSesion = (enMovil) => {
        if (cargando) return null;
        if (perfil) return <>
            <Link className="nav-perfil" to={rutaPerfil} onClick={closePopup}
                aria-label={`Mi perfil: ${perfil.nombre}`}>
                <Avatar perfil={perfil} />
                <span className="nav-perfil__nombre">{primerNombre(perfil)}</span>
            </Link>
            <button type="button" className={enMovil ? "nav-salir nav-salir--movil" : "nav-salir"} onClick={salir}>
                SALIR
            </button>
        </>;
        // Hay sesión pero la cuenta no tiene fila en "perfiles": al menos dejamos salir
        if (sesion) return <button type="button" className={enMovil ? "nav-salir nav-salir--movil" : "nav-salir"} onClick={salir}>
            SALIR
        </button>;
        return <>
            <Link to={RUTAS.login} onClick={closePopup}>ENTRAR</Link>
            <Link className="nav-registrarse" to={RUTAS.registroCandidato} onClick={closePopup}>REGISTRARSE</Link>
        </>;
    }

    return <header>

        <div className="popup-movil">
            <Popup isOpen={isOpen} closePopup={closePopup}>
                <div>
                    <nav className="movil-vert" id="menu-movil" aria-label="Navegación principal - móvil">
                        {enlaces.map((e) => <Link key={e.texto} to={e.to} onClick={closePopup}>{e.texto}</Link>)}
                        {zonaSesion(true)}
                    </nav>
                </div>
            </Popup>
        </div>

        <Link to={RUTAS.inicio} className="logo-inicio" aria-label="AMAC, ir al inicio">
            <img src="/img/logo.png" alt="LOGO AMAC"/>
        </Link>

        {/* Componente NAV-BAR tiene funcionalidad diferente dependiendo de si es mobil o web */}
        <nav className="movil" aria-label="Menú - móvil">
            {/* En celular se ve quién inició sesión sin abrir el menú */}
            {!cargando && perfil &&
                <Link className="nav-perfil nav-perfil--movil" to={rutaPerfil} aria-label={`Mi perfil: ${perfil.nombre}`}>
                    <Avatar perfil={perfil} />
                </Link>}
            <button type="button" className="btn-menu" onClick={togglePopup}
                aria-expanded={isOpen} aria-controls="menu-movil" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}>
                <img id="menu-nav" alt="" src="/icons/menu.svg"/>
            </button>
        </nav>
        <nav className="web" aria-label="Navegación principal - web">
            <div className="nav-enlaces">
                {enlaces.map((e) => <Link key={e.texto} to={e.to}>{e.texto}</Link>)}
            </div>
            <div className="nav-sesion">
                {zonaSesion(false)}
            </div>
        </nav>
    </header>
}