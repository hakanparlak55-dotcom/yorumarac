// Fiat binek fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL).
import { buildBrand, type PriceRow } from "./build";

const rows: PriceRow[] = [
  ["Egea", "sedan", "Easy", "Dizel", "1.6 Multijet 130 hp", "Manuel", { "2026-10": 1499900, "2026-11": 1499900 }],
  ["Egea", "sedan", "Urban", "Dizel", "1.6 Multijet 130 hp", "Manuel", { "2026-10": 1599900, "2026-11": 1599900 }],
  ["Egea", "sedan", "Lounge", "Dizel", "1.6 Multijet 130 hp", "Manuel", { "2026-10": 1674900, "2026-11": 1674900 }],
  ["Egea", "sedan", "Easy", "Dizel", "1.6 Multijet 130 hp", "DCT otomatik", { "2026-10": 1950900, "2026-11": 1950900 }],
  ["Egea", "sedan", "Urban", "Dizel", "1.6 Multijet 130 hp", "DCT otomatik", { "2026-10": 2020900, "2026-11": 2020900 }],
  ["Egea", "sedan", "Lounge", "Dizel", "1.6 Multijet 130 hp", "DCT otomatik", { "2026-10": 2090900, "2026-11": 2090900 }],
  ["Egea Cross", "hatchback", "Street", "Dizel", "1.6 Multijet 130 hp Traction+", "DCT otomatik", { "2026-10": 1990900, "2026-11": 1990900 }],
  ["Egea Cross", "hatchback", "Urban", "Dizel", "1.6 Multijet 130 hp Traction+", "DCT otomatik", { "2026-10": 2026900, "2026-11": 2026900 }],
  ["Egea Cross", "hatchback", "Lounge", "Dizel", "1.6 Multijet 130 hp Traction+", "DCT otomatik", { "2026-10": 2062900, "2026-11": 2062900 }],
  ["Egea Cross", "hatchback", "Limited", "Dizel", "1.6 Multijet 130 hp Traction+", "DCT otomatik", { "2026-10": 2099900, "2026-11": 2099900 }],
  ["Grande Panda", "hatchback", "La Prima", "Elektrik", "44 kWh 113 hp", "Otomatik", { "2026-10": 1584900, "2026-11": 1609900 }],
  ["500e", "hatchback", "Giorgio Armani", "Elektrik", "42 kWh 118 hp", "Otomatik", { "2026-10": 2379900, "2026-11": 2379900 }],
  ["Topolino", "hatchback", "Topolino", "Elektrik", "5.4 kWh 8 hp", "Otomatik", { "2026-10": 629900, "2026-11": 629900 }],
  ["Topolino", "hatchback", "Topolino Plus", "Elektrik", "5.4 kWh 8 hp", "Otomatik", { "2026-10": 654900, "2026-11": 654900 }],
  ["600", "suv", "La Prima", "Elektrik", "54 kWh", "Otomatik", { "2026-10": 1989900, "2026-11": 1989900 }],
];

export const fiat = {
  "2026-10": buildBrand("Fiat", rows, "2026-10", ["https://www.webtekno.com/ekim-2026-fiat-fiyat-listesi-h226429.html"]),
  "2026-11": buildBrand("Fiat", rows, "2026-11", ["https://webtekno.com/kasim-2026-fiat-fiyat-listesi-h228142.html"]),
};
