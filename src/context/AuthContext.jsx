import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, cerrar_sesion } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [sesion, setSesion] = useState(undefined) // undefined = todavía no sabemos
    const [perfil, setPerfil] = useState(null)
    // Id del usuario cuyo perfil ya terminamos de buscar
    const [perfilCargadoDe, setPerfilCargadoDe] = useState(null)

    // 1) Escuchar la sesión: al abrir la página, al iniciar y al cerrar sesión
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => setSesion(data.session))
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
            setSesion(nuevaSesion)
        })
        return () => subscription.unsubscribe()
    }, [])

    // 2) Cada vez que cambia el usuario, cargar su perfil (rol, nombre, aprobado...)
    const sesionLista = sesion !== undefined
    const usuarioId = sesion?.user.id ?? null
    useEffect(() => {
        if (!usuarioId) return
        let vigente = true // si cambia el usuario antes de que llegue la respuesta, la ignoramos
        supabase.from('perfiles').select('*').eq('id', usuarioId).maybeSingle()
            .then(({ data }) => {
                if (!vigente) return
                setPerfil(data)
                setPerfilCargadoDe(usuarioId)
            })
        return () => { vigente = false }
    }, [usuarioId])

    // "cargando" se calcula en cada render (no con un useEffect) para que nunca haya
    // un instante en que ya hay sesión pero todavía no se sabe el perfil y se vea como
    // "sin perfil". Eso hacía que RutaProtegida o el login redirigieran antes de tiempo.
    const cargando = !sesionLista || (usuarioId !== null && perfilCargadoDe !== usuarioId)
    const perfilActual = usuarioId && perfilCargadoDe === usuarioId ? perfil : null

    // RF-009: cerrar sesión. onAuthStateChange pone la sesión en null
    // y el perfil deja de mostrarse: el navbar se actualiza solo.
    const cerrarSesion = async () => {
        const { error } = await cerrar_sesion()
        // Si falló la red, limpiamos la sesión local de todos modos para no dejarla "a medias"
        if (error) await supabase.auth.signOut({ scope: 'local' })
    }

    return (
        <AuthContext.Provider value={{ sesion, perfil: perfilActual, cargando, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)