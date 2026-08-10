# Simulación numérica de modelos lineales y no lineales del péndulo plano

Laboratorio computacional interactivo para comparar seis modelos lineales y no lineales del péndulo plano. El recurso acompaña un artículo destinado a la *Revista Brasileira de Ensino de Física* y limita la representación a la evolución temporal θ(τ) y el retrato de fase (θ, dθ/dτ).

**Autor:** Mario Silva Francia  
**Filiación:** CeRP del Litoral, Uruguay  
**ORCID:** pendiente de incorporar

El navegador ejecuta Python mediante Pyodide. El lector no necesita instalar programas.

## Modelos matemáticos

Los seis modelos describen el movimiento de un péndulo plano mediante la coordenada angular θ. Los tres primeros emplean la aproximación para pequeñas oscilaciones; los tres restantes conservan la dependencia angular completa.

1. **Péndulo simple en la aproximación de pequeñas oscilaciones**

   `θ″ + θ = 0`

   La aproximación `sen(θ) ≃ θ` reduce la ecuación completa a un modelo lineal adecuado para pequeñas amplitudes angulares.

2. **Péndulo simple linealizado con amortiguamiento viscoso**

   `θ″ + 2ζθ′ + θ = 0`

   El modelo incorpora un torque disipativo proporcional a la velocidad angular. El parámetro ζ permite estudiar los regímenes subamortiguado, crítico y sobreamortiguado.

3. **Péndulo simple linealizado, amortiguado y con excitación circular del soporte**

   `θ″ + 2ζθ′ + [1 + Γ cos(Ωτ + φ₀)]θ = Γ sen(Ωτ + φ₀)`

   El movimiento circular del soporte introduce una excitación periódica y una modulación temporal del término restaurador.

4. **Modelo completo del péndulo simple**

   `θ″ + sen(θ) = 0`

   El modelo conserva la dependencia angular completa y permite analizar la variación del período con la amplitud.

5. **Péndulo simple completo con resistencia cuadrática**

   `θ″ + κθ′|θ′| + sen(θ) = 0`

   El torque resistivo resulta proporcional a `θ′|θ′|`. Esta formulación representa una disipación con dependencia cuadrática respecto de la rapidez angular.

6. **Péndulo simple completo, amortiguado y con excitación circular del soporte**

   `θ″ + 2ζθ′ + sen(θ) + Γ sen[θ − (Ωτ + φ₀)] = 0`

   El modelo combina la dependencia angular completa, el amortiguamiento viscoso y la excitación periódica del soporte. Según los parámetros y las condiciones iniciales, puede producir respuestas periódicas, movimientos de gran amplitud y regímenes irregulares.

En todas las ecuaciones, las primas indican derivadas respecto del tiempo adimensional τ. La variable θ representa el desplazamiento angular medido desde la vertical descendente, `θ′ = dθ/dτ` corresponde a la velocidad angular adimensional y `θ″ = d²θ/dτ²` a la aceleración angular adimensional.

El parámetro ζ representa la razón de amortiguamiento; Γ, la intensidad adimensional de la excitación; Ω, la razón entre la frecuencia de excitación y la frecuencia propia; φ₀, la fase inicial del movimiento del soporte; y κ, el coeficiente adimensional de resistencia cuadrática.

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
