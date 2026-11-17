import { useState } from "react"

export default function Header() {
    // TODO: determinar si usar la version web o mobil. La versión mobil tiene funcionalidad extra.
    const [isOpen, setOpen] = useState(false);

    const handleToggleMenu = () => setOpen(!isOpen);

    return <header>
            <img src="/img/logo.png" alt="LOGO AMAC"/>
            {/* Componente NAV-BAR tiene funcionalidad diferente dependiendo de si es mobil o web */}
            <nav className="movil" aria-label="Navegación principal - web">
                <img id="menu-nav" aria-label="menu" src="/icons/menu.svg" onClick={handleToggleMenu}/>
                {isOpen ? <>
                    TODO
                </> : <></>}
            </nav>
            <nav className="web" aria-label="Navegación principal - web">
                <a aria-label="Inicio" href="/user/">INICIO</a>
                <a aria-label="Perfil" href="/user/mi-perfil.html">PERFIL</a>
                <a aria-label="Mis Solicitudes" href="/user/mis-solicitudes.html">SOLICITUDES</a>
                <a aria-label="Vacantes" href="/user/index.html">VACANTES</a>
                <a aria-label="Ayuda" href="/user/ayuda.html">AYUDA</a>
            </nav>
        </header>
}