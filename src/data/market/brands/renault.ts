// Renault binek fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL).
import { buildBrand, type PriceRow } from "./build";

const rows: PriceRow[] = [
  ["Clio", "hatchback", "evolution plus", "Benzin", "TCe 115 hp", "EDC otomatik", { "2026-10": 1830000, "2026-11": 1830000 }],
  ["Clio", "hatchback", "esprit alpine", "Benzin", "TCe 115 hp", "EDC otomatik", { "2026-10": 2035000, "2026-11": 2035000 }],
  ["R5 E-Tech", "hatchback", "techno", "Elektrik", "EV52 150 hp", "Otomatik", { "2026-10": 2140000, "2026-11": 2140000 }],
  ["Captur", "suv", "techno", "Hibrit", "Mild hybrid 140 hp", "EDC otomatik", { "2026-10": 2325000, "2026-11": 2325000 }],
  ["Duster", "suv", "evolution", "LPG", "Eco-G 120 hp", "Manuel", { "2026-10": 1865000, "2026-11": 1865000 }],
  ["Duster", "suv", "evolution", "Benzin", "Turbo TCe 145 hp", "EDC otomatik", { "2026-10": 2050000, "2026-11": 2050000 }],
  ["Duster", "suv", "techno", "Benzin", "Turbo TCe 145 hp", "EDC otomatik", { "2026-10": 2200000, "2026-11": 2200000 }],
  ["Duster", "suv", "techno", "Hibrit", "E-Tech full hybrid 160 hp", "Otomatik", { "2026-10": 2725000, "2026-11": 2725000 }],
  ["Duster", "suv", "evolution 4x4", "Hibrit", "Hybrid 150 hp", "Otomatik", { "2026-10": 2850000, "2026-11": 2850000 }],
  ["Duster", "suv", "techno 4x4", "Hibrit", "Hybrid 150 hp", "Otomatik", { "2026-10": 2920000, "2026-11": 2920000 }],
  ["Megane E-Tech", "suv", "techno", "Elektrik", "EV60 220 hp", "Otomatik", { "2026-10": 2386000, "2026-11": 2386000 }],
  ["Megane Sedan", "sedan", "touch", "Benzin", "1.3 TCe 140 hp", "Manuel", { "2026-10": 1841000, "2026-11": 1841000 }],
  ["Megane Sedan", "sedan", "touch", "Benzin", "1.3 TCe 140 hp", "EDC otomatik", { "2026-10": 2199000, "2026-11": 2199000 }],
  ["Megane Sedan", "sedan", "icon", "Benzin", "1.3 TCe 140 hp", "EDC otomatik", { "2026-10": 2349000, "2026-11": 2349000 }],
  ["Megane Sedan", "sedan", "icon", "Dizel", "1.5 Blue dCi 115 hp", "EDC otomatik", { "2026-10": 2699000, "2026-11": 2699000 }],
  ["Boreal", "suv", "evolution", "Benzin", "Turbo TCe 145 hp", "EDC otomatik", { "2026-10": 2379000, "2026-11": 2379000 }],
  ["Boreal", "suv", "techno", "Benzin", "Turbo TCe 145 hp", "EDC otomatik", { "2026-10": 2899000, "2026-11": 2899000 }],
  ["Boreal", "suv", "iconic", "Benzin", "Turbo TCe 145 hp", "EDC otomatik", { "2026-10": 3049000, "2026-11": 3199000 }],
  ["Boreal", "suv", "iconic", "Hibrit", "E-Tech full hybrid 160 hp", "Otomatik", { "2026-10": 3399000, "2026-11": 3399000 }],
  ["Austral", "suv", "techno", "Hibrit", "Mild hybrid 150 hp", "Otomatik", { "2026-10": 2900000, "2026-11": 2900000 }],
  ["Austral", "suv", "esprit alpine", "Hibrit", "Mild hybrid 150 hp", "Otomatik", { "2026-10": 3220000, "2026-11": 3220000 }],
  ["Austral", "suv", "esprit alpine", "Hibrit", "E-Tech full hybrid 200 hp", "Otomatik", { "2026-10": 3650000, "2026-11": 3650000 }],
  ["Scenic E-Tech", "suv", "esprit alpine", "Elektrik", "EV87 220 hp", "Otomatik", { "2026-10": 3490000, "2026-11": 3490000 }],
  ["Rafale", "suv", "esprit alpine", "Hibrit", "E-Tech full hybrid 200 hp", "Otomatik", { "2026-10": 4050000, "2026-11": 4050000 }],
];

export const renault = {
  "2026-10": buildBrand("Renault", rows, "2026-10", ["https://www.webtekno.com/renault-ekim-2026-fiyat-listesi-aciklandi-duster-a-zam-h226433.html"]),
  "2026-11": buildBrand("Renault", rows, "2026-11", ["https://www.webtekno.com/renault-kasim-2026-fiyat-listesi-h228073.html"]),
};
