export type Body = "hatchback" | "sedan" | "stationwagon" | "suv" | "pickup" | "minivan" | "ticari" | "coupe";
export type Fuel = "Benzin" | "Dizel" | "Hibrit" | "Plug-in hibrit" | "Elektrik" | "LPG";

export type TrimPrice = {
  /** Paket / donanım adı, listede yazdığı gibi */
  trim: string;
  /** Motor: "1.0 TCe 115 hp" gibi */
  engine: string;
  fuel: Fuel;
  /** "Manuel", "EDC otomatik", "e-CVT" gibi */
  gearbox: string;
  /** Tavsiye edilen anahtar teslim liste fiyatı (TL) */
  price: number;
};

export type ModelPrices = {
  model: string;
  body: Body;
  /** Sitedeki kategori; yoksa "otomobil" */
  category?: string;
  trims: TrimPrice[];
};

export type BrandPrices = {
  brand: string;
  /** Fiyatların alındığı kaynak sayfa(lar) */
  sources: string[];
  models: ModelPrices[];
};

export type MonthPrices = {
  /** "2026-11" */
  month: string;
  brands: BrandPrices[];
};

export type GenBody = { body: Body | "elektrikli"; label: string; year?: number };
export type Generation = { name: string; from: number; to: number | null; bodies: GenBody[] };
export type ModelHistory = {
  /** kategori/marka-slug/model-slug */
  key: string;
  generations: Generation[];
  /** Makyaj vb. ara olaylar */
  events?: { year: number; label: string }[];
  sources: string[];
};
