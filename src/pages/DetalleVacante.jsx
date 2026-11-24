import { useState } from "react";

export default function DetalleVacante() {
    // TODO - usar datos del contexto de supabase

    // TODO: tomar el vacante_id de la url y usarlo para obtener los datos de la vacante.
    const [vacante, setVacante] = useState(
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
        );
    
    return <>
    <h1>Detalle de vacante</h1>
    <p><span className="negrita">Puesto de trabajo en EMPRESA TODO</span></p>
    <div className="detalle-vacante">
        <div className="detalle-vacante-datos">
            <img alt="imagen-vacante" src="img/supermercado.jpg"/>
            <ul>
                <li>
                    <p><span className="negrita">Ubicación: </span>Rio Mississippi 131 B, Del Valle, 66220 San Pedro Garza García, N.L.</p>
                </li>
                <li>
                    <p><span className="negrita">Descripción: </span>Supervisar compras y cubrir ausencias de empleados.</p>
                </li>
                <li>
                    <p><span className="negrita">Horario: </span>Lunes a Jueves de 8:00am a 3:00pm.</p>
                </li>
                <li>
                    <p><span className="negrita">Salario: </span>8 mil pesos al mes.</p>
                </li>
            </ul>
        </div>
        {/* TODO POPOUP cmp */}
        <a aria-label="postularse" className="btn btn-primario" href="mis-solicitudes.html">
            POSTULARME
        </a>
    </div>
    </>
}