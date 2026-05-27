import { getModelForPath } from "./data";
import {
  FIRST_STEP,
  LAST_STEP,
  type ConfiguratorAction,
  type ConfiguratorState,
  type Step,
} from "./types";

export const initialState: ConfiguratorState = {
  step: FIRST_STEP,
  vehicle: null,
  use: null,
  model: null,
  material: "recycled",
  addons: { water: null, fridge: null, power: null },
  email: "",
};

function clampStep(n: number): Step {
  return Math.min(LAST_STEP, Math.max(FIRST_STEP, n)) as Step;
}

export function configuratorReducer(
  state: ConfiguratorState,
  action: ConfiguratorAction,
): ConfiguratorState {
  switch (action.type) {
    case "SET_VEHICLE":
      // Cambiar vehículo invalida el modelo recomendado.
      return { ...state, vehicle: action.vehicle, model: null };
    case "SET_USE":
      // Cambiar modo de viaje invalida el modelo recomendado.
      return { ...state, use: action.use, model: null };
    case "SET_MODEL":
      return { ...state, model: action.modelId };
    case "SET_MATERIAL":
      return { ...state, material: action.material };
    case "SET_ADDON":
      return {
        ...state,
        addons: { ...state.addons, [action.group]: action.variantId },
      };
    case "SET_EMAIL":
      return { ...state, email: action.email };
    case "GO_NEXT":
      return { ...state, step: clampStep(state.step + 1) };
    case "GO_BACK":
      return { ...state, step: clampStep(state.step - 1) };
    case "GO_TO_STEP":
      return { ...state, step: clampStep(action.step) };
    case "RESET":
      return initialState;
    case "HYDRATE":
      return action.state;
  }
}

/**
 * Modelo efectivo: el explícitamente elegido por el usuario, o si todavía
 * no eligió, el recomendado para su combinación vehículo + modo de viaje.
 * El brief dice que el paso 3 lo auto-selecciona; con este helper la UI
 * puede mostrar el preview sin requerir un dispatch previo, manteniendo
 * el reducer puro.
 */
export function getEffectiveModel(state: ConfiguratorState): string | null {
  if (state.model) return state.model;
  if (state.vehicle && state.use) {
    return getModelForPath(state.vehicle, state.use);
  }
  return null;
}

/**
 * Reglas de validación por paso (del brief en docs/configurador.md).
 * Devuelve true si el usuario puede avanzar al siguiente paso.
 */
export function canGoNext(state: ConfiguratorState): boolean {
  switch (state.step) {
    case 0:
      return state.vehicle !== null;
    case 1:
      return state.use !== null;
    case 2:
      return getEffectiveModel(state) !== null;
    case 3:
      return state.material !== null; // siempre true por default
    case 4:
      return true; // accesorios son opcionales
    case 5:
      return false; // último paso: no hay "siguiente", el botón es "Pagar"
  }
}

export function canGoBack(state: ConfiguratorState): boolean {
  return state.step > FIRST_STEP;
}
