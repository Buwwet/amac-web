import HelpButton from "./HelpButton";

export default function Footer() {

    return <footer className="site-footer"> 

        <HelpButton/>           
        <div className="footer-cols">
            <div className="footer-col">
                <h2>Contacto</h2>
                <a href="#">correo@amac.com</a>
                <a href="#">+52 81 0000 0000</a>
                <a href="#">Monterrey, N.L.</a>
            </div>
        </div>
        <p className="footer-copy">&copy; 2026 AMAC. Todos los derechos reservados.</p>
    </footer>
}