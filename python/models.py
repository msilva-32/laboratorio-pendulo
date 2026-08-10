"""Modelos adimensionales del laboratorio virtual del péndulo."""

import json
import math

import numpy as np
from scipy.integrate import solve_ivp


MODEL_IDS = {"linear", "viscous", "linear_forced", "complete", "quadratic", "complete_forced"}


def _rhs(model_id, parameters):
    zeta = float(parameters.get("zeta", 0.0))
    gamma = float(parameters.get("gamma", 0.0))
    drive = float(parameters.get("drive", 1.0))
    phase = float(parameters.get("phase", 0.0))
    kappa = float(parameters.get("kappa", 0.0))

    def system(tau, state):
        theta, omega = state
        forcing_phase = drive * tau + phase
        if model_id == "linear":
            acceleration = -theta
        elif model_id == "viscous":
            acceleration = -2.0 * zeta * omega - theta
        elif model_id == "linear_forced":
            acceleration = (
                -2.0 * zeta * omega
                - (1.0 + gamma * math.cos(forcing_phase)) * theta
                + gamma * math.sin(forcing_phase)
            )
        elif model_id == "complete":
            acceleration = -math.sin(theta)
        elif model_id == "quadratic":
            acceleration = -kappa * omega * abs(omega) - math.sin(theta)
        elif model_id == "complete_forced":
            acceleration = (
                -2.0 * zeta * omega
                - math.sin(theta)
                - gamma * math.sin(theta - forcing_phase)
            )
        else:
            raise ValueError("El modelo seleccionado no existe.")
        return (omega, acceleration)

    return system


def simulate_json(request_json):
    """Integra un modelo y devuelve un objeto JSON apto para JavaScript."""
    request = json.loads(request_json)
    model_id = request.get("model_id")
    if model_id not in MODEL_IDS:
        raise ValueError("Seleccioná uno de los seis modelos disponibles.")

    theta0 = float(request.get("theta0", 1.0))
    omega0 = float(request.get("omega0", 0.0))
    window = float(request.get("window", 100.0))
    transient = float(request.get("transient", 0.0))
    points = int(request.get("points", 6000))

    values = np.array([theta0, omega0, window, transient], dtype=float)
    if not np.isfinite(values).all():
        raise ValueError("Las condiciones iniciales y los tiempos deben ser finitos.")
    if window <= 0.0 or window > 500.0:
        raise ValueError("La ventana temporal debe estar entre 0 y 500.")
    if transient < 0.0 or transient > 500.0:
        raise ValueError("El transitorio debe estar entre 0 y 500.")
    if points < 300 or points > 12000:
        raise ValueError("La malla debe contener entre 300 y 12 000 puntos.")

    parameters = request.get("parameters", {})
    parameter_values = np.array([float(value) for value in parameters.values()], dtype=float)
    if parameter_values.size and not np.isfinite(parameter_values).all():
        raise ValueError("Todos los parámetros deben ser finitos.")

    final_time = transient + window
    evaluation_times = np.linspace(transient, final_time, points)
    solution = solve_ivp(
        _rhs(model_id, parameters),
        (0.0, final_time),
        (theta0, omega0),
        method="RK45",
        t_eval=evaluation_times,
        rtol=1e-9,
        atol=1e-11,
    )
    if not solution.success:
        raise RuntimeError(f"La integración no pudo completarse: {solution.message}")
    if solution.y.shape[1] != points or not np.isfinite(solution.y).all():
        raise RuntimeError("La integración produjo una solución incompleta o no finita.")

    tau = solution.t - transient
    theta = solution.y[0]
    omega = solution.y[1]
    return json.dumps(
        {
            "tau": tau.tolist(),
            "theta": theta.tolist(),
            "omega": omega.tolist(),
            "solver": {
                "method": "RK45",
                "rtol": 1e-9,
                "atol": 1e-11,
                "points": points,
                "nfev": solution.nfev,
            },
        },
        separators=(",", ":"),
    )
