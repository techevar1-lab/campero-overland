import { notFound } from "next/navigation";

/**
 * Catch-all para cualquier ruta no matcheada dentro de un locale. Dispara
 * notFound() para que se renderice la 404 con marca ([locale]/not-found.tsx)
 * dentro del layout (header/footer), en vez de la 404 cruda de Next.
 */
export default function CatchAllNotFound() {
  notFound();
}
