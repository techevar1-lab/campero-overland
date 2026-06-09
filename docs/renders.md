# Sistema de renders del configurador

El preview del configurador se compone como **capas** apiladas: una imagen
base del producto + PNGs sueltos de cada accesorio posicionados por
anchors. Esto evita renderizar combinaciones (serían cientos) y permite
escalar agregando assets de a uno.

## Carpeta

```
public/renders/
  products/           Render base por modelo (uno por SKU)
    j3_org.png
    j3_cama1.png
    j5_org.png        ← pendiente
    j5_cama2.png      ← pendiente
    go_org.png        ← pendiente
    go_cama.png       ← pendiente
  accessories/        PNGs sueltos de cada accesorio (uno por variante)
    water_24.png      ← pendiente
    fridge_18.png     ← pendiente
    fridge_30.png     ← pendiente
    power_300.png     ← pendiente (hoy: power_river_placeholder)
    power_600.png     ← pendiente
    power_800.png     ← pendiente
  actions/            Storytelling (no para el preview en vivo)
    j3_cama1_step1.png, step2.png  (step3 = products/j3_cama1.png)
    j3_cama1_overview.png  (los 3 pasos apilados)
  _reference/         Solo referencia / no se usa en runtime
```

## Specs de los renders

| Aspecto | Producto base | Accesorio suelto |
| --- | --- | --- |
| Formato | PNG con transparencia | PNG con transparencia |
| Tamaño | 1920×1080 (16:9) | Lo que de natural, sin distorsión |
| Sombra | Sin sombra al piso | **Sin sombra ni reflejo** |
| Fondo | Transparente | Transparente |
| Cámara | 3/4 (ver nota) | **Misma cámara y luz que el producto** |
| Escala | Proporciones reales entre modelos | Proporción consistente con el producto |

> **Nota sobre la cámara**: idealmente todos los productos comparten la
> misma cámara para que el configurador se sienta como un sistema. Hoy
> (Fase 1) tenemos j3_org y j3_cama1 con cámaras distintas, decisión
> consciente para avanzar; cuando se rehagan los renders faltantes se
> evaluará alinear.

## `data/renderAnchors.json`

Define dónde va cada accesorio sobre cada producto. Coordenadas como
**fracción del lienzo del PNG base** (0..1).

```json
{
  "products": {
    "j3_org": {
      "src": "/renders/products/j3_org.png",
      "aspect": [1920, 1080],
      "anchors": {
        "water":  null,
        "fridge": null,
        "power":  { "cx": 0.4771, "cy": 0.3454, "w": 0.1688 }
      }
    }
  },
  "accessories": {
    "power_300": "/renders/accessories/power_river_placeholder.png",
    "water_24":  null
  }
}
```

- `cx`, `cy`: centro del accesorio sobre el lienzo del PNG base.
- `w`: ancho del accesorio relativo al ancho del lienzo. La altura sale
  natural por la proporción intrínseca del PNG del accesorio (no hace
  falta `h`).
- Si un anchor es `null`, ese accesorio **no se renderiza** sobre ese
  producto (el componente lo omite).
- Si un accesorio es `null` en `accessories`, no se renderiza (esperando
  el PNG).

## Cómo agregar un producto nuevo

1. Sube el PNG a `public/renders/products/<product_id>.png` (mismo id que
   `data/productos.json`).
2. Sube los PNGs sueltos de accesorios si faltan, a `public/renders/accessories/`.
3. Edita `data/renderAnchors.json`:
   - Agrega la entrada del producto con `src`, `aspect` y `anchors`.
   - Para calcular cada anchor: abre el PNG del producto en un editor,
     mide el centro del compartimento donde va el accesorio en píxeles,
     y divide por el ancho/alto del PNG.

## Cómo agregar un accesorio nuevo

1. Sube el PNG a `public/renders/accessories/<variant_id>.png` (mismo id
   que `data/accesorios.json`).
2. En `data/renderAnchors.json`, cambia `"<variant_id>": null` por la
   ruta del PNG.
3. Si el accesorio se coloca sobre productos que ya tienen render, define
   el anchor correspondiente en cada uno.

## Cómo se monta

`src/components/configurador/LayeredPreview.tsx` lee `renderAnchors.json`
y, para el producto activo en el configurador, apila:

1. La imagen base con `next/image fill object-contain`.
2. Por cada accesorio seleccionado con anchor + PNG disponibles, un div
   absoluto centrado en `(cx, cy)` con ancho `w` en porcentaje y
   `transform: translate(-50%, -50%)`.

Si el producto no tiene entrada en el JSON, `PreviewPanel` cae al
placeholder verde sin render.
