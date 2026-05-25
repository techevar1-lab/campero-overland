# Sistema visual Campero Overland

## Filosofía

**Mezcla editorial + cinematográfico**: hero con impacto visual fuerte (foto + tipografía serif grande sobre fondo verde profundo), resto del sitio editorial sobrio (mucho espacio en blanco, serif para títulos, sans para body, acentos ocres).

Referencias: Aesop (sobriedad), Snow Peak (artesanía), Patagonia Inc (épica controlada).

## Paleta

### Colores principales
```
--green-deep: #04342C   /* fondo hero, header, footer */
--green-medium: #0F4632 /* secciones, cards en hero */
--green-light: #1F4F38  /* details, montañas decorativas */
--green-accent: #0F5742 /* hover de estados verdes */

--ochre: #B8763A         /* botones primarios, acentos, números */
--ochre-soft: #F0E2CF    /* fondo cálido sección complementos */
--ochre-warm: #FAEEDA    /* hover, iconos secundarios */

--cream: #FAF7F0         /* fondo principal del sitio */
--cream-pure: #FFFFFF    /* cards sobre crema */

--ink: #1A1D17           /* texto principal sobre cream */
--ink-soft: #5F5E5A      /* texto secundario, helpers */
--gray: #8A8A82          /* texto terciario, dividers labels */

--line: #D9D4C5          /* bordes sutiles */
```

### Cuándo usar cada color

- **green-deep (`#04342C`)**: fondo hero, header, footer, CTAs secundarios oscuros, badges. Es el color "marca" más reconocible.
- **ochre (`#B8763A`)**: botón principal "Configurar", labels monospace tipo "PRINCIPIO 01", precios destacados, sol decorativo. Limitado pero notorio.
- **cream (`#FAF7F0`)**: fondo principal del 80% del sitio.
- **ochre-soft (`#F0E2CF`)**: solo para la sección "Complementos incluidos" del home.

## Tipografía

### Familias
- **Fraunces** (Google Fonts) — serif protagonista para títulos
- **Geist Sans** (Google Fonts) — sans-serif para body, navegación, helpers
- **Geist Mono** (Google Fonts) — monospace para etiquetas, números, IDs

### Escala tipográfica

```
display      → Fraunces 60-72px, weight 400, line-height 1.0, tracking -1.5px
              (hero h1)

h1           → Fraunces 36-44px, weight 400, line-height 1.1, tracking -0.5px
              (títulos de sección importantes)

h2           → Fraunces 28-32px, weight 400, line-height 1.15
              (subtítulos)

h3           → Fraunces 22-24px, weight 400, line-height 1.2
              (cards de principios)

body-large   → Geist Sans 15-17px, weight 400, line-height 1.6
              (intro, manifiesto, párrafos hero)

body         → Geist Sans 13-14px, weight 400, line-height 1.65
              (texto general)

body-small   → Geist Sans 11-12px, weight 400, line-height 1.5
              (helpers, captions, disclaimers)

label-mono   → Geist Mono 9-11px, weight 500, letter-spacing 2-3px, UPPERCASE
              (etiquetas: "PRINCIPIO 01", "PASO 1 DE 6", precios CLP, números)

italic-quote → Fraunces 24-28px, weight 400, italic, line-height 1.4
              (citas, manifiesto)
```

### Reglas

- **NUNCA mezclar más de 3 weights** en una misma página
- **Italics en Fraunces** solo para énfasis poético: "en su estuche", "tu Campero ideal"
- **Monospace siempre en UPPERCASE** y con letter-spacing
- **Body NUNCA en italic** (excepto el caso explícito de citas)
- **Sin underline en links normales**; usar color ocre + transición

## Espaciado

Sistema en múltiplos de 4px:
```
xs   → 4px
sm   → 8px
md   → 16px
lg   → 24px
xl   → 32px
2xl  → 48px
3xl  → 64px
4xl  → 80px
5xl  → 96px
```

### Padding de secciones
- Hero: padding 64-80px lateral, height ~540px desktop
- Secciones internas: padding 60-80px lateral, 80px vertical
- Mobile: padding 24-32px lateral

### Gaps en grids
- Tarjetas de catálogo: gap 20-24px
- Tarjetas pequeñas: gap 16px
- Lista de opciones del configurador: gap 8px

## Componentes UI base

### Button

**Variant: primary (ocre)**
```
background: var(--ochre)
color: var(--cream)
padding: 15px 32px
font-family: Geist Sans, weight 500
font-size: 13px
letter-spacing: 0.5px
border: none
border-radius: 0  /* CUADRADO, no redondeado */
cursor: pointer
hover: background var(--ochre-dark = #9F632F)
```

**Variant: secondary (transparent border)**
```
background: transparent
color: var(--cream) o var(--green-deep) según fondo
border: 0.5px solid currentColor (50% opacity)
mismas dimensiones
```

**Variant: ghost (texto solamente)**
```
sin fondo, sin borde
color: var(--ink-soft)
hover: color var(--green-deep)
```

### Card

```
background: var(--cream-pure)
border: 0.5px solid rgba(4, 52, 44, 0.1)
border-radius: 2px (apenas redondeado)
padding: 32px 28px (md) | 16px (sm)
```

Card "seleccionada" (en configurador):
```
border: 2px solid var(--green-deep)
background: rgba(184, 118, 58, 0.06)  /* tinte ocre muy sutil */
padding: 31px 27px  (compensa el grosor del border)
```

### Input

```
width: 100%
padding: 10px 12px
border: 0.5px solid rgba(4, 52, 44, 0.25)
border-radius: 8px
font-family: Geist Sans
font-size: 13px
background: var(--cream-pure)
color: var(--ink)

focus:
  outline: none
  border: 1.5px solid var(--green-deep)
  padding: 9px 11px  /* compensa border thicker */
```

### Badge

```
font-family: Geist Mono
font-size: 9px
letter-spacing: 2px
padding: 4px 8px
border-radius: 3px
font-weight: 500
text-transform: uppercase

eco:     background var(--green-medium) / color var(--cream)
premium: background var(--ochre) / color var(--cream)
neutral: background rgba(4,52,44,0.1) / color var(--ink-soft)
```

## Patrones de composición

### Hero
- Background `--green-deep`
- Montañas decorativas SVG bottom con `opacity 0.4`, polígonos en `--green-light` y `--green-medium`
- Sol ocre decorativo top-right (96px diámetro, opacity 0.9)
- Stats abajo-derecha en serif grande + label monospace ocre

### Sección catálogo
- Grid 3 columnas desktop, 2 en tablet, 1 en mobile
- Tarjetas portrait (aspect-ratio 1:1 o 4:5) con imagen del producto
- Número de orden top-left en monospace ocre ("01", "02"...)
- Título serif, sub en italic, precio en monospace ocre

### CTA final
- Fondo `--green-deep`
- Padding 64px vertical
- Centered: label monospace ocre + título serif grande + subtítulo + botón ocre

## Reglas estrictas

- **NUNCA emojis** en producción (en ningún lado del sitio)
- **NUNCA box-shadows pesadas**; máximo `0 1px 2px rgba(0,0,0,0.04)`
- **NUNCA gradientes brillantes**; solo gradientes muy sutiles entre tonos de verde
- **NUNCA bordes redondeados >8px** salvo en avatares circulares
- **NUNCA usar más de 3 colores diferentes en un solo viewport**
- **SIEMPRE espaciado generoso**: si dudas, agregar 8-16px más
- **SIEMPRE usar el sistema de spacing** (no medidas custom)

## Responsive

### Breakpoints
```
mobile:  < 640px   → 1 columna, padding 24px
tablet:  640-1024px → 2 columnas, padding 48px
desktop: > 1024px  → 3 columnas, padding 80px
```

### Mobile-first
Diseñar primero para mobile, después escalar. El configurador en mobile apila las 2 columnas verticalmente; el panel preview va arriba, sticky al scroll.

## Accesibilidad

- Contraste AA mínimo (4.5:1 para texto normal, 3:1 para texto grande)
- Focus visible en todos los elementos interactivos (outline ocre 2px)
- Skip-to-content link en el top de cada página
- Todas las imágenes con `alt` descriptivo
- Heading hierarchy correcta (h1 → h2 → h3 sin saltar niveles)
