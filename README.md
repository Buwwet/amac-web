# Importante

Link a Vercel: https://amac-web-six.vercel.app/

# Integrantes y aportaciones
**Valeria Edith Rodarte Martínez**

@val

**Ricardo Miguel Villarreal De Ochoa**

Yo aporte los componentes globales del `Header`, `Navbar`, `Footer` y `HelpButton` que se usan en la mayoría de páginas,
Además de ser responsable de las páginas `index.html`, `vacante.html`, `empresa-vacantes-html`, `extra/mi-perfil.html`, `404.html` y los componentes que requirieron.

También dí de alta el Vercel (https://amac-web-six.vercel.app/).


**Jorge Eduardo Furber Rodríguez** 

Yo hice todo lo relacionado a las interfaces que ven las empresas, siendo `Mi-perfil-empresa`, `panel-vacante-empresa` y `solicitudes-recibidas-empresa`. Por esto mismo, los diseños son un poco distintos (aunque se mantiene la paleta de colores y la base de la página como tal), ya que el usuario-empresa no necesita las mismas configuraciones que el usuario-empleado. Estas páginas permiten a los reclutadores de empresas gestionar sus vacantes, revisar las métricas y dar seguimiento a las solicitudes de candidatos.

**Manuel Pineda Arroyo**

Yo aporté los componentes de formularios `Tarjeta`, `GrupoCampos`, `CampoFormulario`, `Opcion`, `MensajeError` y `Nota`, que se usan en las páginas de acceso y registro,
además de las reglas de accesibilidad globales de `base.css` (foco visible y enlace "Saltar al contenido").
También soy responsable de las páginas `login.html` y `registro-candidato.html` y de los componentes que requirieron.


# Estilos

Para los estilos tomamos en base el kit de estilo que proporciono AMAC y los requerimientos proporcionados por el profesor. Como hemos mencionado antes, decidimos en aumentar el tamaño de texto regular y en botones para ser más accesibles. Lo bueno del CSS es que podemos cambiar esto en un instante.

**Estilos actuales:**

```css
/* css/variables.css */

/* Google fonts */
@import url('https://fonts.googleapis.com/css2?family=Baskervville:ital,wght@0,400..700;1,400..700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');
:root {
  /* Colores (copiar los hex de los estilos de Figma) */
  --color-primario: #202945;
  --color-texto: #111827;
  --color-fondo: #ffffff;
  
  --color-acento: #FF815C;
  --color-complemento: #A8A8A8;
  
  --color-exito: #15803d;
  --color-error: #b91c1c;
  
  --color-aceptado: #91d38e;
  --color-pendiente: #d4d184;
  --color-rechazado: #da7676;
  
  --color-btn-inhabilitado: #dbdbdb;
  --color-texto-inhabilitado: #818181;
  
  /* Tipografía */
  --fuente-base: "Work Sans", system-ui, sans-serif;
  --fuente-header: "Baskervville", serif;
  --texto-base: 2.15rem; /* 18 px */
  --texto-h2: 1.5rem;
  --texto-h1: 2rem;
  /* Espaciados y bordes */
  --espacio-s: 0.5rem;
  --espacio-m: 1rem;
  --espacio-l: 2rem;
  --radio: 0.75rem;
  
  /*login y registro */
  --color-error-fondo: #fdecea;
  --color-azul-suave: #cae4ef; /* manual de marca */
  --color-acento-oscuro: #f2663c; /* hover de botones */
  --altura-control: 3.5rem; /* campos y botones cómodos de tocar */

}
```
# Componentes identificados

* `Header`
* `NavBar`
* `Searchbar`
* `Popup`
* `ListadoVacanteItem`
* `BottonAyuda`
* `Footer`
* `DetalleVacante`


# Capturas de `index.html`

Imagen del desktop

<img width="1920" height="1080" alt="index_desktop" src="https://github.com/user-attachments/assets/39a5a310-bea2-4837-bf12-d65b8c71849c" />


Imagen del móvil

<img width="380" height="1928" alt="index_movil" src="https://github.com/user-attachments/assets/210b4d2c-f36a-414c-a200-a370383bc057" />


# Puntuación de Lighthouse

<img width="403" height="498" alt="Screenshot 2026-11-09 213847" src="https://github.com/user-attachments/assets/d0536784-a917-4635-837a-62e3973a0796" />


# Recursos usados
## Atribuciones de fotografías
[Foto supermercado] - Nathália Rosa en Unspash https://unsplash.com/photos/grocery-store-aisle-with-stocked-shelves-rWMIbqmOxrY

[Foto persona] - engin akyurt en Unsplash https://unsplash.com/photos/man-in-blue-button-up-shirt-GQeHbaf05Z0
