import { carCatalog } from "./cars";

export type Category = {
  slug: string;
  name: string;
  /** /icons.svg içindeki simge kimliği */
  icon: string;
  short: string;
  hint: string;
  /** Marka listesi. Model listesi yoksa kullanıcı modeli kendisi yazar. */
  brands: Record<string, string[]>;
  /** Yakıt/tüketim alanının etiketi; null ise sorulmaz. */
  usageLabel: string | null;
  usageUnit: string | null;
};

const carBrands = carCatalog;
const list = (names: string[]) => Object.fromEntries(names.map((n) => [n, [] as string[]]));

const suvBrands = list([
  "Audi", "BMW", "BYD", "Chery", "Chevrolet", "Citroën", "Dacia", "DFSK", "Ford", "Honda", "Hyundai", "Isuzu", "Jaecoo",
  "Jeep", "Kia", "Land Rover", "Lexus", "Mazda", "Mercedes-Benz", "MG", "Mitsubishi", "Nissan", "Omoda", "Opel",
  "Peugeot", "Porsche", "Renault", "Seat", "Skoda", "SsangYong", "Subaru", "Suzuki", "TOGG", "Toyota", "Volkswagen", "Volvo",
]);
const evBrands = list([
  "Audi", "BMW", "BYD", "Citroën", "Cupra", "Fiat", "Ford", "Hyundai", "Kia", "Leapmotor", "Mercedes-Benz", "MG",
  "Mini", "Nissan", "Opel", "Peugeot", "Polestar", "Porsche", "Renault", "Skoda", "Smart", "Tesla", "TOGG", "Volkswagen", "Volvo", "Zeekr",
]);
const motoBrands = list([
  "Aprilia", "Arora", "Bajaj", "Benelli", "BMW Motorrad", "CFMoto", "Ducati", "Harley-Davidson", "Hero", "Honda",
  "Husqvarna", "Kawasaki", "Keeway", "Kanuni", "KTM", "Kuba", "Mondial", "Moto Guzzi", "MV Agusta", "Piaggio",
  "Royal Enfield", "RKS", "Suzuki", "SYM", "Triumph", "TVS", "Vespa", "Voge", "Yamaha", "Yuki", "Zontes",
]);
const vanBrands = list([
  "Citroën", "Fiat", "Ford", "Hyundai", "Mercedes-Benz", "Nissan", "Opel", "Peugeot", "Renault", "Toyota", "Volkswagen",
]);
const commercialBrands = list([
  "BMC", "DAF", "Fiat", "Ford Trucks", "Isuzu", "Iveco", "Karsan", "MAN", "Mercedes-Benz", "Mitsubishi Fuso",
  "Otokar", "Renault Trucks", "Scania", "Temsa", "Volvo Trucks",
]);
const boatBrands = list([
  "Azimut", "Bavaria", "Bayliner", "Beneteau", "Brig", "Ferretti", "Highfield", "Jeanneau", "Lagoon", "Quicksilver",
  "Sea Ray", "Sea-Doo", "Yamaha WaveRunner", "Zodiac",
]);
const caravanBrands = list([
  "Adria", "Bürstner", "Carado", "Dethleffs", "Fendt", "Hobby", "Hymer", "Knaus", "Pössl", "Sun Living", "Weinsberg",
]);
const aircraftBrands = list([
  "Airbus Helicopters", "Bell", "Cessna", "Cirrus", "Diamond", "Piper", "Robinson", "Tecnam",
]);
const atvBrands = list(["Arctic Cat", "CFMoto", "Can-Am", "Honda", "Kawasaki", "Kymco", "Linhai", "Polaris", "Segway", "Suzuki", "TGB", "Yamaha"]);
const utvBrands = list(["Can-Am", "CFMoto", "Honda", "John Deere", "Kawasaki", "Kubota", "Linhai", "Polaris", "Segway", "Yamaha"]);
const farmBrands = list([
  "Antonio Carraro", "Başak", "Case IH", "Caterpillar", "Claas", "Deutz-Fahr", "Erkunt", "Fendt", "Hattat", "Hidromek",
  "JCB", "John Deere", "Komatsu", "Kubota", "Landini", "Massey Ferguson", "New Holland", "Same", "Tümosan",
]);

export const categories: Category[] = [
  { slug: "otomobil", icon: "otomobil", name: "Otomobil", short: "Otomobil", hint: "Hatchback, sedan, station wagon, coupe", brands: carBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "arazi-suv-pickup", icon: "suv", name: "Arazi, SUV ve Pickup", short: "SUV & Pickup", hint: "Crossover, SUV, arazi aracı, pickup", brands: suvBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "elektrikli", icon: "elektrikli", name: "Elektrikli Araçlar", short: "Elektrikli", hint: "Gerçek menzil, şarj süresi, batarya", brands: evBrands, usageLabel: "Gerçek menzil", usageUnit: "km" },
  { slug: "motosiklet", icon: "motosiklet", name: "Motosiklet", short: "Motosiklet", hint: "Scooter, naked, touring, enduro", brands: motoBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "minivan-panelvan", icon: "minivan", name: "Minivan ve Panelvan", short: "Minivan", hint: "Hafif ticari, aile minivanı, panelvan", brands: vanBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "ticari", icon: "ticari", name: "Ticari Araçlar", short: "Ticari", hint: "Kamyon, kamyonet, çekici, otobüs, minibüs", brands: commercialBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "kiralik", icon: "kiralik", name: "Kiralık Araçlar", short: "Kiralık", hint: "Kiraladığın aracı ve firmayı değerlendir", brands: carBrands, usageLabel: null, usageUnit: null },
  { slug: "deniz", icon: "deniz", name: "Deniz Araçları", short: "Deniz", hint: "Tekne, yat, jet ski, şişme bot", brands: boatBrands, usageLabel: "Saatlik yakıt tüketimi", usageUnit: "L/saat" },
  { slug: "hasarli", icon: "hasarli", name: "Hasarlı Araçlar", short: "Hasarlı", hint: "Hasar, onarım, sigorta ve ekspertiz deneyimi", brands: carBrands, usageLabel: null, usageUnit: null },
  { slug: "karavan", icon: "karavan", name: "Karavan", short: "Karavan", hint: "Motokaravan, çekme karavan", brands: caravanBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "klasik", icon: "klasik", name: "Klasik Araçlar", short: "Klasik", hint: "30 yaş üstü, restorasyon, parça bulma", brands: carBrands, usageLabel: null, usageUnit: null },
  { slug: "hava", icon: "hava", name: "Hava Araçları", short: "Hava", hint: "Uçak, helikopter, ultra hafif", brands: aircraftBrands, usageLabel: "Saatlik yakıt tüketimi", usageUnit: "L/saat" },
  { slug: "atv", icon: "atv", name: "ATV", short: "ATV", hint: "Dört tekerli arazi motosikleti", brands: atvBrands, usageLabel: null, usageUnit: null },
  { slug: "utv", icon: "utv", name: "UTV", short: "UTV", hint: "Yan yana oturmalı arazi aracı", brands: utvBrands, usageLabel: null, usageUnit: null },
  { slug: "engelli", icon: "engelli", name: "Engelli Plakalı Araçlar", short: "Engelli plakalı", hint: "ÖTV muafiyeti, adaptasyon, kullanım kolaylığı", brands: carBrands, usageLabel: "Ortalama yakıt tüketimi", usageUnit: "L/100 km" },
  { slug: "tarim-is-makineleri", icon: "tarim", name: "Tarım ve İş Makineleri", short: "Tarım & İş", hint: "Traktör, biçerdöver, iş makinesi", brands: farmBrands, usageLabel: "Saatlik yakıt tüketimi", usageUnit: "L/saat" },
];

const trMap: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u", ë: "e" };
export function slugify(value: string) {
  return value
    .replace(/[çğıİöşüÇĞÖŞÜë]/g, (c) => trMap[c] ?? c)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function brandBySlug(cat: Category, slug: string) {
  return Object.keys(cat.brands).find((b) => slugify(b) === slug);
}

export function modelsFor(cat: Category, brand: string) {
  return cat.brands[brand] ?? [];
}
