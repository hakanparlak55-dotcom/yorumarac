import type { Body, BrandPrices, Fuel } from "../types";

/** [model, gövde, paket, yakıt, motor, vites, {ay: fiyat}] — fiyatı olmayan ay o pakete dahil edilmez. */
export type PriceRow = [model: string, body: Body, trim: string, fuel: Fuel, engine: string, gearbox: string, prices: Record<string, number>, category?: string];

export function buildBrand(brand: string, rows: PriceRow[], month: string, sources: string[]): BrandPrices {
  const models = new Map<string, BrandPrices["models"][number]>();
  for (const [model, body, trim, fuel, engine, gearbox, prices, category] of rows) {
    const price = prices[month];
    if (price == null) continue;
    const k = `${category ?? "otomobil"}|${model}`;
    const m = models.get(k) ?? { model, body, category, trims: [] };
    m.trims.push({ trim, engine, fuel, gearbox, price });
    models.set(k, m);
  }
  return { brand, sources, models: [...models.values()] };
}
