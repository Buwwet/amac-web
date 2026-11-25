import { useState } from "react"
import Popup from "./Popup";

export default function Header() {
    // TODO: determinar si usar la version web o mobil. La versión mobil tiene funcionalidad extra.
    const [isOpen, setOpen] = useState(false);


    const togglePopup = () => setOpen(!isOpen);
    const openPopup = () => setOpen(true);
    const closePopup = () => setOpen(false);

    return <header>

        <div className="popup-movil">
            <Popup isOpen={isOpen} closePopup={closePopup}>
                <nav className="movil-vert">
                    <a aria-label="Inicio" href="/user/">INICIO</a>
                    <a aria-label="Perfil" href="/user/perfil">PERFIL</a>
                    <a aria-label="Mis Solicitudes" href="/user/mis-solicitudes">SOLICITUDES</a>
                    <a aria-label="Vacantes" href="/user/">VACANTES</a>
                    <a aria-label="Ayuda" href="/user/ayuda">AYUDA</a>
                </nav>
            </Popup>
        </div>
        

        <img src="/img/logo.png" alt="LOGO AMAC"/>
        {/* Componente NAV-BAR tiene funcionalidad diferente dependiendo de si es mobil o web */}
        <nav className="movil" aria-label="Navegación principal - web">
            <img id="menu-nav" aria-label="menu" src="/icons/menu.svg" onClick={togglePopup}/>
        </nav>
        <nav className="web" aria-label="Navegación principal - web">
            <a aria-label="Inicio" href="/user/">INICIO</a>
            <a aria-label="Perfil" href="/user/perfil">PERFIL</a>
            <a aria-label="Mis Solicitudes" href="/user/mis-solicitudes">SOLICITUDES</a>
            <a aria-label="Vacantes" href="/user/">VACANTES</a>
            <a aria-label="Ayuda" href="/user/ayuda">AYUDA</a>
        </nav>
    </header>
}