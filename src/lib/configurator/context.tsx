"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { computeTotals, type ConfiguratorTotals } from "./calculations";
import { canGoBack, canGoNext, configuratorReducer, initialState } from "./state";
import {
  clearConfiguratorState,
  loadConfiguratorState,
  saveConfiguratorState,
} from "./storage";
import type { ConfiguratorAction, ConfiguratorState } from "./types";

type ConfiguratorContextValue = {
  state: ConfiguratorState;
  dispatch: (action: ConfiguratorAction) => void;
  totals: ConfiguratorTotals | null;
  canGoNext: boolean;
  canGoBack: boolean;
};

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(
  null,
);

export function ConfiguratorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(configuratorReducer, initialState);

  // SSR y primer paint del cliente usan `initialState` para evitar mismatch
  // de hidratación. Apenas montamos en el cliente leemos localStorage y, si
  // hay estado guardado, lo aplicamos con una acción HYDRATE.
  useEffect(() => {
    const saved = loadConfiguratorState();
    if (saved) {
      dispatch({ type: "HYDRATE", state: saved });
    }
  }, []);

  // Saltamos el primer save (el causado por el commit inicial con
  // `initialState`) para no pisar el localStorage antes de que corra la
  // hidratación. A partir de ahí, cualquier cambio se persiste.
  const skipFirstSave = useRef(true);
  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    saveConfiguratorState(state);
  }, [state]);

  // Reset al abandonar el configurador vía navegación SPA. El cleanup de
  // useEffect solo corre cuando React desmonta el provider (ir a otra ruta);
  // en un refresh el browser destruye el contexto JS y no llega a correr,
  // por lo que la sesión sobrevive al refresh tal como pidió el brief.
  // La vuelta desde MercadoPago (full reload) se cubre aparte en
  // /confirmacion con <ResetConfiguratorOnMount />.
  useEffect(() => {
    return () => {
      clearConfiguratorState();
    };
  }, []);

  const value = useMemo<ConfiguratorContextValue>(
    () => ({
      state,
      dispatch,
      totals: computeTotals(state),
      canGoNext: canGoNext(state),
      canGoBack: canGoBack(state),
    }),
    [state],
  );

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator(): ConfiguratorContextValue {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error(
      "useConfigurator debe usarse dentro de <ConfiguratorProvider />",
    );
  }
  return ctx;
}
