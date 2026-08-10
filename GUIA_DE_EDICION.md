# Guía de edición del laboratorio

Esta guía permite modificar textos, botones, estilos, modelos y datos académicos sin recorrer todo el código. La web funciona con cuatro archivos principales:

| Archivo | Contenido |
| --- | --- |
| `index.html` | Textos fijos, estructura, botones principales, autoría y publicación |
| `assets/css/styles.css` | Colores, tamaños, espacios, bordes y adaptación a celulares |
| `assets/js/app.js` | Modelos, parámetros, casos predeterminados, textos dinámicos y gráficas |
| `python/models.py` | Ecuaciones diferenciales e integración numérica |

## 1. Edición de `index.html`

El archivo contiene comentarios con la palabra `EDITAR` y un número. Podés usar `Ctrl + F` para buscar cada marca.

| Marca | Elemento visible |
| --- | --- |
| `EDITAR 01` | Descripción para buscadores |
| `EDITAR 02` | Título de la pestaña del navegador |
| `EDITAR 03` | Nombre del sitio y menú superior |
| `EDITAR 04` | Título principal, subtítulo y presentación |
| `EDITAR 05` | Título e introducción de los modelos |
| `EDITAR 06` | Botones `Ejecutar simulación` y `Restablecer parámetros` |
| `EDITAR 07` | Botón `Restablecer escalas` |
| `EDITAR 08` | Nombres de las dos gráficas |
| `EDITAR 09` | Método numérico y procedimiento de exploración |
| `EDITAR 10` | Autor, filiación, ORCID y descarga del artículo |
| `EDITAR 11` | Pie de página |

### Identificadores que no conviene cambiar

`app.js` busca estos identificadores para actualizar la web:

```text
python-status
model-tabs
model-class
model-title
model-equation
model-description
presets
parameter-form
parameter-controls
run-button
reset-button
error-message
scale-button
time-chart
phase-chart
chart-warning
simulation-caption
```

Podés cambiar el texto contenido en esos elementos. Si cambiás un atributo `id`, también tendrás que cambiar todas sus referencias en `app.js`.

## 2. Autor, filiación y ORCID

Los datos actuales aparecen en la sección `EDITAR 10`:

```html
<dd>Mario Silva Francia</dd>
<dd>CeRP del Litoral, Uruguay</dd>
<dd id="author-orcid">Agregar identificador ORCID</dd>
```

Para incorporar el ORCID, reemplazá el último elemento por un enlace como este:

```html
<dd id="author-orcid">
  <a href="https://orcid.org/0000-0000-0000-0000">
    0000-0000-0000-0000
  </a>
</dd>
```

Sustituí los ceros por tu identificador. Repetí el dato en `CITATION.cff` siguiendo las instrucciones incluidas en ese archivo.

## 3. Descarga del artículo

La web ya contiene un botón desactivado con el texto `Artículo en preparación`.

Cuando dispongas del PDF:

1. Subí el archivo con la ruta `articulo/articulo-pendulo.pdf`.
2. Buscá `article-download` en `index.html`.
3. Reemplazá el enlace por este bloque:

```html
<a
  id="article-download"
  class="button-link"
  href="articulo/articulo-pendulo.pdf"
  download
>
  Descargar artículo
</a>
```

El atributo `download` solicita al navegador que descargue el PDF. Algunos navegadores pueden abrirlo en una pestaña según su configuración.

## 4. Edición de `styles.css`

El archivo contiene doce secciones numeradas.

| Sección | Elementos que controla |
| --- | --- |
| `01` | Colores y anchos generales |
| `02` | Fuente, tamaño del texto y enlaces |
| `03` | Encabezado y navegación |
| `04` | Portada, título y subtítulo |
| `05` | Títulos y rótulos de sección |
| `06` | Botones de selección de modelos |
| `07` | Panel de controles y campos numéricos |
| `08` | Botones del simulador |
| `09` | Gráficas, leyendas y resultados |
| `10` | Método, publicación, autoría y pie |
| `11` | Foco del teclado y enlace de salto |
| `12` | Diseño para tabletas y celulares |

### Colores principales

Los colores se encuentran al comienzo del archivo:

```css
:root {
  --text: #222222;
  --muted: #727272;
  --background: #ffffff;
  --soft-background: #f7f7f7;
  --link: #267cb9;
}
```

Una modificación de estas variables afecta todo el sitio.

### Tamaños de texto

Buscá estos selectores:

| Selector | Texto |
| --- | --- |
| `body` | Texto común |
| `.hero h1` | Título principal |
| `.lead` | Subtítulo |
| `.section-heading h2` | Títulos de sección |
| `.controls h2` | Nombre del modelo |
| `.model-tab` | Botones de modelos |
| `button` | Botones generales |

Después de modificar `styles.css`, aumentá el número de versión en `index.html`:

```html
<link rel="stylesheet" href="assets/css/styles.css?v=0.2.1">
```

Ese cambio evita que el navegador conserve una copia anterior del diseño.

## 5. Modelos y textos dinámicos de `app.js`

La constante `models` contiene los seis modelos. Cada modelo usa la misma estructura:

```javascript
{
  id: "linear",
  short: "Linealizado",
  kind: "Lineal",
  title: "Péndulo linealizado",
  equation: "θ″ + θ = 0",
  description: "Texto explicativo",
  defaults: {},
  parameters: [],
  presets: []
}
```

| Propiedad | Elemento visible o función |
| --- | --- |
| `short` | Nombre breve del botón del modelo |
| `kind` | Clasificación lineal o no lineal |
| `title` | Título del panel de controles |
| `equation` | Ecuación mostrada |
| `description` | Explicación del modelo |
| `defaults` | Valores iniciales |
| `parameters` | Campos numéricos específicos |
| `presets` | Botones de casos predeterminados |

### Controles comunes

`commonControls` define:

- Ángulo inicial `θ(0)`.
- Velocidad inicial `dθ/dτ(0)`.
- Ventana temporal `Δτ`.
- Transitorio descartado.

Cada control puede incluir `min`, `max`, `step` y `help`.

## 6. Funciones de `app.js`

| Función | Tarea |
| --- | --- |
| `formatNumber()` | Aplica el formato numérico de Uruguay |
| `activeModel()` | Devuelve el modelo seleccionado |
| `renderTabs()` | Construye los seis botones de modelos |
| `selectModel()` | Cambia el modelo activo |
| `renderModel()` | Muestra título, ecuación, descripción y casos |
| `renderControls()` | Construye los campos numéricos |
| `requestPayload()` | Prepara los datos enviados a Python |
| `initializePython()` | Carga Pyodide, NumPy, SciPy y `models.py` |
| `runSimulation()` | Ejecuta la integración y recibe los resultados |
| `showError()` | Muestra un mensaje de error |
| `hideError()` | Oculta el mensaje de error |
| `clearCharts()` | Limpia las gráficas al cambiar de modelo |
| `extent()` | Calcula los límites de cada eje |
| `ticks()` | Calcula las marcas numéricas de los ejes |
| `svgChart()` | Construye una gráfica en formato SVG |
| `renderCharts()` | Genera la evolución temporal y el retrato de fase |
| `renderCaption()` | Escribe el resumen situado bajo las gráficas |

## 7. Botones de la web

| Botón | Archivo de texto | Función asociada |
| --- | --- | --- |
| Seis modelos | `app.js`, propiedad `short` | `selectModel()` |
| Casos predeterminados | `app.js`, propiedad `presets` | `renderModel()` |
| Ejecutar simulación | `index.html` | `runSimulation()` |
| Restablecer parámetros | `index.html` | Evento al final de `app.js` |
| Restablecer escalas | `index.html` | `renderCharts()` |
| Artículo en preparación | `index.html` | Sin acción hasta incorporar el PDF |

## 8. Ecuaciones numéricas

`python/models.py` contiene las ecuaciones que integra SciPy. Modificá ese archivo cuando necesites cambiar el modelo matemático. Un cambio de título o explicación se realiza en `app.js`; un cambio de ecuación numérica requiere revisar `python/models.py` y `app.js`.

## 9. Datos de citación

`CITATION.cff` contiene el nombre del recurso, autor, afiliación, versión, licencia y enlaces. GitHub usa este archivo para ofrecer la opción **Cite this repository**.

## 10. Publicación de cambios

Cada cambio incorporado a la rama `main` activa el flujo de GitHub Pages. Esperá a que la acción **Publicar en GitHub Pages** termine antes de revisar la web.
