// src/lib/validaciones.js
// Validaciones de los formularios, con mensajes en lenguaje sencillo.
// Cada función regresa el mensaje de error, o '' si el valor está bien.

export const MIN_CONTRASENA = 8

export function validarObligatorio(valor, mensaje = 'Este campo es obligatorio.') {
    return String(valor ?? '').trim() === '' ? mensaje : ''
}

export function validarCorreo(valor) {
    const limpio = String(valor ?? '').trim()
    if (!limpio) return 'Escribe tu correo electrónico.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return 'Revisa tu correo. Ejemplo: nombre@correo.com'
    return ''
}

// Celular o teléfono de 10 dígitos. Se aceptan espacios y guiones al escribir.
export function validarTelefono(valor, obligatorio = false) {
    const digitos = String(valor ?? '').replace(/\D/g, '')
    if (!digitos) return obligatorio ? 'Escribe un teléfono de 10 dígitos.' : ''
    if (digitos.length !== 10) return 'El teléfono debe tener 10 dígitos.'
    return ''
}

export function limpiarTelefono(valor) {
    return String(valor ?? '').replace(/\D/g, '')
}

export function validarEdad(valor) {
    if (String(valor ?? '').trim() === '') return 'Escribe tu edad.'
    const n = Number(valor)
    if (!Number.isInteger(n) || n < 18 || n > 120) return 'Escribe una edad entre 18 y 120 años.'
    return ''
}

export function validarContrasena(valor) {
    if (!valor) return 'Escribe una contraseña.'
    if (valor.length < MIN_CONTRASENA) return `La contraseña debe tener al menos ${MIN_CONTRASENA} caracteres.`
    return ''
}

export function validarConfirmacion(contrasena, confirmacion) {
    if (!confirmacion) return 'Vuelve a escribir tu contraseña.'
    if (contrasena !== confirmacion) return 'Las contraseñas no coinciden.'
    return ''
}

// Quita los errores vacíos: { correo: '', edad: 'Escribe...' } -> { edad: 'Escribe...' }
export function soloErrores(errores) {
    return Object.fromEntries(Object.entries(errores).filter(([, msg]) => msg))
}

// Pone el foco en el primer campo con error, para que quien navega
// con teclado o lector de pantalla llegue directo al problema.
export function enfocarPrimerError(errores, orden) {
    const primero = orden.find((id) => errores[id])
    if (primero) document.getElementById(primero)?.focus()
}

// Traduce los errores de Supabase Auth del registro a mensajes claros.
export function mensajeErrorRegistro(error) {
    const codigo = error?.code
    const texto = (error?.message ?? '').toLowerCase()
    if (codigo === 'user_already_exists' || codigo === 'email_exists' || texto.includes('already registered')) {
        return 'Ese correo ya está registrado. Usa otro o inicia sesión.'
    }
    if (codigo === 'weak_password') {
        return `La contraseña es muy débil. Usa al menos ${MIN_CONTRASENA} caracteres.`
    }
    if (codigo === 'email_address_invalid') {
        return 'Ese correo no es válido. Revisa que esté bien escrito.'
    }
    if (codigo === 'over_email_send_rate_limit' || codigo === 'over_request_rate_limit') {
        return 'Se hicieron muchos intentos seguidos. Espera unos minutos e inténtalo de nuevo.'
    }
    return 'No pudimos crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.'
}
