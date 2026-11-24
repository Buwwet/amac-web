export default function VacanteItem({vacante}) {

    // TODO - usar contexto de supabase para obtener datos de la empresa.

    return <div className="listado-vacante-item">
        <p className="negrita">{vacante.titulo}</p>
        <p>Nombre de la Empresa TODO</p>
        <p className="negrita">en {vacante.ubicacion}</p>
        <a href={"/user/vacante/" + vacante.id} className="btn btn-primario">
            VER
        </a>
    </div>
}