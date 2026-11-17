export default function VacanteItem(data) {

    return <div className="listado-vacante-item">
        <p className="negrita">Nombre del puesto</p>
        <p>Nombre de la Empresa</p>
        <p className="negrita">en LINK UBICACION</p>
        <a href="vacante.html" className="btn btn-primario">
            VER
        </a>
    </div>
}