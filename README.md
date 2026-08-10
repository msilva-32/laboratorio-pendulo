# Simulación numérica de modelos lineales y no lineales del péndulo plano

Laboratorio computacional interactivo para comparar seis modelos lineales y no lineales del péndulo plano. El recurso acompaña un artículo destinado a la *Revista Brasileira de Ensino de Física* y limita la representación a la evolución temporal θ(τ) y el retrato de fase (θ, dθ/dτ).

**Autor:** Mario Silva Francia  
**Filiación:** CeRP del Litoral, Uruguay  
**ORCID:** pendiente de incorporar

El navegador ejecuta Python mediante Pyodide. El lector no necesita instalar programas.

## Modelos

1. Péndulo linealizado: `θ″ + θ = 0`.
2. Linealizado con rozamiento viscoso: `θ″ + 2ζθ′ + θ = 0`.
3. Linealizado, amortiguado y con excitación circular: `θ″ + 2ζθ′ + [1 + Γ cos(Ωτ + φ₀)]θ = Γ sen(Ωτ + φ₀)`.
4. Péndulo simple completo: `θ″ + sen(θ) = 0`.
5. Completo con rozamiento cuadrático: `θ″ + κθ′|θ′| + sen(θ) = 0`.
6. Completo, amortiguado y con excitación circular: `θ″ + 2ζθ′ + sen(θ) + Γ sen[θ − (Ωτ + φ₀)] = 0`.

θ representa el desplazamiento angular desde la vertical descendente, τ el tiempo adimensional y `θ′ = dθ/dτ` la velocidad angular adimensional. ζ representa la razón de amortiguamiento, Γ la amplitud adimensional de la excitación, Ω su frecuencia angular adimensional, φ₀ su fase inicial y κ el coeficiente adimensional de rozamiento cuadrático.

## Decisiones sobre los casos predeterminados

- El modelo 3 conserva `ζ = 0,05` y `Γ = 0,10`; usa `Ω = 0,60`, `1,00` y `1,40` para comparar excitaciones por debajo, cerca y por encima de la escala propia.
- El modelo 5 conserva `θ(0) = 2,50` y usa `κ = 0,05`, `0,20` y `0,80`.
- El modelo 6 conserva `ζ = 0,05`, `Ω = 0,90` y usa `Γ = 0,10`, `0,35` y `0,47`. Los casos descartan un transitorio de 200 unidades; una ventana de 100 exige integrar hasta τ = 300.

Estas decisiones conservan los valores de la web de referencia. El modelo 6 muestra la forma coherente entre la ecuación de segundo orden y el sistema integrado: el término con Γ aparece sumado en el miembro izquierdo y restado en la ecuación de `dω/dτ`.

## Método numérico y versiones

- Pyodide 314.0.4, publicado el 4 de agosto de 2026.
- Python 3.14.2.
- NumPy 2.4.3.
- SciPy 1.18.0.
- `scipy.integrate.solve_ivp`, método RK45.
- `rtol = 1 × 10⁻⁹`, `atol = 1 × 10⁻¹¹`.
- 6000 puntos uniformes en la ventana representada.

La aplicación admite ventanas entre 1 y 500 unidades, transitorios entre 0 y 500 y mallas entre 300 y 12 000 puntos. `python/models.py` comprueba la convergencia informada por SciPy, la forma de la solución y la ausencia de valores NaN o infinitos.

## Estructura

```text
index.html
assets/css/styles.css
assets/js/app.js
python/models.py
README.md
GUIA_DE_EDICION.md
CITATION.cff
articulo/README.md
.nojekyll
.github/workflows/pages.yml
```

## Edición del sitio

`GUIA_DE_EDICION.md` identifica cada título, texto, botón, control, función y sección de estilos. `index.html`, `styles.css` y `app.js` incluyen comentarios numerados para facilitar cambios manuales desde el editor de GitHub.

El diseño adopta una estética inspirada en el tema Minimal de GitHub Pages. La aplicación conserva una disposición amplia para representar las dos gráficas.

## Artículo asociado

La carpeta `articulo` reserva la ruta `articulo/articulo-pendulo.pdf`. La web muestra el botón **Artículo en preparación** hasta que el autor incorpore el PDF y active el enlace según las instrucciones de `GUIA_DE_EDICION.md`.

## Uso y prueba local

Un servidor HTTP debe servir el proyecto porque el navegador carga `python/models.py` con `fetch`:

```bash
python -m http.server 8000
```

Después, abrí `http://localhost:8000`. La primera carga descarga Pyodide, NumPy y SciPy.

## Publicación

El flujo de GitHub Actions carga el contenido estático y lo despliega en GitHub Pages después de cada cambio en `main`. También admite ejecución manual. En la configuración del repositorio, Pages debe usar **GitHub Actions** como fuente.

## Limitaciones

El recurso no incluye diagramas de energía, espectros, secciones de Poincaré, exponentes de Lyapunov, bifurcaciones ni animaciones. La identificación visual de una respuesta irregular se limita a la evolución temporal y al retrato de fase. Las simulaciones representan modelos ideales adimensionales y no sustituyen datos experimentales.

## Citación

La forma recomendada se encuentra en `CITATION.cff`. El proyecto declara la filiación institucional y deja preparado el campo para incorporar ORCID. El artículo y el software podrán agregar DOI cuando dispongan de uno.

## Asistencia de inteligencia artificial

El autor utilizó asistencia de inteligencia artificial para apoyar la programación, la documentación y las pruebas. Mario Silva Francia definió el alcance físico, seleccionó los modelos y conserva la responsabilidad sobre la revisión académica del recurso.

## Licencia

El código del laboratorio se distribuye bajo la licencia MIT. Consultá el archivo `LICENSE`.
