// Componentes de formulario (login y registros).
// Usan las mismas clases de componentes.css de la Entrega 2:
// tarjeta, grupo, campo-formulario, opcion, mensaje-error, nota.

// Tarjeta con borde que envuelve el formulario
export function Tarjeta({ children, ...props }) {
    return <form className="tarjeta" noValidate {...props}>{children}</form>
}

// fieldset + legend
export function GrupoCampos({ titulo, interno = false, children }) {
    return <fieldset className={interno ? 'grupo grupo--interno' : 'grupo'}>
        <legend className="grupo__titulo">{titulo}</legend>
        {children}
    </fieldset>
}

// Etiqueta visible + input/select/textarea + ayuda + error del campo.
// "como" decide qué etiqueta se dibuja: 'input' (default), 'select' o 'textarea'.
// Las demás props (type, value, onChange, autoComplete...) pasan directo al control.
export function CampoFormulario({
    id, etiqueta, error, ayuda, completo = false, como = 'input', opciones = [], ...props
}) {
    const idAyuda = ayuda ? `${id}-ayuda` : undefined
    const idError = error ? `${id}-error` : undefined
    const describedBy = [idAyuda, idError].filter(Boolean).join(' ') || undefined

    const clases = ['campo-formulario']
    if (completo) clases.push('campo--completo')
    if (error) clases.push('campo-formulario--error')

    const comunes = {
        id,
        name: id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        ...props,
    }

    let control
    if (como === 'select') {
        control = <select {...comunes}>
            <option value="" disabled>Seleccionar</option>
            {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
    } else if (como === 'textarea') {
        control = <textarea rows={4} {...comunes} />
    } else {
        control = <input {...comunes} />
    }

    return <div className={clases.join(' ')}>
        <label htmlFor={id}>{etiqueta}</label>
        {control}
        {ayuda && <p className="campo-formulario__ayuda" id={idAyuda}>{ayuda}</p>}
        {error && <p className="campo-formulario__error" id={idError}>{error}</p>}
    </div>
}

// Checkbox o radio grande con su etiqueta. "etiqueta" puede llevar enlaces.
export function Opcion({ id, etiqueta, error, type = 'checkbox', ...props }) {
    const idError = error ? `${id}-error` : undefined
    return <>
        <div className="opcion">
            <input
                type={type}
                id={id}
                name={props.name ?? id}
                aria-invalid={error ? true : undefined}
                aria-describedby={idError}
                {...props}
            />
            <label htmlFor={id}>{etiqueta}</label>
        </div>
        {error && <p className="campo-formulario__error" id={idError}>{error}</p>}
    </>
}

// Mensaje general de error (arriba del formulario). role="alert" lo lee el lector de pantalla.
export function MensajeError({ children }) {
    if (!children) return null
    return <p className="mensaje-error" role="alert">{children}</p>
}

// Recuadro azul de aviso
export function Nota({ children, ...props }) {
    return <p className="nota" {...props}>{children}</p>
}