import { useEffect, useState } from "react";
import { useAMACContext } from "../context/AMACContext";
import PopupGenerico from "../components/PopupGenerico";



export default function DetalleVacante() {
    const {getSpecificVacante} = useAMACContext();
    

    // TODO: tomar el vacante_id de la url y usarlo para obtener los datos de la vacante.
    const [vacante, setVacante] = useState();
    const [cargando, setCargando] = useState(true);

    const [popup, setPopup] = useState();

    // Conseguir el ID
    const path = window.location.pathname;
    const id = parseInt(path.substring(path.lastIndexOf("/") + 1));

    useEffect(() => {
        const a = async () => {
            console.log(id)
            setVacante(await getSpecificVacante(id));
            if (vacante != undefined) {
                setCargando(false);
            }

            console.log(vacante)
        }
        a();
    }, []);


    const closePopup = () => {
        setPopup(null);
    }

    const openSecondPopup = () => {
        console.log("TODO -> postular via supabase!!")
        setPopup(
            <PopupGenerico 
                title={"Postulación exitosa"}
                body={"Se ha enviado su solicitud a la empresa. Este pendiente a su respuesta. ¿Desea ir a ver el estatus de sus solicitudes?"}
                primaryContent={"Sí, ver estatus"}
                secondaryContent={"No, quedarme aqui"}
                closePopup={closePopup}
                onPrimaryClick={() => {
                    console.log("TODO -> mandar a postulados ")
                }}
                onSecondaryClick={closePopup}
                >

            </PopupGenerico>
        );
    }


    const openFirstPopup = () => {
        setPopup(
            <PopupGenerico 
                title={"Confirmación"}
                body={"Vas a mandar una solicitud para postularte al puesto PUESTO de la empresa EMPRESA ubicada en LUGAR. ¿Esta seguro?"}
                primaryContent={"Sí, postulame"}
                secondaryContent={"No, regresar"}
                closePopup={closePopup}
                onPrimaryClick={openSecondPopup}
                onSecondaryClick={closePopup}
                >

            </PopupGenerico>
        );
    }

    
    return <>

    {popup}
    {(cargando && vacante == null) ? <div> Cargando ... </div> :
    <>
    <h1>Detalle de vacante</h1>
    <p><span className="negrita">{vacante.titulo} en {vacante.ubicacion}</span></p>
    <p><span>{vacante.perfiles.nombre} - {vacante.perfiles.img_url ? <img className="logo-empresa" alt="logo-empresa" src={vacante.perfiles.img_url}></img> : <></>}</span></p>
    <div className="detalle-vacante">
        <div className="detalle-vacante-datos">
            <img alt="imagen-vacante" src={vacante.img_url}/>
            <ul>
                <li>
                    <p><span className="negrita">Requisitos: </span>{vacante.requisitos}</p>
                </li>
                <li>
                    <p><span className="negrita">Ubicación: </span>{vacante.ubicacion}</p>
                </li>
                <li>
                    <p><span className="negrita">Categoria: </span>{vacante.categoria}</p>
                </li>
                <li>
                    <p><span className="negrita">Descripción: </span>{vacante.descripcion}</p>
                </li>
                <li>
                    <p><span className="negrita">Horario: </span>{vacante.horario}</p>
                </li>
                <li>
                    <p><span className="negrita">Salario: </span>{vacante.sueldo} al mes</p>
                </li>
                {vacante.telefono_contacto ? <li>
                    <p><span className="negrita">Telefono: </span>{vacante.telefono_contacto}</p>
                </li> : <></>}
            </ul>
        </div>
        <a aria-label="postularse" className="btn btn-primario" onClick={openFirstPopup}>
            POSTULARME
        </a>
    </div>
    </>
    }
    </>
}