// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
import.meta.env.VITE_SUPABASE_URL,
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY


)

// FUNCIONES DE SIGNUP Y LOGIN
export async function crear_perfil(email, password, data) {
    // Data son estos datos:
    // rol, nombre, telefono, edad, colonia, experiencia

    const {_, error} = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: data
        }
    });

}

export async function iniciar_session(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email: email, password: password});
}
    

