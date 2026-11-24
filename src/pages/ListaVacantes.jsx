import { useEffect, useState } from "react";
import VacanteItem from "../components/VacanteItem";
import { useAMACContext } from "../context/AMACContext";

export default function ListaVacantes() {
    // TODO filtros.
    const AMAC = useAMACContext();

    const [vacantes, setVacantes] = useState([]);

    // Cargamos todos los vacantes
    useEffect(() => {
        const getVacantes = async () => {
            const nuevos = await AMAC.getVacantes();
            if (nuevos != null) {
                setVacantes(nuevos)
            }
        }
        getVacantes();
    }, []);
    

    return <>
        <h1>Listado de vacantes</h1>

        <div className="search-bar">
            <img aria-label="busqueda" src="/icons/search.svg"/>
            <input type="text" placeholder="Ingrese su busqueda..."/>
            <img aria-label="ajuste" src="/icons/setting.svg"/>
        </div>

        <div className="listado-vacantes-items">
            {vacantes.map((vacante) => {
                return <VacanteItem key={vacante.id} vacante={vacante}/>
            })}
        </div>
    </>
}