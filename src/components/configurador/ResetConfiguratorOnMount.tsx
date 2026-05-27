"use client";

import { useEffect } from "react";
import { clearConfiguratorState } from "@/lib/configurator/storage";

/**
 * Limpia el estado persistido del configurador al montar. Pensado para la
 * vuelta desde MercadoPago a /confirmacion: como es un full page reload,
 * el cleanup de ConfiguratorProvider nunca llega a correr, así que el
 * localStorage de la sesión anterior sobreviviría sin esta intervención.
 */
export function ResetConfiguratorOnMount() {
  useEffect(() => {
    clearConfiguratorState();
  }, []);
  return null;
}
