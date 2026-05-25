export type Price = {
  amount: number;
  currency: "CLP";
};

const numberFormatter = new Intl.NumberFormat("es-CL");

/**
 * Formato Campero Overland: "CLP 490.000".
 * Currency code + space + número con punto como separador de miles (es-CL).
 */
export function formatPrice(price: Price): string {
  return `${price.currency} ${numberFormatter.format(price.amount)}`;
}
