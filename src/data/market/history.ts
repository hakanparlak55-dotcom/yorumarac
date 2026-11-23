// Model bazında kasa geçmişi. Anahtar: kategori/marka-slug/model-slug
// Yıllar kasanın ilk satışa çıktığı yılı gösterir (Avrupa / Türkiye).
import type { ModelHistory } from "./types.js";

const wiki = (t: string) => `https://en.wikipedia.org/wiki/${t}`;

export const histories: ModelHistory[] = [
  {
    key: "otomobil/renault/clio",
    sources: [wiki("Renault_Clio"), "https://www.cnbce.com/otomotiv/renaultun-yeni-fiyat-listesi-aciklandi-bir-modelin-fiyati-150-bin-tl-artti-g40786"],
    generations: [
      { name: "Clio I", from: 1990, to: 1998, bodies: [{ body: "hatchback", label: "3 ve 5 kapı" }] },
      { name: "Clio II", from: 1998, to: 2005, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "sedan", label: "Symbol", year: 1999 }] },
      { name: "Clio III", from: 2005, to: 2012, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "stationwagon", label: "Grandtour", year: 2008 }] },
      { name: "Clio IV", from: 2012, to: 2019, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "stationwagon", label: "Sport Tourer", year: 2013 }] },
      { name: "Clio V", from: 2019, to: 2025, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "elektrikli", label: "E-Tech hibrit", year: 2020 }] },
      { name: "Clio VI", from: 2026, to: null, bodies: [{ body: "hatchback", label: "Hatchback" }] },
    ],
  },
  {
    key: "otomobil/fiat/egea",
    sources: [wiki("Fiat_Tipo_(2015)"), "https://www.turkiyegazetesi.com.tr/t-otomobil/fiat-agustos-ayi-fiyat-listesini-acikladi-egeaya-zamla-veda-1806793"],
    generations: [
      { name: "Egea", from: 2015, to: null, bodies: [{ body: "sedan", label: "Sedan" }, { body: "hatchback", label: "Hatchback", year: 2016 }, { body: "stationwagon", label: "Station Wagon", year: 2016 }, { body: "suv", label: "Cross", year: 2021 }] },
    ],
    events: [{ year: 2020, label: "Makyaj" }, { year: 2026, label: "Üretim bitti" }],
  },
  {
    key: "otomobil/toyota/corolla",
    sources: [wiki("Toyota_Corolla")],
    generations: [
      { name: "E10", from: 1966, to: 1970, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E20", from: 1970, to: 1974, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E30", from: 1974, to: 1979, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E70", from: 1979, to: 1983, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E80", from: 1983, to: 1987, bodies: [{ body: "hatchback", label: "Önden çekiş" }] },
      { name: "E90", from: 1987, to: 1991, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E100", from: 1991, to: 1995, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E110", from: 1995, to: 2000, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E120", from: 2000, to: 2006, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E150", from: 2006, to: 2012, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E170", from: 2013, to: 2018, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "E210", from: 2018, to: null, bodies: [{ body: "sedan", label: "Sedan" }, { body: "hatchback", label: "Hatchback" }, { body: "elektrikli", label: "Hibrit" }] },
    ],
  },
  {
    key: "otomobil/volkswagen/golf",
    sources: [wiki("Volkswagen_Golf")],
    generations: [
      { name: "Golf I", from: 1974, to: 1983, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "Golf II", from: 1983, to: 1991, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "Golf III", from: 1991, to: 1997, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "stationwagon", label: "Variant", year: 1993 }] },
      { name: "Golf IV", from: 1997, to: 2003, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "stationwagon", label: "Variant" }] },
      { name: "Golf V", from: 2003, to: 2008, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "Golf VI", from: 2008, to: 2012, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "Golf VII", from: 2012, to: 2019, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "stationwagon", label: "Variant", year: 2013 }] },
      { name: "Golf VIII", from: 2019, to: null, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "stationwagon", label: "Variant", year: 2020 }] },
    ],
  },
  {
    key: "otomobil/volkswagen/passat",
    sources: [wiki("Volkswagen_Passat")],
    generations: [
      { name: "B1", from: 1973, to: 1980, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "B2", from: 1980, to: 1988, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "B3", from: 1988, to: 1993, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "B4", from: 1993, to: 1996, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "B5", from: 1996, to: 2005, bodies: [{ body: "sedan", label: "Sedan" }, { body: "stationwagon", label: "Variant" }] },
      { name: "B6", from: 2005, to: 2010, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "B7", from: 2010, to: 2014, bodies: [{ body: "sedan", label: "Sedan" }] },
      { name: "B8", from: 2014, to: 2023, bodies: [{ body: "sedan", label: "Sedan" }, { body: "stationwagon", label: "Variant" }] },
      { name: "B9", from: 2023, to: null, bodies: [{ body: "stationwagon", label: "Sadece Variant" }] },
    ],
  },
  {
    key: "otomobil/volkswagen/tiguan",
    sources: [wiki("Volkswagen_Tiguan")],
    generations: [
      { name: "Tiguan I", from: 2007, to: 2016, bodies: [{ body: "suv", label: "SUV" }] },
      { name: "Tiguan II", from: 2016, to: 2023, bodies: [{ body: "suv", label: "SUV" }, { body: "suv", label: "Allspace (7 koltuk)", year: 2017 }] },
      { name: "Tiguan III", from: 2023, to: null, bodies: [{ body: "suv", label: "SUV" }] },
    ],
  },
  {
    key: "otomobil/hyundai/i20",
    sources: [wiki("Hyundai_i20")],
    generations: [
      { name: "i20 I", from: 2008, to: 2014, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "i20 II", from: 2014, to: 2020, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "suv", label: "Active", year: 2015 }] },
      { name: "i20 III", from: 2020, to: null, bodies: [{ body: "hatchback", label: "Hatchback" }] },
    ],
  },
  {
    key: "otomobil/hyundai/tucson",
    sources: [wiki("Hyundai_Tucson")],
    generations: [
      { name: "Tucson I", from: 2004, to: 2009, bodies: [{ body: "suv", label: "SUV" }] },
      { name: "ix35", from: 2009, to: 2015, bodies: [{ body: "suv", label: "SUV" }] },
      { name: "Tucson III", from: 2015, to: 2020, bodies: [{ body: "suv", label: "SUV" }] },
      { name: "Tucson IV", from: 2020, to: null, bodies: [{ body: "suv", label: "SUV" }, { body: "elektrikli", label: "Hibrit" }] },
    ],
  },
  {
    key: "otomobil/dacia/sandero",
    sources: [wiki("Dacia_Sandero")],
    generations: [
      { name: "Sandero I", from: 2008, to: 2012, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "suv", label: "Stepway", year: 2009 }] },
      { name: "Sandero II", from: 2012, to: 2020, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "suv", label: "Stepway" }] },
      { name: "Sandero III", from: 2020, to: null, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "suv", label: "Stepway" }] },
    ],
  },
  {
    key: "otomobil/toyota/c-hr",
    sources: [wiki("Toyota_C-HR")],
    generations: [
      { name: "C-HR I", from: 2016, to: 2023, bodies: [{ body: "suv", label: "Crossover" }, { body: "elektrikli", label: "Hibrit" }] },
      { name: "C-HR II", from: 2023, to: null, bodies: [{ body: "suv", label: "Crossover" }, { body: "elektrikli", label: "Hibrit" }] },
    ],
  },
  {
    key: "otomobil/toyota/yaris",
    sources: [wiki("Toyota_Yaris")],
    generations: [
      { name: "XP10", from: 1999, to: 2005, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "XP90", from: 2005, to: 2011, bodies: [{ body: "hatchback", label: "Hatchback" }] },
      { name: "XP130", from: 2011, to: 2020, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "elektrikli", label: "Hibrit", year: 2012 }] },
      { name: "XP210", from: 2020, to: null, bodies: [{ body: "hatchback", label: "Hatchback" }, { body: "elektrikli", label: "Hibrit" }] },
    ],
  },
  {
    key: "otomobil/peugeot/3008",
    sources: [wiki("Peugeot_3008")],
    generations: [
      { name: "3008 I", from: 2009, to: 2016, bodies: [{ body: "minivan", label: "Crossover" }] },
      { name: "3008 II", from: 2016, to: 2023, bodies: [{ body: "suv", label: "SUV" }] },
      { name: "3008 III", from: 2024, to: null, bodies: [{ body: "suv", label: "SUV coupe" }, { body: "elektrikli", label: "E-3008" }] },
    ],
  },
  {
    key: "otomobil/peugeot/2008",
    sources: [wiki("Peugeot_2008")],
    generations: [
      { name: "2008 I", from: 2013, to: 2019, bodies: [{ body: "suv", label: "Crossover" }] },
      { name: "2008 II", from: 2019, to: null, bodies: [{ body: "suv", label: "Crossover" }, { body: "elektrikli", label: "E-2008" }] },
    ],
  },
  {
    key: "otomobil/togg/t10x",
    sources: [wiki("Togg_T10X")],
    generations: [
      { name: "T10X", from: 2023, to: null, bodies: [{ body: "suv", label: "Elektrikli SUV" }] },
    ],
  },
];

export const historyFor = (key: string) => histories.find((h) => h.key === key) ?? null;
