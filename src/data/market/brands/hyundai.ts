// Hyundai binek fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL).
import { buildBrand, type PriceRow } from "./build";

const same = (p: number) => ({ "2026-10": p, "2026-11": p });
const rows: PriceRow[] = [
  ["i20", "hatchback", "Jump", "Benzin", "1.0 T-GDI 90 PS", "Manuel", same(1582000)],
  ["i20", "hatchback", "Jump", "Benzin", "1.0 T-GDI 90 PS", "DCT otomatik", same(1759000)],
  ["i20", "hatchback", "Style", "Benzin", "1.0 T-GDI 90 PS", "DCT otomatik", same(1965000)],
  ["i20", "hatchback", "Elite", "Benzin", "1.0 T-GDI 90 PS", "DCT otomatik", same(2091000)],
  ["i30", "hatchback", "Comfort", "Benzin", "1.6 T-GDI 150 PS", "DCT otomatik", same(2120000)],
  ["i30", "hatchback", "Prime", "Benzin", "1.6 T-GDI 150 PS", "DCT otomatik", same(2320000)],
  ["Bayon", "suv", "Jump", "Benzin", "1.0 T-GDI 90 PS", "Manuel", same(1672000)],
  ["Bayon", "suv", "Jump", "Benzin", "1.0 T-GDI 90 PS", "DCT otomatik", same(1745000)],
  ["Bayon", "suv", "Style", "Benzin", "1.0 T-GDI 90 PS", "DCT otomatik", same(2067000)],
  ["Bayon", "suv", "Elite", "Benzin", "1.0 T-GDI 90 PS", "DCT otomatik", same(2212000)],
  ["Kona", "suv", "Prime", "Benzin", "1.6 T-GDI 180 PS", "DCT otomatik", same(2385000)],
  ["Kona", "suv", "Advance (Elektrik)", "Elektrik", "99 kW", "Otomatik", same(2479000)],
  ["Tucson", "suv", "4x2 Comfort", "Benzin", "1.6 T-GDI 180 PS", "DCT otomatik", same(2599000)],
  ["Tucson", "suv", "4x2 Prime", "Benzin", "1.6 T-GDI 180 PS", "DCT otomatik", same(2771000)],
  ["Tucson", "suv", "4x2 Elite", "Benzin", "1.6 T-GDI 180 PS", "DCT otomatik", same(3520000)],
  ["Tucson", "suv", "4x4 Elite Plus", "Benzin", "1.6 T-GDI 180 PS", "DCT otomatik", same(3770000)],
  ["Tucson", "suv", "4x4 Comfort Sunroof", "Dizel", "1.6 CRDi 136 PS", "DCT otomatik", same(2790000)],
  ["Tucson", "suv", "4x4 Elite Plus (2025)", "Dizel", "1.6 CRDi 136 PS", "DCT otomatik", same(3682000)],
  ["Santa Fe", "suv", "4WD Progressive", "Hibrit", "1.6 T-GDI HEV 239 PS", "Otomatik", { "2026-10": 6120000, "2026-11": 6180000 }],
  ["Inster", "hatchback", "Dynamic", "Elektrik", "71,1 kW", "Otomatik", same(1670000)],
  ["Inster", "hatchback", "Advance", "Elektrik", "84,5 kW", "Otomatik", { "2026-11": 1920000 }],
  ["Inster", "hatchback", "Cross Advance", "Elektrik", "84,5 kW", "Otomatik", same(1970000)],
  ["IONIQ 3", "hatchback", "Select Standart Menzil", "Elektrik", "107,8 kW", "Otomatik", { "2026-11": 1799000 }],
  ["IONIQ 3", "hatchback", "Trend Uzun Menzil", "Elektrik", "99,5 kW", "Otomatik", { "2026-11": 2099000 }],
  ["IONIQ 3", "hatchback", "Trend Uzun Menzil Vision Roof", "Elektrik", "99,5 kW", "Otomatik", { "2026-11": 2149000 }],
  ["IONIQ 3", "hatchback", "Prime Uzun Menzil", "Elektrik", "99,5 kW", "Otomatik", { "2026-11": 2249000 }],
  ["IONIQ 3", "hatchback", "Prime Uzun Menzil Vision Roof", "Elektrik", "99,5 kW", "Otomatik", { "2026-11": 2349000 }],
  ["IONIQ 3", "hatchback", "N Line Evo", "Elektrik", "99,5 kW", "Otomatik", { "2026-11": 3220000 }],
  ["IONIQ 5", "suv", "Dynamic Visionroof", "Elektrik", "125 kW", "Otomatik", same(3350000)],
  ["IONIQ 5", "suv", "Progressive", "Elektrik", "160 kW", "Otomatik", same(3999000)],
  ["IONIQ 6", "sedan", "Advance", "Elektrik", "125 kW", "Otomatik", same(3246000)],
  ["IONIQ 6", "sedan", "Progressive", "Elektrik", "160 kW", "Otomatik", same(3795000)],
  ["IONIQ 9", "suv", "4x2 Progressive", "Elektrik", "160 kW / 218 PS", "Otomatik", same(6040000)],
  ["IONIQ 9", "suv", "4x2 Progressive Bluelink", "Elektrik", "160 kW / 218 PS", "Otomatik", { "2026-11": 6150000 }],
  ["IONIQ 9", "suv", "4x4 Calligraphy", "Elektrik", "226 kW / 307 PS", "Otomatik", same(7190000)],
  ["IONIQ 9", "suv", "4x4 Calligraphy Bluelink", "Elektrik", "226 kW / 307 PS", "Otomatik", { "2026-11": 7300000 }],
];

export const hyundai = {
  "2026-10": buildBrand("Hyundai", rows, "2026-10", ["https://webtekno.com/ekim-2026-hyundai-fiyat-listesi-h226285.html"]),
  "2026-11": buildBrand("Hyundai", rows, "2026-11", ["https://www.webtekno.com/hyundai-kasim-2026-fiyat-listesi-h228271.html"]),
};
