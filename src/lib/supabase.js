// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

// =========================================================
// REGISTRO, INICIO Y CIERRE DE SESIÓN
// Las tres regresan { data, error } tal cual las da Supabase,
// para que cada página decida qué mensaje mostrar.
// =========================================================

// RF-011 / RF-015. "data" viaja en options.data y el trigger
// crear_perfil() lo guarda en la tabla perfiles:
// rol, nombre, telefono, edad, colonia, experiencia, giro
export async function crear_perfil(email, password, data) {
    return await supabase.auth.signUp({
        email,
        password,
        options: { data }
    })
}

// RF-008
export async function iniciar_session(email, password) {
    return await supabase.auth.signInWithPassword({ email, password })
}

// RF-009
export async function cerrar_sesion() {
    return await supabase.auth.signOut()
}
