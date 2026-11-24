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
            
        ;

        if (error) console.log(error); else {
            setVacantes(data);
            console.log(data)
            return data;
        }
    }

    const value = {
        getVacantes,
    };

    useEffect(() => {

    }, [])

    return <AMACContext.Provider value={value}>
        {children}
    </AMACContext.Provider>
}