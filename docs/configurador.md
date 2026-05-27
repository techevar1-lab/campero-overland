# Configurador Campero — Flujo completo

El configurador es la pieza central del sitio. Se llega desde `/configurador` o desde el botón principal del home.

## Estructura general

- **6 pasos** lineales con barra de progreso superior
- **Layout 2 columnas**: izquierda decisiones, derecha panel preview en vivo
- **Panel derecho** muestra: render esquemático del producto, peso/volumen acumulado, total estimado, specs acumuladas
- **Nav**: botón "Atrás" (oculto en paso 1) y "Siguiente" (deshabilitado si falta selección obligatoria)
- **Mobile**: las 2 columnas se apilan verticalmente, panel preview arriba

## Estado interno

```typescript
type ConfiguratorState = {
  step: 0 | 1 | 2 | 3 | 4 | 5;  // 0-indexed
  vehicle: "jimny3" | "jimny5" | "other" | null;
  use: "outside" | "inside" | null;
  model: string | null;  // id del modelo elegido (depende de vehicle+use)
  material: "recycled" | "birch";  // default "recycled"
  addons: {
    water: string | null;   // "water_6" | "water_10" | "water_19" | null
    fridge: string | null;  // "fridge_18" | "fridge_30" | null
    power: string | null;   // "power_300" | "power_600" | "power_800" | null
  };
  email: string;
};
```

Default inicial: todo en `null` salvo `material: "recycled"` y `addons: { water: null, fridge: null, power: null }`.

## Paso 1 — Vehículo

**Pregunta**: "¿Qué vehículo tienes?"

**Helper**: "Empezamos por aquí. Esto define los modelos disponibles."

**Opciones** (lista de 3, selección única, obligatoria):
- `jimny3` — "Suzuki Jimny 3 puertas" / sub: "Generación JB64 / 2018+"
- `jimny5` — "Suzuki Jimny 5 puertas" / sub: "Generación JB74 / 2023+"
- `other` — "Otro SUV / Pick-up" / sub: "Te ofrecemos Campero Go universal"

**Panel preview**: placeholder "Selecciona una opción para ver tu configuración".

## Paso 2 — Modo de viaje

**Pregunta**: "¿Cómo viajas?"

**Helper**: "¿Duermes adentro de tu vehículo o tienes carpa de techo / camping?"

**Opciones** (lista de 2, selección única, obligatoria):
- `outside` — "No duermo adentro" / sub: "Tengo carpa de techo, camping o duermo afuera"
- `inside` — "Duermo adentro del vehículo" / sub: "Necesito cama plegable integrada"

**Panel preview**: muestra el vehículo seleccionado en paso 1.

## Paso 3 — Modelo recomendado

**Pregunta**: "Tu Campero recomendado"

**Helper**: "Esta opción se adapta a tu vehículo y uso."

**Lógica condicional** (ver `data/productos.json` para detalle):

```
jimny3 + outside → mostrar j3_org ($490.000)
jimny3 + inside  → mostrar j3_cama1 ($690.000)
jimny5 + outside → mostrar j5_org ($560.000)
jimny5 + inside  → mostrar j5_cama2 ($890.000)
other + outside  → mostrar go_org ($420.000)
other + inside   → mostrar go_cama ($650.000)
```

Cada modelo se muestra como una tarjeta seleccionable (en V1 solo hay 1 modelo por combinación, pero el componente debe estar preparado para múltiples opciones en el futuro).

**Panel preview**: render esquemático SVG del producto (vista superior) con compartimentos vacíos. Mostrar peso y volumen del bolso final.

## Paso 4 — Material

**Pregunta**: "¿Con qué material lo fabricamos?"

**Helper**: "Ambos materiales tienen la misma ingeniería de ensambles. Cambia el peso, la estética y el impacto."

**Opciones** (lista de 2, selección única, obligatoria, default "recycled"):

### Plástico reciclado (default)
- Badge verde: "SUSTENTABLE"
- Descripción: "Polímeros PET/HDPE reciclados de uso post-consumo. Más liviano, resistente al agua y a los rayos UV. Tu compra retira plástico del medio ambiente."
- Atributos: peso "−30% liviano", estética "Texturizado mate"
- Multiplicador precio: 0.80 (descuento del 20% sobre el precio base del mobiliario; no afecta accesorios)
- Multiplicador peso: 0.70
- Multiplicador volumen: 1.0

### Terciado de abedul
- Badge ocre: "PREMIUM"
- Descripción: "Madera contralaminada báltica grado A. Acabado natural envejecido con aceites. Estética artesanal y máxima durabilidad. Soporta más peso."
- Atributos: peso "Estándar", estética "Madera natural"
- Multiplicador precio: 1.0 (precio base listado en productos.json)
- Multiplicador peso: 1.0
- Multiplicador volumen: 1.05

**Panel preview**: el render esquemático cambia de color según material seleccionado.

## Paso 5 — Accesorios

**Pregunta**: "Personaliza tu Campero"

**Helper**: "Tu Campero viene con compartimentos dimensionados para estos accesorios. Si los agregas, todo encaja perfectamente. Si no, el espacio queda libre para que pongas un complemento similar que ya tengas."

**3 grupos de accesorios**, cada uno con sus variantes (selección única dentro del grupo, con opción "No incluir"):

### Bidón con bomba de agua
- 6 L — Bidón con bomba — $50.000 — peso +1.2 kg, volumen +4 L
- 10 L — Bidón con bomba — $70.000 — peso +1.8 kg, volumen +6 L
- 19 L — Bidón con bomba — $90.000 — peso +2.8 kg, volumen +10 L

### Refrigeración enchufable
- 18 L — Alpicool X18 — $220.000 — peso +10.5 kg, volumen +22 L
- 30 L — Alpicool X30 — $280.000 — peso +13.0 kg, volumen +32 L

### Estación de energía
- 300 W — EcoFlow River 3 — $275.000 — peso +3.5 kg, volumen +6 L
- 600 W — EcoFlow River 3 Plus — $340.000 — peso +4.7 kg, volumen +8 L
- 800 W — EcoFlow River 2 Pro — $560.000 — peso +7.8 kg, volumen +14 L

Detalle técnico de cada accesorio (marca, modelo, descripción larga) en `data/accesorios.json`. Mostrar "ver detalle" cuando hay una variante seleccionada, que despliega la descripción completa.

**Render esquemático**: cada compartimento (refrigeración, energía, agua) cambia de vacío (punteado) a lleno (color ocre con etiqueta del tamaño) según la selección.

**Mensaje si no agrega nada al pasar a siguiente paso**: mostrar mensaje sutil en color ocre: "¿Estás seguro? Al agregarlos, aprovechas al máximo el diseño modular. Si no, siempre puedes comprarlos después." NO bloquear continuación.

## Paso 6 — Resumen y compra

**Pregunta**: "Resumen y compra"

**Helper**: "Revisa tu configuración. Despachamos a todo Chile (envío flat $25.000)."

**Contenido**:

1. **Tarjeta resumen** con secciones separadas por divider sutil:
   - **PRODUCTO BASE**: nombre del modelo + "Material: [nombre del material]" + precio ajustado por material
   - **ACCESORIOS** (solo si hay): lista de cada add-on con marca + tamaño + precio
   - **ESPECIFICACIONES**: peso bolso (kg), volumen (L)
   - **DESPACHO**: "Envío a todo Chile" + $25.000
   - **Total final**: suma de todo, destacado

2. **Campo email** (obligatorio): "tu@correo.cl" + helper "Te enviamos confirmación, factura y seguimiento."

3. **Botón principal**: "Pagar $[TOTAL] con MercadoPago →" (color ocre, ancho completo)

4. **Disclaimer abajo**: "Fabricación bajo pedido · 15 días hábiles · Garantía 12 meses"

## Lógica de validación del botón "Siguiente"

- Paso 1: requiere `vehicle != null`
- Paso 2: requiere `use != null`
- Paso 3: requiere `model != null` (auto-seleccionado al entrar al paso)
- Paso 4: requiere `material != null` (siempre cumplido por default "recycled")
- Paso 5: siempre permitido (add-ons opcionales)
- Paso 6: no hay botón siguiente; el botón es "Pagar"

## Cálculos en tiempo real

### Subtotal
```
basePrice = productos[model].price * materiales[material].priceMultiplier
addonsTotal = Σ accesorios[addonId].price (de las variantes seleccionadas)
subtotal = basePrice + addonsTotal
total = subtotal + 25000 (envío)
```

### Peso final del bolso
```
baseWeight = productos[model].baseWeight * materiales[material].weightFactor
addonsWeight = Σ accesorios[addonId].addWeight
totalWeight = baseWeight + addonsWeight  // mostrar 1 decimal
```

### Volumen final del bolso
```
baseVolume = productos[model].baseVolume * materiales[material].volumeFactor
addonsVolume = Σ accesorios[addonId].addVolume
totalVolume = baseVolume + addonsVolume  // mostrar entero
```

## Al hacer click en "Pagar"

1. Validar email con Zod
2. POST a `/api/checkout` con todo el estado del configurador
3. El backend:
   - Guarda en `configurations` table de Supabase
   - Crea preferencia en MercadoPago con back_urls
   - Devuelve `init_point` (URL de MP)
4. Redirige al cliente a MP
5. MP procesa el pago, después redirige a `/confirmacion?status=success&payment_id=...`
6. Webhook MP en `/api/webhook/mp` actualiza el estado del order en Supabase
7. Resend envía email de confirmación al cliente

## Persistencia local

Guardar el estado del configurador en `localStorage` para que el usuario no pierda su selección si refresca la página. Limpiar `localStorage` al completar el pago.

## Accesibilidad

- Todos los botones con `aria-label` descriptivo
- Barra de progreso con `aria-valuenow`, `aria-valuemax`
- Cada paso tiene `<h2>` con la pregunta para screen readers
- Navegación con Tab funcional
