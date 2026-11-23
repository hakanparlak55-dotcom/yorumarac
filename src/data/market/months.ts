// Her ayın fiyatları marka dosyalarından (brands/*.ts) toplanır.
// Yeni ay eklemek için: marka dosyalarındaki satırlara "2026-12": fiyat ekle, aşağıdaki listeye ayı yaz.
import type { BrandPrices, MonthPrices } from "./types";
import { fiat } from "./brands/fiat";
import { renault } from "./brands/renault";
import { togg } from "./brands/togg";
import { toyota } from "./brands/toyota";
import { dacia } from "./brands/dacia";
import { hyundai } from "./brands/hyundai";
import { peugeot } from "./brands/peugeot";
import { volkswagen } from "./brands/volkswagen";

const brands: Record<string, BrandPrices>[] = [dacia, fiat, hyundai, peugeot, renault, togg, toyota, volkswagen];
const monthKeys = ["2026-10", "2026-11"];

export const months: MonthPrices[] = monthKeys.map((month) => ({
  month,
  brands: brands.map((b) => b[month]).filter((b): b is BrandPrices => !!b && b.models.length > 0),
}));
