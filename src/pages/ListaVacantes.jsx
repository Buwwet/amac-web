import { useState } from "react";
import VacanteItem from "../components/VacanteItem";

export default function ListaVacantes() {
    // TODO - usar datos del contexto de supabase
    // TODO filtros.

    // Vacante temporal
    const [vacantes, setVacantes] = useState([
        {
            id: 1,
            empresa_id: 1,
            titulo: "Cajero",
            sueldo: 22000,
            ubicacion: "Guadalajara, Jalisco",
            horario: "Matutino",
            categoria: "Cajero",
            descripcion: "dawd nawiudb awuibd awjdb wad .",
            requisitos: "daw dbwajd kjawd .",
            prestaciones: "Seguro médico, vales de despensa, horario flexible.",
            telefono_contacto: "5551234567",
            estado: "activa",
            creada_en: Date.now()
        },
    ]);
    

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