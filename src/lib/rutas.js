// src/lib/rutas.js
// Rutas de la app en un solo lugar. Todo vive bajo /user (ver main.jsx).
// Si cambian una ruta de las páginas de empresa o candidato, cámbienla aquí
// y el navbar, el login y RutaProtegida se actualizan solos.

export const RUTAS = {
    inicio: '/user/',
    login: '/user/login',
    registroCandidato: '/user/registro',
    registroEmpresa: '/user/registro-empresa',
    ayuda: '/user/ayuda',

    // Candidato
    perfilCandidato: '/user/perfil',
    misSolicitudes: '/user/mis-solicitudes',

    // Empresa (páginas aún por pasar a React)
    empresaVacantes: '/user/empresa/vacantes',
    empresaSolicitudes: '/user/empresa/solicitudes',
    perfilEmpresa: '/user/empresa/perfil',
}

// RF-008: después de iniciar sesión, cada rol va a su página principal.
// TODO: cuando exista la página del panel de empresa en React,
// cambiar RUTAS.inicio por RUTAS.empresaVacantes.
export function rutaInicioPorRol(rol) {
    if (rol === 'empresa') return RUTAS.inicio
    return RUTAS.inicio
}
