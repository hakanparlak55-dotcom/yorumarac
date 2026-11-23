// Peugeot binek fiyat listesi. Tavsiye edilen anahtar teslim liste fiyatları (TL). Kasım'da Ekim fiyatları korundu.
import { buildBrand, type PriceRow } from "./build";

const same = (p: number) => ({ "2026-10": p, "2026-11": p });
const rows: PriceRow[] = [
  ["E-208", "hatchback", "GT", "Elektrik", "100 kW", "Otomatik", same(2080000)],
  ["308", "hatchback", "Allure", "Dizel", "1.5 BlueHDi 130 hp", "EAT8 otomatik", same(2360000)],
  ["308", "hatchback", "GT", "Dizel", "1.5 BlueHDi 130 hp", "EAT8 otomatik", same(2695000)],
  ["2008", "suv", "Allure", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(2353000)],
  ["2008", "suv", "GT", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(2632000)],
  ["E-2008", "suv", "Allure", "Elektrik", "115 kW", "Otomatik", same(2245000)],
  ["E-2008", "suv", "GT", "Elektrik", "115 kW", "Otomatik", same(2400000)],
  ["408", "hatchback", "Allure", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(2685000)],
  ["408", "hatchback", "Allure Cam Tavan", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(2802000)],
  ["408", "hatchback", "GT", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(3028000)],
  ["3008", "suv", "Allure", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(2967000)],
  ["3008", "suv", "GT", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(3390000)],
  ["E-3008", "suv", "Allure", "Elektrik", "157 kW (210 hp)", "Otomatik", same(3384500)],
  ["E-3008", "suv", "GT", "Elektrik", "157 kW (210 hp)", "Otomatik", same(3585000)],
  ["5008", "suv", "Allure", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(3426000)],
  ["5008", "suv", "GT", "Hibrit", "1.2 Hybrid 145 hp", "eDCS6 otomatik", same(3750000)],
  ["E-5008", "suv", "Allure", "Elektrik", "157 kW (210 hp)", "Otomatik", same(3573500)],
  ["E-5008", "suv", "GT", "Elektrik", "157 kW (210 hp)", "Otomatik", same(3717000)],
];

export const peugeot = {
  "2026-10": buildBrand("Peugeot", rows, "2026-10", ["https://www.webtekno.com/ekim-2026-peugeot-fiyat-listesi-h226294.html"]),
  "2026-11": buildBrand("Peugeot", rows, "2026-11", ["https://www.webtekno.com/peugeot-kasim-2026-fiyat-listesi-h228200.html"]),
};
