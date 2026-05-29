import type { MetadataRoute } from "next";
import productosData from "@data/productos.json";
import { siteUrl } from "@/lib/env";

/**
 * Sitemap. Un solo locale activo (es-CL). Se excluye /confirmacion
 * (página transaccional, noindex). Cuando se agreguen en/es-AR, mapear
 * por locale.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl().replace(/\/$/, "");
  const locale = "es-CL";
  const now = new Date();

  const staticPaths = [
    "",
    "/configurador",
    "/a-medida",
    "/historia",
    "/contacto",
    "/faq",
    "/privacidad",
    "/terminos",
  ];

  const staticEntries = staticPaths.map((path) => ({
    url: `${base}/${locale}${path}`,
    lastModified: now,
  }));

  const productEntries = productosData.products.map((product) => ({
    url: `${base}/${locale}/producto/${product.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...productEntries];
}
