// Her ayın fiyatları marka dosyalarından (brands/*.ts) toplanır.
// Yeni ay eklemek için: marka dosyalarındaki satırlara "2026-12": fiyat ekle, aşağıdaki listeye ayı yaz.
import type { BrandPrices, MonthPrices } from "./types.js";
import { fiat } from "./brands/fiat.js";
import { renault } from "./brands/renault.js";
import { togg } from "./brands/togg.js";
import { toyota } from "./brands/toyota.js";
import { dacia } from "./brands/dacia.js";
import { hyundai } from "./brands/hyundai.js";
import { peugeot } from "./brands/peugeot.js";
import { volkswagen } from "./brands/volkswagen.js";

const brands: Record<string, BrandPrices>[] = [dacia, fiat, hyundai, peugeot, renault, togg, toyota, volkswagen];
const monthKeys = ["2026-10", "2026-11"];

export const months: MonthPrices[] = monthKeys.map((month) => ({
  month,
  brands: brands.map((b) => b[month]).filter((b): b is BrandPrices => !!b && b.models.length > 0),
}));
