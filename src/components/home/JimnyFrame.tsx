import Image from "next/image";

/**
 * Silueta lateral del Jimny 3p (JB64, post-2018) en SVG line-art editorial
 * que sirve de "marco" para el render del producto en el catálogo del home.
 * El render del Campero se posiciona en el área de carga trasera del
 * vehículo (último tercio del Jimny).
 *
 * Esto es un PLACEHOLDER hasta que tengamos un render real del Jimny en
 * el mismo ángulo y luz que los productos. Cuando llegue, esta silueta
 * se reemplaza por una Image.
 *
 * El viewBox es cuadrado (400×400) para alinear naturalmente con la
 * tarjeta aspect-square del catálogo. El Jimny ocupa la franja vertical
 * central (y 140..330 aprox). Las coordenadas del render se ubican como
 * porcentaje del contenedor cuadrado, que coincide 1:1 con el viewBox.
 */
export function JimnyFrame({
  src,
  alt,
  orderNumber,
}: {
  src: string;
  alt: string;
  orderNumber?: string;
}) {
  return (
    <div className="relative h-full w-full bg-cream-pure">
      {orderNumber ? (
        <span className="absolute left-3.5 top-3.5 z-10 font-mono text-[9px] uppercase tracking-[2px] text-ochre">
          {orderNumber}
        </span>
      ) : null}

      <svg
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
        className="absolute inset-0 h-full w-full text-green-deep"
      >
        <g
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {/* Línea de suelo (referencia editorial sutil) */}
          <line x1="20" y1="335" x2="380" y2="335" strokeWidth="0.8" opacity="0.3" />

          {/* Cuerpo lateral del Jimny:
              capó corto → parabrisas casi vertical → techo plano → hatch
              trasero vertical → falda inferior */}
          <path
            d="M 30 305
               L 30 245
               L 110 245
               L 138 165
               L 372 165
               L 372 305
               L 354 312
               L 48 312
               Z"
          />

          {/* Línea horizontal (cinturón de carrocería) */}
          <line x1="30" y1="245" x2="372" y2="245" strokeWidth="0.7" opacity="0.45" />

          {/* Pilar A (donde termina el parabrisas) */}
          <line x1="138" y1="165" x2="144" y2="245" />
          {/* Pilar B (detrás de la puerta) */}
          <line x1="234" y1="165" x2="234" y2="245" />
          {/* Pilar C (entre cabina y carga) */}
          <line x1="278" y1="165" x2="278" y2="245" />

          {/* Ventana de puerta delantera */}
          <path d="M 152 178 L 226 178 L 226 237 L 152 237 Z" strokeWidth="1" />
          {/* Ventana trasera de cabina */}
          <path d="M 242 178 L 270 178 L 270 237 L 242 237 Z" strokeWidth="1" />

          {/* Manija de puerta */}
          <line x1="166" y1="262" x2="200" y2="262" strokeWidth="1" />

          {/* Rueda delantera */}
          <circle cx="88" cy="320" r="30" />
          <circle cx="88" cy="320" r="11" strokeWidth="1" />
          {/* Wheel arch frontal */}
          <path d="M 55 308 Q 88 270 121 308" strokeWidth="1.2" />

          {/* Rueda trasera */}
          <circle cx="320" cy="320" r="30" />
          <circle cx="320" cy="320" r="11" strokeWidth="1" />
          {/* Wheel arch trasero */}
          <path d="M 287 308 Q 320 270 353 308" strokeWidth="1.2" />

          {/* Faro delantero */}
          <rect x="34" y="255" width="14" height="14" strokeWidth="1" />

          {/* Línea sutil del techo */}
          <line x1="148" y1="165" x2="362" y2="165" strokeWidth="0.8" opacity="0.5" />
        </g>
      </svg>

      {/* Render del producto dentro del área de carga (último tercio
          horizontal del Jimny, sobre el cinturón). Cargo en SVG: aprox
          x 280..360, y 170..245 → centro (320, 207) = (80%, 52%) en el
          contenedor cuadrado. El render se centra ahí. */}
      <div
        className="absolute"
        style={{
          left: "78%",
          top: "58%",
          width: "27%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={500}
          height={300}
          sizes="180px"
          className="h-auto w-full"
        />
      </div>
    </div>
  );
}
