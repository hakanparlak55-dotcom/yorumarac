// Togg fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL). Kasım'da Ekim fiyatları korundu.
import { buildBrand, type PriceRow } from "./build";

const same = (p: number) => ({ "2026-10": p, "2026-11": p });
const rows: PriceRow[] = [
  ["T10X", "suv", "V1 RWD Standart Menzil", "Elektrik", "160 kW", "Otomatik", same(1909048)],
  ["T10X", "suv", "V1 RWD Uzun Menzil", "Elektrik", "160 kW", "Otomatik", same(2219668)],
  ["T10X", "suv", "V2 RWD Uzun Menzil", "Elektrik", "160 kW", "Otomatik", same(2411000)],
  ["T10X", "suv", "V2 4More Obsidiyen", "Elektrik", "Çift motor 4x4", "Otomatik", same(3218137)],
  ["T10F", "sedan", "V1 RWD Standart Menzil", "Elektrik", "160 kW", "Otomatik", same(1884980)],
  ["T10F", "sedan", "V1 RWD Uzun Menzil", "Elektrik", "160 kW", "Otomatik", same(2195600)],
  ["T10F", "sedan", "V2 RWD Uzun Menzil", "Elektrik", "160 kW", "Otomatik", same(2370930)],
  ["T10F", "sedan", "V2 4More", "Elektrik", "Çift motor 4x4", "Otomatik", same(3217937)],
];

export const togg = {
  "2026-10": buildBrand("TOGG", rows, "2026-10", ["https://www.cnbce.com/otomotiv/togg-kasim-2026-fiyat-listesi-aciklandi-iste-togg-guncel-fiyatlari-ve-kredi-kampanyalari-g40845"]),
  "2026-11": buildBrand("TOGG", rows, "2026-11", ["https://www.webtekno.com/kasim-2026-togg-fiyat-listesi-h228136.html"]),
};
