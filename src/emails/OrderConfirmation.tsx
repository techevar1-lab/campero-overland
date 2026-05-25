/**
 * Plantilla del email de confirmación de pedido. Se renderiza vía Resend
 * (que internamente usa @react-email/render para convertir JSX a HTML
 * email-safe). Sin "use client": corre solo del lado server.
 *
 * Inline styles porque la mayoría de clientes de email ignora <style>
 * externos o classes.
 */
import type { ConfiguratorTotals } from "@/lib/configurator/calculations";
import { formatPrice } from "@/lib/format";

const CREAM = "#FAF7F0";
const GREEN_DEEP = "#04342C";
const OCHRE = "#B8763A";
const INK_SOFT = "#5F5E5A";
const LINE = "rgba(4,52,44,0.1)";

export function OrderConfirmation({
  orderId,
  customerEmail,
  totals,
  siteUrl,
}: {
  orderId: string;
  customerEmail: string;
  totals: ConfiguratorTotals;
  siteUrl: string;
}) {
  return (
    <html lang="es-CL">
      {/* eslint-disable-next-line @next/next/no-head-element -- email template, no es una página Next */}
      <head>
        <meta charSet="utf-8" />
        <title>Tu Campero está en producción</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: CREAM,
          fontFamily:
            "Georgia, 'Times New Roman', serif",
          color: GREEN_DEEP,
        }}
      >
        <table
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ backgroundColor: CREAM, padding: "32px 0" }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  width={560}
                  cellPadding={0}
                  cellSpacing={0}
                  role="presentation"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: `0.5px solid ${LINE}`,
                  }}
                >
                  <tbody>
                    {/* Header */}
                    <tr>
                      <td
                        style={{
                          backgroundColor: GREEN_DEEP,
                          color: CREAM,
                          padding: "24px 32px",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: 11,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                        }}
                      >
                        Campero Overland · Pucón
                      </td>
                    </tr>

                    {/* Hero */}
                    <tr>
                      <td style={{ padding: "40px 32px 16px" }}>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: "Courier New, monospace",
                            fontSize: 10,
                            letterSpacing: 3,
                            color: OCHRE,
                            textTransform: "uppercase",
                          }}
                        >
                          Pedido #{orderId.slice(0, 8)}
                        </p>
                        <h1
                          style={{
                            margin: "12px 0 16px",
                            fontFamily: "Georgia, serif",
                            fontSize: 28,
                            lineHeight: "1.2",
                            fontWeight: 400,
                            color: GREEN_DEEP,
                          }}
                        >
                          ¡Tu Campero está en producción!
                        </h1>
                        <p
                          style={{
                            margin: 0,
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: 14,
                            lineHeight: "1.6",
                            color: INK_SOFT,
                          }}
                        >
                          Gracias por elegir Campero Overland. Acabamos de
                          recibir tu pedido y comenzamos a fabricar tu{" "}
                          <strong style={{ color: GREEN_DEEP }}>
                            {totals.product.title}
                          </strong>{" "}
                          en{" "}
                          <strong style={{ color: GREEN_DEEP }}>
                            {totals.material.name}
                          </strong>
                          .
                        </p>
                      </td>
                    </tr>

                    {/* Resumen */}
                    <tr>
                      <td style={{ padding: "8px 32px 16px" }}>
                        <p
                          style={{
                            margin: "0 0 12px",
                            fontFamily: "Courier New, monospace",
                            fontSize: 10,
                            letterSpacing: 2,
                            color: OCHRE,
                            textTransform: "uppercase",
                          }}
                        >
                          Resumen
                        </p>
                        <table
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          role="presentation"
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: 13,
                            color: GREEN_DEEP,
                          }}
                        >
                          <tbody>
                            <Row
                              left={totals.product.title}
                              right={formatPrice(totals.basePrice)}
                            />
                            {totals.selectedAddons.map((addon) => (
                              <Row
                                key={addon.id}
                                left={addon.fullName}
                                right={formatPrice({
                                  amount: addon.price.amount,
                                  currency: "CLP",
                                })}
                              />
                            ))}
                            <Row
                              left="Envío a todo Chile"
                              right={formatPrice(totals.shipping)}
                            />
                          </tbody>
                        </table>

                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: `0.5px solid ${LINE}`,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "Courier New, monospace",
                              fontSize: 10,
                              letterSpacing: 2,
                              color: GREEN_DEEP,
                              textTransform: "uppercase",
                            }}
                          >
                            Total
                          </span>
                          <span
                            style={{
                              fontFamily: "Georgia, serif",
                              fontSize: 20,
                              color: OCHRE,
                            }}
                          >
                            {formatPrice(totals.total)}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Próximos pasos */}
                    <tr>
                      <td
                        style={{
                          padding: "24px 32px",
                          borderTop: `0.5px solid ${LINE}`,
                        }}
                      >
                        <p
                          style={{
                            margin: "0 0 12px",
                            fontFamily: "Courier New, monospace",
                            fontSize: 10,
                            letterSpacing: 2,
                            color: OCHRE,
                            textTransform: "uppercase",
                          }}
                        >
                          Próximos pasos
                        </p>
                        <ol
                          style={{
                            margin: 0,
                            paddingLeft: 20,
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: 13,
                            lineHeight: "1.7",
                            color: INK_SOFT,
                          }}
                        >
                          <li>Fabricación: 15 días hábiles.</li>
                          <li>Te avisamos cuando esté listo.</li>
                          <li>Envío: 3-7 días hábiles según comuna.</li>
                        </ol>
                      </td>
                    </tr>

                    {/* Footer */}
                    <tr>
                      <td
                        style={{
                          padding: "16px 32px 24px",
                          fontFamily: "Helvetica, Arial, sans-serif",
                          fontSize: 11,
                          color: INK_SOFT,
                        }}
                      >
                        Confirmación enviada a{" "}
                        <span style={{ color: GREEN_DEEP }}>
                          {customerEmail}
                        </span>
                        .
                        <br />
                        <a
                          href={siteUrl}
                          style={{ color: OCHRE, textDecoration: "none" }}
                        >
                          camperooverland.cl
                        </a>{" "}
                        · Pucón, Chile
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  );
}

function Row({ left, right }: { left: string; right: string }) {
  return (
    <tr>
      <td style={{ paddingBottom: 6 }}>{left}</td>
      <td
        align="right"
        style={{
          paddingBottom: 6,
          fontFamily: "Courier New, monospace",
          color: OCHRE,
          whiteSpace: "nowrap",
        }}
      >
        {right}
      </td>
    </tr>
  );
}
