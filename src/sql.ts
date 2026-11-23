import { env } from "./env.js";
// Küçük bir veritabanı katmanı: canlıda Neon (Postgres, HTTP), yerelde gömülü PGlite.
// Sorgular `?` yer tutucusuyla yazılır; burada Postgres'in `$1, $2…` biçimine çevrilir.

type Row = Record<string, unknown>;
type Exec = (text: string, params: unknown[]) => Promise<Row[]>;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY, category TEXT NOT NULL, brand TEXT NOT NULL, brand_slug TEXT NOT NULL,
    model TEXT NOT NULL, model_slug TEXT NOT NULL, year INTEGER, km INTEGER, nickname TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '', title TEXT NOT NULL, body TEXT NOT NULL, pros TEXT NOT NULL DEFAULT '',
    cons TEXT NOT NULL DEFAULT '', usage_value DOUBLE PRECISION, s_comfort INTEGER NOT NULL,
    s_economy INTEGER NOT NULL, s_reliability INTEGER NOT NULL, s_cost INTEGER NOT NULL, buy_again INTEGER,
    helpful INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'live', ip_hash TEXT NOT NULL DEFAULT '',
    created_at BIGINT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS reviews_model ON reviews (category, brand_slug, model_slug, status)`,
  `CREATE INDEX IF NOT EXISTS reviews_recent ON reviews (status, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY, category TEXT NOT NULL, brand TEXT NOT NULL, brand_slug TEXT NOT NULL,
    model TEXT NOT NULL, model_slug TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '',
    km INTEGER, nickname TEXT NOT NULL, me_too INTEGER NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'live',
    ip_hash TEXT NOT NULL DEFAULT '', created_at BIGINT NOT NULL)`,
  `CREATE INDEX IF NOT EXISTS issues_model ON issues (category, brand_slug, model_slug, status)`,
  // kind: 'helpful' (yorum), 'metoo' (sorun), 'again' (model: tekrar alır mısın). Bir cihaz bir hedefe bir oy.
  `CREATE TABLE IF NOT EXISTS votes (
    kind TEXT NOT NULL, target TEXT NOT NULL, voter TEXT NOT NULL, value INTEGER NOT NULL,
    created_at BIGINT NOT NULL, PRIMARY KEY (kind, target, voter))`,
  `CREATE INDEX IF NOT EXISTS votes_target ON votes (kind, target)`,
  `ALTER TABLE votes ADD COLUMN IF NOT EXISTS ip_hash TEXT NOT NULL DEFAULT ''`,
  `CREATE INDEX IF NOT EXISTS votes_ip ON votes (ip_hash, created_at)`,
  `CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY, kind TEXT NOT NULL, target_id INTEGER NOT NULL, reason TEXT NOT NULL DEFAULT '',
    voter TEXT NOT NULL, created_at BIGINT NOT NULL)`,
];

function toPg(sql: string) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

export class Stmt {
  constructor(private exec: () => Promise<Exec>, readonly sql: string, readonly params: unknown[] = []) {}
  bind(...params: unknown[]) { return new Stmt(this.exec, this.sql, params); }
  async rows() { return (await this.exec())(toPg(this.sql), this.params); }
  async all<T = Row>() { return { results: (await this.rows()) as T[] }; }
  async first<T = Row>() { return ((await this.rows())[0] ?? null) as T | null; }
  /** INSERT'lerde `RETURNING id` varsa eklenen satırın id'sini verir. */
  async run() { const r = await this.rows(); return { meta: { last_row_id: Number(r[0]?.id ?? 0) } }; }
}

export class Db {
  private ready: Promise<Exec> | null = null;
  constructor(private connect: () => Promise<Exec>) {}
  private exec = () => {
    if (!this.ready) {
      this.ready = (async () => {
        const run = await this.connect();
        for (const s of SCHEMA) await run(s, []);
        return run;
      })();
      this.ready.catch(() => { this.ready = null; });
    }
    return this.ready;
  };
  prepare(sql: string) { return new Stmt(this.exec, sql); }
  /** Sırayla çalıştırır; her ifadenin sonucunu döner. */
  async batch(stmts: Stmt[]) {
    const out: { results: Row[] }[] = [];
    for (const s of stmts) out.push(await s.all());
    return out;
  }
}

const normalize = (r: Row) => {
  for (const k in r) if (typeof r[k] === "bigint") r[k] = Number(r[k]);
  return r;
};

let instance: Db | null = null;

export function getDb(): Db {
  if (instance) return instance;
  const url = env("DATABASE_URL") ?? env("POSTGRES_URL");
  if (url) {
    instance = new Db(async () => {
      const { neon, types } = await import("@neondatabase/serverless");
      // int8 (COUNT, BIGINT) ve numeric (AVG) değerleri metin yerine sayı gelsin.
      const sql = neon(url, {
        types: { getTypeParser: ((oid: number, fmt?: "text" | "binary") => (oid === 20 || oid === 1700 ? Number : types.getTypeParser(oid, fmt))) as never },
      });
      return (text, params) => sql.query(text, params) as Promise<Row[]>;
    });
  } else {
    // Yalnızca yerel geliştirme: bağlantı adresi yoksa bellek içi / dosya tabanlı PGlite.
    instance = new Db(async () => {
      const mod = "@electric-sql/pglite";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { PGlite } = (await import(/* @vite-ignore */ mod)) as any;
      const pg = new PGlite(env("PGLITE_DIR") ?? undefined);
      return async (text, params) => ((await pg.query(text, params)) as { rows: Row[] }).rows.map(normalize);
    });
  }
  return instance;
}
