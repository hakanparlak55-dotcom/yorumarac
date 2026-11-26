import type { Db } from "./sql.js";

export type Review = {
  id: number; category: string; brand: string; brand_slug: string; model: string; model_slug: string;
  year: number | null; km: number | null; nickname: string; city: string; title: string; body: string;
  pros: string; cons: string; usage_value: number | null; s_comfort: number; s_economy: number;
  s_reliability: number; s_cost: number; buy_again: number | null; helpful: number; created_at: number;
};
export type Issue = {
  id: number; category: string; brand: string; brand_slug: string; model: string; model_slug: string;
  title: string; body: string; km: number | null; nickname: string; me_too: number; created_at: number;
};
export type ModelStats = {
  reviews: number; comfort: number | null; economy: number | null; reliability: number | null; cost: number | null;
  usage: number | null; usageCount: number; againYes: number; againNo: number;
  /** "Sende var mı?" cevapları. */
  ownerYes: number; ownerNo: number;
  /** "Alır mıydın?" cevaplarından aracı olduğunu söyleyenlerinki. */
  ownersBuyYes: number; ownersBuyTotal: number;
};

export const modelKey = (category: string, brandSlug: string, modelSlug: string) => `${category}/${brandSlug}/${modelSlug}`;
export const now = () => Math.floor(Date.now() / 1000);

export async function recentReviews(db: Db, limit = 12, category?: string) {
  const sql = category
    ? "SELECT * FROM ya_reviews WHERE status='live' AND category=? ORDER BY created_at DESC LIMIT ?"
    : "SELECT * FROM ya_reviews WHERE status='live' ORDER BY created_at DESC LIMIT ?";
  const stmt = category ? db.prepare(sql).bind(category, limit) : db.prepare(sql).bind(limit);
  return (await stmt.all<Review>()).results;
}

export async function modelReviews(db: Db, cat: string, b: string, m: string, sort: "yeni" | "faydali") {
  const order = sort === "faydali" ? "helpful DESC, created_at DESC" : "created_at DESC";
  return (await db.prepare(`SELECT * FROM ya_reviews WHERE status='live' AND category=? AND brand_slug=? AND model_slug=? ORDER BY ${order} LIMIT 100`).bind(cat, b, m).all<Review>()).results;
}

export async function modelIssues(db: Db, cat: string, b: string, m: string) {
  return (await db.prepare("SELECT * FROM ya_issues WHERE status='live' AND category=? AND brand_slug=? AND model_slug=? ORDER BY me_too DESC, created_at DESC LIMIT 50").bind(cat, b, m).all<Issue>()).results;
}

export async function topIssues(db: Db, limit = 6) {
  return (await db.prepare("SELECT * FROM ya_issues WHERE status='live' ORDER BY me_too DESC, created_at DESC LIMIT ?").bind(limit).all<Issue>()).results;
}

export async function modelStats(db: Db, cat: string, b: string, m: string): Promise<ModelStats> {
  const [agg, poll] = await db.batch([
    db.prepare(`SELECT COUNT(*)::int AS reviews, AVG(s_comfort)::float8 AS comfort, AVG(s_economy)::float8 AS economy, AVG(s_reliability)::float8 AS reliability, AVG(s_cost)::float8 AS cost, AVG(usage_value)::float8 AS usage, COUNT(usage_value)::int AS "usageCount" FROM ya_reviews WHERE status='live' AND category=? AND brand_slug=? AND model_slug=?`).bind(cat, b, m),
    pollQuery(db, modelKey(cat, b, m)),
  ]);
  const a = (agg.results[0] ?? {}) as Record<string, number | null>;
  return {
    reviews: Number(a.reviews ?? 0), comfort: a.comfort ?? null, economy: a.economy ?? null, reliability: a.reliability ?? null,
    cost: a.cost ?? null, usage: a.usage ?? null, usageCount: Number(a.usageCount ?? 0), ...pollCounts(poll.results),
  };
}

/** İki soru: 'owner' (sende var mı?) ve 'again' (alır mıydın?). Aynı cihazın iki cevabı eşleştirilir. */
function pollQuery(db: Db, key: string) {
  return db.prepare(
    `SELECT 'owner' AS q, value AS v, -1 AS owner, COUNT(*)::int AS n FROM ya_votes WHERE kind='owner' AND target=? GROUP BY value
     UNION ALL
     SELECT 'again', a.value, COALESCE(o.value, -1), COUNT(*)::int FROM ya_votes a
       LEFT JOIN ya_votes o ON o.kind='owner' AND o.target=a.target AND o.voter=a.voter
       WHERE a.kind='again' AND a.target=? GROUP BY a.value, o.value`,
  ).bind(key, key);
}

function pollCounts(rows: Record<string, unknown>[]) {
  const out = { againYes: 0, againNo: 0, ownerYes: 0, ownerNo: 0, ownersBuyYes: 0, ownersBuyTotal: 0 };
  for (const r of rows) {
    const v = Number(r.v), n = Number(r.n), owner = Number(r.owner);
    if (r.q === "owner") { if (v === 1) out.ownerYes += n; else out.ownerNo += n; continue; }
    if (v === 1) out.againYes += n; else out.againNo += n;
    if (owner === 1) { out.ownersBuyTotal += n; if (v === 1) out.ownersBuyYes += n; }
  }
  return out;
}

export async function pollStats(db: Db, key: string) {
  return pollCounts((await pollQuery(db, key).all()).results);
}

/** Kategori içindeki marka başına yorum sayısı. */
export async function brandCounts(db: Db, cat: string) {
  const rows = (await db.prepare("SELECT brand_slug AS slug, COUNT(*)::int AS n FROM ya_reviews WHERE status='live' AND category=? GROUP BY brand_slug").bind(cat).all<{ slug: string; n: number }>()).results;
  return Object.fromEntries(rows.map((r) => [r.slug, r.n]));
}

/** Marka içindeki model başına yorum sayısı ve sitede görülen serbest model adları. */
export async function modelCounts(db: Db, cat: string, b: string) {
  const rows = (await db.prepare("SELECT MIN(model) AS model, model_slug AS slug, COUNT(*)::int AS n FROM ya_reviews WHERE status='live' AND category=? AND brand_slug=? GROUP BY model_slug").bind(cat, b).all<{ model: string; slug: string; n: number }>()).results;
  return rows;
}

export async function categoryCounts(db: Db) {
  const rows = (await db.prepare("SELECT category AS slug, COUNT(*)::int AS n FROM ya_reviews WHERE status='live' GROUP BY category").all<{ slug: string; n: number }>()).results;
  return Object.fromEntries(rows.map((r) => [r.slug, r.n]));
}

export async function siteTotals(db: Db) {
  const [r, i, v] = await db.batch([
    db.prepare("SELECT COUNT(*)::int AS n FROM ya_reviews WHERE status='live'"),
    db.prepare("SELECT COUNT(*)::int AS n FROM ya_issues WHERE status='live'"),
    db.prepare("SELECT COUNT(*)::int AS n FROM ya_votes"),
  ]);
  const n = (x: { results: unknown[] }) => Number((x.results[0] as { n: number } | undefined)?.n ?? 0);
  return { reviews: n(r), issues: n(i), votes: n(v) };
}

/** "Tekrar alır mısın" oylarında en çok oy alan modeller. */
export async function againBoard(db: Db, limit = 6) {
  return (await db.prepare("SELECT target, SUM(CASE WHEN value=1 THEN 1 ELSE 0 END)::int AS yes, COUNT(*)::int AS total FROM ya_votes WHERE kind='again' GROUP BY target ORDER BY total DESC LIMIT ?").bind(limit).all<{ target: string; yes: number; total: number }>()).results;
}

/** Bu cihazın verdiği oylar: hedef → değer. */
export async function myVotes(db: Db, voter: string, kind: string, targets: string[]) {
  if (!targets.length) return {} as Record<string, number>;
  const marks = targets.map(() => "?").join(",");
  const rows = (await db.prepare(`SELECT target, value FROM ya_votes WHERE kind=? AND voter=? AND target IN (${marks})`).bind(kind, voter, ...targets).all<{ target: string; value: number }>()).results;
  return Object.fromEntries(rows.map((r) => [r.target, r.value]));
}
