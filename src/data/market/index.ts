import { slugify } from "../categories";
import type { Body, Fuel, MonthPrices } from "./types";
import { months } from "./months";

export type Row = {
  key: string;
  brand: string;
  model: string;
  body: Body;
  category: string;
  trim: string;
  engine: string;
  fuel: Fuel;
  gearbox: string;
  price: number;
  /** Bir önceki ayın fiyatı (varsa) */
  prev: number | null;
  /** Yüzde değişim (önceki ay yoksa null) */
  change: number | null;
  /** Eski aydan yeniye fiyat geçmişi (en fazla 6) */
  history: number[];
  modelHref: string;
};

const sorted: MonthPrices[] = [...months].sort((a, b) => a.month.localeCompare(b.month));
export const currentMonth = sorted.at(-1) ?? null;

const trKey = (brand: string, model: string, trim: string, engine: string, gearbox: string) =>
  [brand, model, trim, engine, gearbox].map(slugify).join("/");

function index(m: MonthPrices) {
  const map = new Map<string, number>();
  for (const b of m.brands) for (const md of b.models) for (const t of md.trims) map.set(trKey(b.brand, md.model, t.trim, t.engine, t.gearbox), t.price);
  return map;
}
const indexes = sorted.map(index);

export const rows: Row[] = [];
if (currentMonth) {
  const last = sorted.length - 1;
  for (const b of currentMonth.brands) {
    for (const md of b.models) {
      const category = md.category ?? "otomobil";
      for (const t of md.trims) {
        const key = trKey(b.brand, md.model, t.trim, t.engine, t.gearbox);
        const history: number[] = [];
        for (let i = Math.max(0, last - 5); i <= last; i++) { const v = indexes[i].get(key); if (v != null) history.push(v); }
        const prev = last > 0 ? indexes[last - 1].get(key) ?? null : null;
        rows.push({
          key, brand: b.brand, model: md.model, body: md.body, category, trim: t.trim, engine: t.engine, fuel: t.fuel, gearbox: t.gearbox,
          price: t.price, prev, change: prev ? ((t.price - prev) / prev) * 100 : null, history,
          modelHref: `/${category}/${slugify(b.brand)}/${slugify(md.model)}`,
        });
      }
    }
  }
}

export const sources = currentMonth?.brands.map((b) => ({ brand: b.brand, urls: b.sources })) ?? [];

export function modelRows(category: string, brandSlug: string, modelSlug: string) {
  return rows.filter((r) => r.category === category && slugify(r.brand) === brandSlug && slugify(r.model) === modelSlug);
}

export function movers() {
  const withChange = rows.filter((r) => r.change != null);
  const up = [...withChange].filter((r) => r.change! > 0).sort((a, b) => b.change! - a.change!).slice(0, 3);
  const down = [...withChange].filter((r) => r.change! < 0).sort((a, b) => a.change! - b.change!).slice(0, 3);
  const avg = withChange.length ? withChange.reduce((s, r) => s + r.change!, 0) / withChange.length : null;
  return { up, down, avg, count: withChange.length };
}

/** Şerit için model başına en ucuz paket ve değişimi */
export function tickerItems(limit = 14) {
  const byModel = new Map<string, Row>();
  for (const r of rows) {
    const k = r.modelHref;
    const cur = byModel.get(k);
    if (!cur || r.price < cur.price) byModel.set(k, r);
  }
  return [...byModel.values()]
    .sort((a, b) => Math.abs(b.change ?? 0) - Math.abs(a.change ?? 0))
    .slice(0, limit);
}

const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
export function monthLabel(m: string) {
  const [y, mo] = m.split("-").map(Number);
  return `${monthNames[mo - 1]} ${y}`;
}
