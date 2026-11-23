// Toyota binek fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL).
import { buildBrand, type PriceRow } from "./build";

const rows: PriceRow[] = [
  ["Corolla", "sedan", "Vision Plus", "Benzin", "1.5 125 hp", "Multidrive S", { "2026-10": 2545500, "2026-11": 2545500 }],
  ["Corolla", "sedan", "Dream", "Benzin", "1.5 125 hp", "Multidrive S", { "2026-10": 2753500, "2026-11": 2753500 }],
  ["Corolla", "sedan", "Dream X-Pack", "Benzin", "1.5 125 hp", "Multidrive S", { "2026-10": 2905000, "2026-11": 2905000 }],
  ["Corolla", "sedan", "Flame X-Pack", "Benzin", "1.5 125 hp", "Multidrive S", { "2026-10": 3126000, "2026-11": 3126000 }],
  ["Corolla", "sedan", "Passion X-Pack", "Benzin", "1.5 125 hp", "Multidrive S", { "2026-10": 3297500, "2026-11": 3297500 }],
  ["Corolla", "sedan", "Dream", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 2968000, "2026-11": 2968000 }],
  ["Corolla", "sedan", "Dream X-Pack", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3053000, "2026-11": 3053000 }],
  ["Corolla", "sedan", "Flame X-Pack", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3297000, "2026-11": 3297000 }],
  ["Corolla Hatchback", "hatchback", "Flame", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 2960000, "2026-11": 2960000 }],
  ["Corolla Hatchback", "hatchback", "Passion X-Pack", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3050000, "2026-11": 3050000 }],
  ["Corolla Hatchback", "hatchback", "GR Sport", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3050000, "2026-11": 3050000 }],
  ["Corolla Cross", "suv", "Flame", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3413000, "2026-11": 3413000 }],
  ["Corolla Cross", "suv", "Passion", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3660000, "2026-11": 3515000 }],
  ["Corolla Cross", "suv", "Passion X-Pack", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 4234000, "2026-11": 4234000 }],
  ["C-HR", "suv", "Flame", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 2859000, "2026-11": 2859000 }],
  ["C-HR", "suv", "Passion", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3112000, "2026-11": 3112000 }],
  ["C-HR", "suv", "Passion X-Sport", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3419000, "2026-11": 3419000 }],
  ["C-HR", "suv", "GR Sport", "Hibrit", "1.8 Hybrid", "e-CVT", { "2026-10": 3577000, "2026-11": 3577000 }],
  ["Yaris", "hatchback", "Flame", "Hibrit", "1.5 Hybrid", "e-CVT", { "2026-10": 2521000, "2026-11": 2546500 }],
  ["Yaris", "hatchback", "Passion X-Pack Siyah Tavan", "Hibrit", "1.5 Hybrid", "e-CVT", { "2026-10": 2918000, "2026-11": 2947500 }],
  ["Yaris Cross", "suv", "Dream", "Hibrit", "1.5 Hybrid 130 hp", "e-CVT", { "2026-10": 2820000 }],
  ["Yaris Cross", "suv", "Flame", "Hibrit", "1.5 Hybrid 130 hp", "e-CVT", { "2026-11": 2926000 }],
  ["Yaris Cross", "suv", "Flame X-Pack", "Hibrit", "1.5 Hybrid 130 hp", "e-CVT", { "2026-10": 3345000, "2026-11": 3400000 }],
  ["Yaris Cross", "suv", "Passion X-Pack", "Hibrit", "1.5 Hybrid 130 hp", "e-CVT", { "2026-11": 3637000 }],
  ["Hilux", "pickup", "Power 4x4 Adventure", "Dizel", "2.8 D-4D Mild Hybrid", "Otomatik", { "2026-10": 4325000, "2026-11": 4325000 }, "arazi-suv-pickup"],
  ["Hilux", "pickup", "Power 4x4 Hi-Cruiser", "Dizel", "2.8 D-4D Mild Hybrid", "Otomatik", { "2026-10": 4850000, "2026-11": 4850000 }, "arazi-suv-pickup"],
  ["Hilux", "pickup", "Power 4x4 Invincible", "Dizel", "2.8 D-4D Mild Hybrid", "Otomatik", { "2026-10": 5510000, "2026-11": 5510000 }, "arazi-suv-pickup"],
  ["Land Cruiser Prado", "suv", "Standart", "Dizel", "2.8 D-4D Mild Hybrid", "Otomatik", { "2026-10": 19995000, "2026-11": 17550000 }, "arazi-suv-pickup"],
];

export const toyota = {
  "2026-10": buildBrand("Toyota", rows, "2026-10", ["https://www.webtekno.com/toyota-ekim-2026-fiyat-listesi-h226456.html"]),
  "2026-11": buildBrand("Toyota", rows, "2026-11", ["https://webtekno.com/toyota-kasim-2026-fiyat-listesi-h228149.html"]),
};
