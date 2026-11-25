export default function VacanteItem({vacante}) {

    const logoEmpresa = vacante.perfiles.img_url ? <img src={vacante.perfiles.img_url} alt="Logo de empresa"/> : <></>
    
    return <div className="listado-vacante-item">
        <p className="negrita">{vacante.titulo}</p>
        <p>{vacante.perfiles.nombre}</p>
        {logoEmpresa}
        <p className="negrita">en {vacante.ubicacion}</p>
        <a href={"/user/vacante/" + vacante.id} className="btn btn-primario">
            VER
        </a>
    </div>
}