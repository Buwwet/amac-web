import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

const AMACContext = createContext(null);
export const useAMACContext = () => useContext(AMACContext);

export function AMACProvider({children}) {
    const {user} = useAuth();

    const [vacantes, setVacantes] = useState([]);

    const userId = user?.id;

    // Recibe todos los vacantes
    const getVacantes = async () => {
        const { data, error } = await supabase.from('vacantes').select(`
            *,
            perfiles (id, nombre, img_url)
        `);
            

        if (error) console.log(error); else {
            setVacantes(data);
            return data;
        }
    }

    const getSpecificVacante = async (id) => {
        // Busqueda lineal why not

        console.log(vacantes)
        const vac = vacantes.find((v) => v.id == id);
        if (vac != undefined) {
            return vac;
        }

        // No existe! Hay que hacer fetch
        // HOY APRENDI QUE - setState no es inmediato.
        const vacs = await getVacantes();  // MEJORA POSIBLE - Un custom query en vez de uno completo.
        if (vacs == null) {
            return;
        }
    
        // Si no lo encontramos esta vez, regresamos null.
        return vacs.find((v) => v.id == id);
    }

    const value = {
        getVacantes,
        getSpecificVacante
    };

    return <AMACContext.Provider value={value}>
        {children}
    </AMACContext.Provider>
}