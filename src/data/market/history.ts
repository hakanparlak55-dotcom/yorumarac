// Model bazında kasa geçmişi. Anahtar: kategori/marka-slug/model-slug
import type { ModelHistory } from "./types";
export const histories: ModelHistory[] = [];
export const historyFor = (key: string) => histories.find((h) => h.key === key) ?? null;
