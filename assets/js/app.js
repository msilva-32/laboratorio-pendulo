"use strict";

/* ========================================================================== 
   INTERFAZ DEL LABORATORIO

   EDICIÓN RÁPIDA
   - models: nombres, ecuaciones, explicaciones, parámetros y casos.
   - commonControls: condiciones iniciales y ventana temporal.
   - renderTabs(): botones para elegir los seis modelos.
   - renderModel(): información del modelo y casos predeterminados.
   - renderControls(): campos numéricos editables.
   - initializePython(): carga Python, NumPy, SciPy y python/models.py.
   - runSimulation(): ejecuta el modelo seleccionado.
   - svgChart() y renderCharts(): construyen las dos gráficas.
   - renderCaption(): escribe el resumen situado bajo las gráficas.

   Consultá GUIA_DE_EDICION.md antes de cambiar identificadores o funciones.
   ========================================================================== */

// EDITAR JS 01: versión de Pyodide y cantidad de valores representados.
const PYODIDE_VERSION = "314.0.4";
const POINTS = 6000;

// EDITAR JS 02: contenido de los seis modelos.
const models = [
  // ================================================================
  // MODELO 1
  // Péndulo simple bajo la aproximación de pequeñas oscilaciones.
  // El modelo reemplaza sen(θ) por θ y conserva una ecuación lineal.
  // ================================================================
  {
    id: "linear",
    short: "Péndulo simple",
    kind: "Modelo 1",

    title: "Péndulo simple en la aproximación de pequeñas oscilaciones",

    equation: "θ″ + θ = 0",

    description:
      "La aproximación sen(θ) ≃ θ reduce la ecuación completa a un modelo lineal. Esta formulación resulta adecuada para pequeñas amplitudes angulares y predice oscilaciones armónicas con período independiente de la amplitud.",

    defaults: {
      theta0: 1,
      omega0: 0,
      window: 100,
      transient: 0,
    },

    parameters: [],

    presets: [
      {
        label: "Pequeña: 0,20 rad",
        values: { theta0: 0.2 },
      },
      {
        label: "Intermedia: 1,00 rad",
        values: { theta0: 1 },
      },
      {
        label: "Grande: 2,50 rad",
        values: { theta0: 2.5 },
      },
    ],
  },

  // ================================================================
  // MODELO 2
  // Péndulo linealizado con amortiguamiento viscoso.
  // El torque disipativo resulta proporcional a la velocidad angular.
  // ================================================================
  {
    id: "viscous",
    short: "Amortiguamiento viscoso",
    kind: "Modelo 2",

    title: "Péndulo simple linealizado con amortiguamiento viscoso",

    equation: "θ″ + 2ζθ′ + θ = 0",

    description:
      "El modelo incorpora un torque disipativo proporcional a la velocidad angular. La razón de amortiguamiento ζ permite analizar los regímenes subamortiguado, crítico y sobreamortiguado bajo las mismas condiciones iniciales.",

    defaults: {
      theta0: 1,
      omega0: 0,
      zeta: 0.2,
      window: 100,
      transient: 0,
    },

    parameters: [
      {
        key: "zeta",
        label: "Razón de amortiguamiento, ζ",
        min: 0,
        max: 3,
        step: 0.01,
        help: "Parámetro adimensional que controla la disipación.",
      },
    ],

    presets: [
      {
        label: "Subamortiguado",
        values: { zeta: 0.2 },
      },
      {
        label: "Amortiguamiento crítico",
        values: { zeta: 1 },
      },
      {
        label: "Sobreamortiguado",
        values: { zeta: 2 },
      },
    ],
  },

  // ================================================================
  // MODELO 3
  // Péndulo linealizado y amortiguado con movimiento circular
  // del punto de suspensión.
  // ================================================================
  {
    id: "linear_forced",
    short: "Forzado y amortiguado",
    kind: "Modelo 3",

    title:
      "Péndulo simple linealizado, amortiguado y con excitación circular del soporte",

    equation:
      "θ″ + 2ζθ′ + [1 + Γ cos(Ωτ + φ₀)]θ = Γ sen(Ωτ + φ₀)",

    description:
      "El movimiento circular del soporte introduce una excitación periódica y una modulación temporal del término restaurador. Los parámetros ζ, Γ, Ω y φ₀ controlan la disipación, la intensidad, la frecuencia y la fase inicial de la excitación.",

    defaults: {
      theta0: 1,
      omega0: 0,
      zeta: 0.05,
      gamma: 0.1,
      drive: 1,
      phase: 0,
      window: 100,
      transient: 0,
    },

    parameters: [
      {
        key: "zeta",
        label: "Razón de amortiguamiento, ζ",
        min: 0,
        max: 2,
        step: 0.01,
        help: "Parámetro adimensional que controla la disipación.",
      },
      {
        key: "gamma",
        label: "Intensidad de la excitación, Γ",
        min: 0,
        max: 2,
        step: 0.01,
        help: "Amplitud adimensional de la excitación.",
      },
      {
        key: "drive",
        label: "Razón de frecuencias, Ω",
        min: 0.05,
        max: 4,
        step: 0.05,
        help: "Frecuencia de excitación respecto de la frecuencia propia.",
      },
      {
        key: "phase",
        label: "Fase inicial, φ₀",
        min: -6.283,
        max: 6.283,
        step: 0.001,
        help: "Fase inicial expresada en radianes.",
      },
    ],

    presets: [
      {
        label: "Baja frecuencia",
        values: { drive: 0.6 },
      },
      {
        label: "Frecuencia propia",
        values: { drive: 1 },
      },
      {
        label: "Alta frecuencia",
        values: { drive: 1.4 },
      },
    ],
  },

  // ================================================================
  // MODELO 4
  // Modelo completo del péndulo simple.
  // Conserva la dependencia no lineal sen(θ).
  // ================================================================
  {
    id: "complete",
    short: "Péndulo real",
    kind: "Modelo 4",

    title: "Modelo completo del péndulo simple",

    equation: "θ″ + sen(θ) = 0",

    description:
      "El modelo conserva la dependencia angular completa mediante sen(θ). Permite estudiar la variación del período con la amplitud y comparar sus predicciones con las obtenidas mediante la aproximación de pequeñas oscilaciones.",

    defaults: {
      theta0: 1,
      omega0: 0,
      window: 100,
      transient: 0,
    },

    parameters: [],

    presets: [
      {
        label: "Pequeña: 0,20 rad",
        values: { theta0: 0.2 },
      },
      {
        label: "Intermedia: 1,00 rad",
        values: { theta0: 1 },
      },
      {
        label: "Grande: 2,50 rad",
        values: { theta0: 2.5 },
      },
    ],
  },

  // ================================================================
  // MODELO 5
  // Péndulo completo con resistencia cuadrática.
  // El torque disipativo depende de θ′|θ′|.
  // ================================================================
  {
    id: "quadratic",
    short: "Resistencia cuadrática",
    kind: "Modelo 5",

    title: "Péndulo simple completo con resistencia cuadrática",

    equation: "θ″ + κθ′|θ′| + sen(θ) = 0",

    description:
      "El modelo incorpora un torque resistivo proporcional a θ′|θ′|. Esta dependencia cuadrática permite representar una disipación dominada por efectos inerciales del fluido y produce un decaimiento no exponencial de la amplitud.",

    defaults: {
      theta0: 2.5,
      omega0: 0,
      kappa: 0.2,
      window: 100,
      transient: 0,
    },

    parameters: [
      {
        key: "kappa",
        label: "Coeficiente de resistencia cuadrática, κ",
        min: 0,
        max: 2,
        step: 0.01,
        help: "Parámetro adimensional que controla la resistencia cuadrática.",
      },
    ],

    presets: [
      {
        label: "Resistencia débil",
        values: { kappa: 0.05 },
      },
      {
        label: "Resistencia intermedia",
        values: { kappa: 0.2 },
      },
      {
        label: "Resistencia intensa",
        values: { kappa: 0.8 },
      },
    ],
  },

  // ================================================================
  // MODELO 6
  // Péndulo completo, amortiguado y con movimiento circular
  // del punto de suspensión.
  // ================================================================
  {
    id: "complete_forced",
    short: "Forzado no lineal",
    kind: "Modelo 6",

    title:
      "Péndulo simple completo, amortiguado y con excitación circular del soporte",

    equation:
      "θ″ + 2ζθ′ + sen(θ) + Γ sen[θ − (Ωτ + φ₀)] = 0",

    description:
      "El modelo combina la dependencia angular completa, el amortiguamiento viscoso y la excitación periódica del soporte. Según los parámetros y las condiciones iniciales, permite explorar respuestas periódicas, movimientos de gran amplitud y regímenes irregulares.",

    defaults: {
      theta0: 1,
      omega0: 0,
      zeta: 0.05,
      gamma: 0.1,
      drive: 0.9,
      phase: 0,
      window: 100,
      transient: 200,
    },

    parameters: [
      {
        key: "zeta",
        label: "Razón de amortiguamiento, ζ",
        min: 0,
        max: 2,
        step: 0.01,
        help: "Parámetro adimensional que controla la disipación.",
      },
      {
        key: "gamma",
        label: "Intensidad de la excitación, Γ",
        min: 0,
        max: 1.5,
        step: 0.01,
        help: "Amplitud adimensional de la excitación.",
      },
      {
        key: "drive",
        label: "Razón de frecuencias, Ω",
        min: 0.05,
        max: 4,
        step: 0.05,
        help: "Frecuencia de excitación respecto de la frecuencia propia.",
      },
      {
        key: "phase",
        label: "Fase inicial, φ₀",
        min: -6.283,
        max: 6.283,
        step: 0.001,
        help: "Fase inicial expresada en radianes.",
      },
    ],

    presets: [
      {
        label: "Respuesta periódica",
        values: { gamma: 0.1 },
      },
      {
        label: "Gran amplitud",
        values: { gamma: 0.35 },
      },
      {
        label: "Régimen irregular",
        values: { gamma: 0.47 },
      },
    ],
  },
];

// EDITAR JS 03: controles comunes a varios modelos.
const commonControls = [
  {
    key: "theta0",
    label: "Ángulo inicial, θ(0)",
    min: -6.283,
    max: 6.283,
    step: 0.001,
    help: "Radianes.",
  },
  {
    key: "omega0",
    label: "Velocidad inicial, dθ/dτ(0)",
    min: -8,
    max: 8,
    step: 0.01,
    help: "Adimensional.",
  },
  {
    key: "window",
    label: "Ventana temporal, Δτ",
    min: 1,
    max: 500,
    step: 1,
    help: "Tiempo adimensional.",
  },
  {
    key: "transient",
    label: "Transitorio descartado",
    min: 0,
    max: 500,
    step: 1,
    help: "Tiempo adimensional; se integra antes de la ventana mostrada.",
  },
];

let selected = 0,
  pyodide = null,
  pythonSource = "",
  lastData = null,
  currentValues = {};
const $ = (id) => document.getElementById(id);

// FUNCIONES DE PRESENTACIÓN Y SELECCIÓN DE MODELOS.
function formatNumber(value) {
  return new Intl.NumberFormat("es-UY", { maximumFractionDigits: 3 }).format(
    value,
  );
}
function activeModel() {
  return models[selected];
}
function renderTabs() {
  $("model-tabs").innerHTML = models
    .map(
      (m, i) =>
        `<button class="model-tab" role="tab" aria-selected="${i === selected}" aria-controls="simulador" tabindex="${i === selected ? 0 : -1}" data-index="${i}"><span>${String(i + 1).padStart(2, "0")} · ${m.kind}</span><strong>${m.short}</strong></button>`,
    )
    .join("");
  $("model-tabs")
    .querySelectorAll("button")
    .forEach((b) =>
      b.addEventListener("click", () => selectModel(Number(b.dataset.index))),
    );
}
function selectModel(index) {
  selected = index;
  currentValues = { ...activeModel().defaults };
  lastData = null;
  renderTabs();
  renderModel();
}
function renderModel() {
  const m = activeModel();
  $("model-class").textContent = `Modelo ${selected + 1} de 6 · ${m.kind}`;
  $("model-title").textContent = m.title;
  $("model-equation").textContent = m.equation;
  $("model-description").textContent = m.description;
  $("presets").innerHTML = m.presets
    .map(
      (p, i) => `<button type="button" data-preset="${i}">${p.label}</button>`,
    )
    .join("");
  $("presets")
    .querySelectorAll("button")
    .forEach((b) =>
      b.addEventListener("click", () => {
        Object.assign(
          currentValues,
          m.presets[Number(b.dataset.preset)].values,
        );
        renderControls();
      }),
    );
  renderControls();
  clearCharts();
}
function renderControls() {
  const m = activeModel();
  const controls = [
    ...commonControls.filter(
      (c) => c.key !== "transient" || m.id.includes("forced"),
    ),
    ...m.parameters,
  ];
  $("parameter-controls").innerHTML = controls
    .map(
      (c) =>
        `<div class="control"><label for="control-${c.key}"><span>${c.label}</span><output id="output-${c.key}">${formatNumber(currentValues[c.key])}</output></label><input id="control-${c.key}" name="${c.key}" type="number" value="${currentValues[c.key]}" min="${c.min}" max="${c.max}" step="${c.step}" required aria-describedby="help-${c.key}"><small id="help-${c.key}">${c.help || "Parámetro adimensional."}</small></div>`,
    )
    .join("");
  $("parameter-controls")
    .querySelectorAll("input")
    .forEach((input) =>
      input.addEventListener("input", () => {
        currentValues[input.name] = Number(input.value);
        $("output-" + input.name).textContent = formatNumber(
          Number(input.value),
        );
      }),
    );
}

// FUNCIONES DE COMUNICACIÓN CON PYTHON.
function requestPayload() {
  const m = activeModel();
  const parameters = {};
  m.parameters.forEach((p) => (parameters[p.key] = currentValues[p.key]));
  return {
    model_id: m.id,
    theta0: currentValues.theta0,
    omega0: currentValues.omega0,
    window: currentValues.window,
    transient: currentValues.transient || 0,
    points: POINTS,
    parameters,
  };
}
async function initializePython() {
  try {
    pyodide = await loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`,
    });
    await pyodide.loadPackage(["numpy", "scipy"]);
    pythonSource = await fetch("python/models.py").then((r) => {
      if (!r.ok) throw new Error("No se pudo cargar python/models.py");
      return r.text();
    });
    await pyodide.runPythonAsync(pythonSource);
    $("python-status").classList.remove("loading");
    $("python-status").classList.add("ready");
    $("python-status").innerHTML =
      '<span class="status-dot" aria-hidden="true"></span>Python, NumPy y SciPy están listos.';
    $("run-button").disabled = false;
  } catch (error) {
    showError(`No se pudo preparar el entorno Python: ${error.message}`);
    $("python-status").textContent =
      "La carga de Python falló. Revisá la conexión y recargá la página.";
  }
}
async function runSimulation(event) {
  event.preventDefault();
  hideError();
  if (!$("parameter-form").reportValidity() || !pyodide) return;
  const button = $("run-button");
  button.disabled = true;
  button.textContent = "Integrando…";
  try {
    const request = JSON.stringify(requestPayload());
    pyodide.globals.set("request_json_js", request);
    const result = await pyodide.runPythonAsync(
      "simulate_json(request_json_js)",
    );
    lastData = JSON.parse(result);
    renderCharts(lastData);
    renderCaption(lastData);
  } catch (error) {
    showError(error.message.replace(/^PythonError:\s*/, ""));
  } finally {
    button.disabled = false;
    button.textContent = "Ejecutar simulación";
  }
}

// FUNCIONES DE MENSAJES Y GRÁFICAS.
function showError(message) {
  const box = $("error-message");
  box.textContent = message;
  box.hidden = false;
}
function hideError() {
  $("error-message").hidden = true;
}
function clearCharts() {
  [$("time-chart"), $("phase-chart")].forEach(
    (c) =>
      (c.innerHTML =
        '<div style="padding:3rem 1rem;text-align:center;color:#6b7280">Ejecutá la simulación para generar la gráfica.</div>'),
  );
  $("simulation-caption").textContent =
    "Seleccioná una configuración y ejecutá la simulación.";
  $("chart-warning").hidden = true;
}
function extent(values, fallback) {
  let min = Math.min(...values),
    max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return fallback;
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const pad = (max - min) * 0.07;
  return [min - pad, max + pad];
}
function ticks(min, max, count = 5, unit = null) {
  if (unit === 1) {
    const a = Math.ceil(min),
      b = Math.floor(max),
      arr = [];
    for (let v = a; v <= b; v++) arr.push(v);
    return arr.length ? arr : [min, max];
  }
  return Array.from(
    { length: count },
    (_, i) => min + ((max - min) * i) / (count - 1),
  );
}
function svgChart(
  container,
  x,
  y,
  { xLabel, yLabel, color, initialY = false, phase = false },
) {
  const W = 640,
    H = 410,
    m = { l: 66, r: 22, t: 20, b: 58 };
  let xr = extent(x, [0, 100]),
    yr = extent(y, [-2, 2]);
  if (initialY && Math.min(...y) >= -2 && Math.max(...y) <= 2) yr = [-2, 2];
  if (phase && Math.min(...x) >= -2 && Math.max(...x) <= 2) xr = [-2, 2];
  const sx = (v) => m.l + ((v - xr[0]) / (xr[1] - xr[0])) * (W - m.l - m.r),
    sy = (v) => H - m.b - ((v - yr[0]) / (yr[1] - yr[0])) * (H - m.t - m.b);
  const maxPoints = 1800,
    step = Math.max(1, Math.ceil(x.length / maxPoints));
  let d = "";
  for (let i = 0; i < x.length; i += step)
    d += `${d ? "L" : "M"}${sx(x[i]).toFixed(2)},${sy(y[i]).toFixed(2)}`;
  const xt = ticks(xr[0], xr[1], 5, phase ? 1 : null),
    yt = ticks(yr[0], yr[1], 5, phase ? 1 : null);
  const grid = [
    ...xt.map(
      (v) =>
        `<line x1="${sx(v)}" y1="${m.t}" x2="${sx(v)}" y2="${H - m.b}"/><text x="${sx(v)}" y="${H - m.b + 24}" text-anchor="middle">${formatNumber(v)}</text>`,
    ),
    ...yt.map(
      (v) =>
        `<line x1="${m.l}" y1="${sy(v)}" x2="${W - m.r}" y2="${sy(v)}"/><text x="${m.l - 10}" y="${sy(v) + 4}" text-anchor="end">${formatNumber(v)}</text>`,
    ),
  ].join("");
  container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><g class="grid">${grid}</g><path d="${d}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/><text class="axis-label" x="${(m.l + W - m.r) / 2}" y="${H - 12}" text-anchor="middle">${xLabel}</text><text class="axis-label" transform="translate(18 ${(m.t + H - m.b) / 2}) rotate(-90)" text-anchor="middle">${yLabel}</text></svg>`;
}
function renderCharts(data) {
  svgChart($("time-chart"), data.tau, data.theta, {
    xLabel: "τ",
    yLabel: "θ(τ)",
    color: "#b51f35",
    initialY: true,
  });
  svgChart($("phase-chart"), data.theta, data.omega, {
    xLabel: "θ",
    yLabel: "dθ/dτ",
    color: "#145da0",
    phase: true,
  });
  const outside = Math.max(...data.theta) > 2 || Math.min(...data.theta) < -2;
  $("chart-warning").hidden = !outside;
  $("chart-warning").textContent = outside
    ? "La trayectoria supera la escala inicial de θ entre −2 y 2; la gráfica amplió el eje para mostrar todos los datos."
    : "";
}
function renderCaption(data) {
  const m = activeModel(),
    parameterText = m.parameters
      .map((p) => `${p.key} = ${formatNumber(currentValues[p.key])}`)
      .join(", ");
  $("simulation-caption").textContent =
    `${m.title}. θ(0) = ${formatNumber(currentValues.theta0)} rad, dθ/dτ(0) = ${formatNumber(currentValues.omega0)}, Δτ = ${formatNumber(currentValues.window)}${currentValues.transient ? `, transitorio descartado = ${formatNumber(currentValues.transient)}` : ""}${parameterText ? `. ${parameterText}` : ""}. RK45, ${data.solver.points} puntos.`;
}

// CONEXIÓN ENTRE LOS BOTONES DEL HTML Y LAS FUNCIONES ANTERIORES.
$("parameter-form").addEventListener("submit", runSimulation);
$("reset-button").addEventListener("click", () => {
  currentValues = { ...activeModel().defaults };
  renderControls();
  clearCharts();
  hideError();
});
$("scale-button").addEventListener("click", () => {
  if (lastData) renderCharts(lastData);
});
renderTabs();
selectModel(0);
initializePython();
