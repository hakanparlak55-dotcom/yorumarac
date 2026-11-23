// Dacia fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL).
// Ekim tablosunda iki Jogger satırının paket adı belirsiz olduğu için o satırlarda Ekim fiyatı yok.
import { buildBrand, type PriceRow } from "./build.js";

const rows: PriceRow[] = [
  ["Logan", "sedan", "essential", "Benzin", "TCe 100", "Manuel", { "2026-10": 1470000, "2026-11": 1470000 }],
  ["Logan", "sedan", "expression", "LPG", "Eco-G 120", "Otomatik", { "2026-10": 1734000, "2026-11": 1734000 }],
  ["Logan", "sedan", "journey", "LPG", "Eco-G 120", "Otomatik", { "2026-10": 1809000, "2026-11": 1809000 }],
  ["Sandero", "hatchback", "expression", "Benzin", "TCe 100", "Manuel", { "2026-10": 1460000, "2026-11": 1460000 }],
  ["Sandero Stepway", "hatchback", "expression", "LPG", "Eco-G 120", "Otomatik", { "2026-10": 1786000, "2026-11": 1806000 }],
  ["Sandero Stepway", "hatchback", "extreme", "LPG", "Eco-G 120", "Otomatik", { "2026-10": 1851000, "2026-11": 1871000 }],
  ["Jogger", "minivan", "extreme 7 koltuk", "Benzin", "TCe 110", "Manuel", { "2026-10": 1650000, "2026-11": 1650000 }],
  ["Jogger", "minivan", "expression 5 koltuk", "LPG", "Eco-G 120", "Manuel", { "2026-11": 1750000 }],
  ["Jogger", "minivan", "expression 7 koltuk", "LPG", "Eco-G 120", "Manuel", { "2026-11": 1790000 }],
  ["Jogger", "minivan", "extreme 5 koltuk", "LPG", "Eco-G 120", "Manuel", { "2026-10": 1760000, "2026-11": 1760000 }],
  ["Jogger", "minivan", "extreme 7 koltuk", "LPG", "Eco-G 120", "Otomatik", { "2026-10": 1904000, "2026-11": 1904000 }],
];

export const dacia = {
  "2026-10": buildBrand("Dacia", rows, "2026-10", ["https://www.webtekno.com/dacia-ekim-2026-fiyat-listesi-h226273.html"]),
  "2026-11": buildBrand("Dacia", rows, "2026-11", ["https://www.webtekno.com/dacia-kasim-2026-fiyat-listesi-h228202.html"]),
};
