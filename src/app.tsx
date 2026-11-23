import { Hono, type Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import type { Child } from "hono/jsx";
import {
  againBoard, brandCounts, categoryCounts, modelCounts, modelIssues, modelKey, modelReviews,
  modelStats, myVotes, now, recentReviews, siteTotals, topIssues,
} from "./db";
import { type Db, getDb } from "./sql";
import { checkForm, formStamp, sameOrigin, securityHeaders } from "./security";
import { currentMonth, modelRows, monthLabel, movers, rows as marketRows, sources as marketSources } from "./data/market";
import { historyFor } from "./data/market/history";
import { brandBySlug, categories, categoryBySlug, modelsFor, slugify } from "./data/categories";
import { Layout, ORIGIN, SITE } from "./views/layout";
import {
  BrandPage, CategoriesPage, CategoryPage, Home, ListPage, ModelPage, SearchPage, TextPage, WritePage,
} from "./views/pages";
import { MarketPage } from "./views/market";

type C = Context<{ Variables: { voter: string } }>;
const app = new Hono<{ Variables: { voter: string } }>();

app.use("*", securityHeaders);
app.use("*", sameOrigin);

// Her ziyaretçiye anonim bir cihaz kimliği: aynı oyun tekrar verilmesini engeller.
app.use("*", async (c, next) => {
  let voter = getCookie(c, "ya_id");
  if (!voter || !/^[0-9a-f-]{36}$/.test(voter)) {
    voter = crypto.randomUUID();
    setCookie(c, "ya_id", voter, { path: "/", httpOnly: true, secure: true, sameSite: "Lax", maxAge: 60 * 60 * 24 * 400 });
  }
  c.set("voter", voter);
  await next();
});

const flashes: Record<string, string> = {
  yorum: "Deneyimin yayımlandı. Teşekkürler!",
  sorun: "Sorun bildirildi. Aynı sorunu yaşayanlar artık “Ben de yaşadım” diyebilir.",
};

function page(c: C, title: string, path: string, body: Child, opts: { description?: string; status?: number; noindex?: boolean } = {}) {
  const flash = flashes[c.req.query("ok") ?? ""];
  return c.html(<Layout title={title} path={path} description={opts.description} flash={flash} noindex={opts.noindex}>{body}</Layout>, (opts.status ?? 200) as 200);
}

function notFound(c: C) {
  return page(c, "Sayfa bulunamadı", c.req.path, (
    <div class="wrap page narrow">
      <h1 class="page-h">Bu sayfa yok</h1>
      <p class="page-lead">Adres yanlış yazılmış ya da araç sayfası henüz açılmamış olabilir. Aradığın aracı aramayla bul.</p>
      <p><a class="btn btn-blue" href="/ara">Araç ara</a></p>
    </div>
  ), { status: 404, noindex: true });
}

async function ipHash(c: C) {
  const ip = (c.req.header("x-forwarded-for") ?? "local").split(",")[0].trim();
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("yorumarac:" + ip));
  return [...new Uint8Array(buf)].slice(0, 12).map((x) => x.toString(16).padStart(2, "0")).join("");
}

const clean = (v: unknown, max: number) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/[ \t]+/g, " ").trim().slice(0, max);
const intOrNull = (v: unknown, min: number, max: number) => {
  const n = parseInt(String(v ?? "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};
const floatOrNull = (v: unknown, min: number, max: number) => {
  const n = parseFloat(String(v ?? "").replace(",", ".").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n >= min && n <= max ? Math.round(n * 10) / 10 : null;
};
const score = (v: unknown) => { const n = intOrNull(v, 1, 5); return n ?? 0; };
const linkCount = (s: string) => (s.match(/https?:\/\/|www\./gi) ?? []).length;

/** Kategori+marka+model slug'ından görünen adları çöz. Katalogda yoksa siteye yazılmış kayıtlardan bul. */
async function resolveModel(db: Db, catSlug: string, bSlug: string, mSlug: string) {
  const cat = categoryBySlug(catSlug);
  if (!cat) return null;
  const brand = brandBySlug(cat, bSlug);
  if (!brand) return null;
  const fromCatalog = modelsFor(cat, brand).find((m) => slugify(m) === mSlug);
  if (fromCatalog) return { cat, brand, model: fromCatalog };
  const fromMarket = marketRows.find((r) => r.category === catSlug && slugify(r.brand) === bSlug && slugify(r.model) === mSlug);
  if (fromMarket) return { cat, brand, model: fromMarket.model };
  const row = await db.prepare("SELECT model FROM reviews WHERE category=? AND brand_slug=? AND model_slug=? AND status='live' UNION SELECT model FROM issues WHERE category=? AND brand_slug=? AND model_slug=? AND status='live' LIMIT 1").bind(catSlug, bSlug, mSlug, catSlug, bSlug, mSlug).first<{ model: string }>();
  return row ? { cat, brand, model: row.model } : null;
}

async function boardWithNames(db: Db) {
  const rows = await againBoard(db, 6);
  const out = [];
  for (const r of rows) {
    const [cat, b, m] = r.target.split("/");
    const res = await resolveModel(db, cat, b, m);
    if (res) out.push({ ...r, name: `${res.brand} ${res.model}` });
  }
  return out;
}

// ---------- Sayfalar ----------

app.get("/", async (c) => {
  const db = getDb();
  const [latest, issues, board, counts, totals] = await Promise.all([
    recentReviews(db, 6), topIssues(db, 5), boardWithNames(db), categoryCounts(db), siteTotals(db),
  ]);
  const voter = c.get("voter");
  const [helpfulMine, metooMine] = await Promise.all([
    myVotes(db, voter, "helpful", latest.map((r) => String(r.id))),
    myVotes(db, voter, "metoo", issues.map((i) => String(i.id))),
  ]);
  return page(c, SITE, "/", <Home latest={latest} issues={issues} board={board} counts={counts} totals={totals} helpfulMine={helpfulMine} metooMine={metooMine} />);
});

app.get("/kategoriler", async (c) => page(c, "Araç kategorileri", "/kategoriler", <CategoriesPage counts={await categoryCounts(getDb())} />));

app.get("/son-yorumlar", async (c) => {
  const reviews = await recentReviews(getDb(), 40);
  const mine = await myVotes(getDb(), c.get("voter"), "helpful", reviews.map((r) => String(r.id)));
  return page(c, "Son deneyimler", "/son-yorumlar", <ListPage title="Son deneyimler" lead="Tüm kategorilerde en son yazılan sürücü deneyimleri." reviews={reviews} helpfulMine={mine} />);
});

app.get("/kronik-sorunlar", async (c) => {
  const issues = await topIssues(getDb(), 60);
  const mine = await myVotes(getDb(), c.get("voter"), "metoo", issues.map((i) => String(i.id)));
  return page(c, "Kronik sorunlar", "/kronik-sorunlar", <ListPage title="Kronik sorunlar" lead="Sahiplerin bildirdiği ve en çok kişinin “Ben de yaşadım” dediği sorunlar." issues={issues} metooMine={mine} />, { description: "Araç sahiplerinin bildirdiği kronik sorunlar ve arızalar, kaç kişinin aynı sorunu yaşadığıyla birlikte." });
});

app.get("/ara", async (c) => {
  const q = clean(c.req.query("q"), 60);
  const needle = q.toLocaleLowerCase("tr");
  const hits: { cat: (typeof categories)[number]; brand: string; model?: string; href: string }[] = [];
  if (needle.length >= 2) {
    const seen = new Set<string>();
    const carBrands = categories[0].brands;
    for (const cat of categories) {
      // Kiralık, hasarlı, klasik ve engelli plakalı otomobil kataloğunu paylaşır; aramada tekrar etmesin.
      if (cat !== categories[0] && cat.brands === carBrands) continue;
      for (const [brand, models] of Object.entries(cat.brands)) {
        const bl = brand.toLocaleLowerCase("tr");
        const bs = slugify(brand);
        if (bl.includes(needle) && !seen.has(cat.slug + bs)) { seen.add(cat.slug + bs); hits.push({ cat, brand, href: `/${cat.slug}/${bs}` }); }
        for (const m of models) {
          const full = `${bl} ${m.toLocaleLowerCase("tr")}`;
          if (full.includes(needle) || m.toLocaleLowerCase("tr").includes(needle)) hits.push({ cat, brand, model: m, href: `/${cat.slug}/${bs}/${slugify(m)}` });
        }
      }
    }
    const extra = (await getDb().prepare("SELECT DISTINCT category, brand, brand_slug, model, model_slug FROM reviews WHERE status='live' AND (lower(brand || ' ' || model) LIKE ?) LIMIT 30").bind(`%${needle}%`).all<{ category: string; brand: string; brand_slug: string; model: string; model_slug: string }>()).results;
    for (const e of extra) {
      const href = `/${e.category}/${e.brand_slug}/${e.model_slug}`;
      const cat = categoryBySlug(e.category);
      if (cat && !hits.some((h) => h.href === href)) hits.push({ cat, brand: e.brand, model: e.model, href });
    }
    // Otomobil sonuçları önce, sonra kısa eşleşmeler.
    hits.sort((a, b) => categories.indexOf(a.cat) - categories.indexOf(b.cat));
  }
  if (hits.length === 1) return c.redirect(hits[0].href, 302);
  return page(c, q ? `${q} araması` : "Araç ara", "/ara", <SearchPage q={q} hits={hits.slice(0, 80)} />, { noindex: true });
});

app.get("/yorum-yaz", async (c) => {
  const cat = categoryBySlug(c.req.query("kategori") ?? "") ?? categories[0];
  const brandQ = c.req.query("marka") ?? "";
  const brand = Object.keys(cat.brands).find((b) => b === brandQ) ?? "";
  const model = brand ? clean(c.req.query("model"), 60) : "";
  return page(c, "Deneyimini yaz", "/yorum-yaz", <WritePage cat={cat} brand={brand} model={model} formTime={await formStamp()} />, { noindex: true });
});

app.get("/kurallar", (c) => page(c, "Topluluk kuralları", "/kurallar", <TextPage title="Topluluk kuralları" paras={[
  "Sadece kendi kullandığın ya da kullandığın dönemde yakından bildiğin araçları anlat. Duyduklarını değil, yaşadıklarını yaz.",
  "Hakaret, kişisel bilgi (telefon, plaka, adres), reklam ve bağlantı içeren içerikler kaldırılır. Bir firmayı ya da servisi eleştirebilirsin; iftira ve kanıtsız suçlama yapma.",
  "Aynı aracı tekrar tekrar yorumlama, oy toplamak için sahte deneyim yazma. Bu tür kayıtlar uyarısız silinir.",
  "Uygunsuz bulduğun bir içeriği “Bildir” düğmesiyle bize ilet. Bildirimler incelenir.",
]} />));

app.get("/gizlilik", (c) => page(c, "Gizlilik ve KVKK", "/gizlilik", <TextPage title="Gizlilik ve KVKK" paras={[
  "YorumAraç üyelik istemez. Yazdığın deneyim, sorun bildirimi ve rumuzun herkese açık olarak yayımlanır. Gerçek adını, telefonunu ya da plakanı yazma.",
  "Aynı cihazdan tekrar oy verilmesini engellemek için tarayıcına rastgele bir kimlik çerezi (ya_id) yerleştirilir. Bu çerez seni kişisel olarak tanımlamaz.",
  "Spam ve kötüye kullanımı önlemek için IP adresin tek yönlü olarak şifrelenir (hash) ve yalnızca bu amaçla saklanır; açık IP adresi kaydedilmez.",
  "Yayımlanan bir içeriğinin kaldırılmasını istersen merhaba@yorumarac.com adresine yaz; içeriğin bağlantısını ekle.",
]} />));

app.get("/robots.txt", (c) => c.text(`User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${ORIGIN}/sitemap.xml\n`));

app.get("/sitemap.xml", async (c) => {
  const urls = new Set<string>(["/", "/kategoriler", "/son-yorumlar", "/kronik-sorunlar"]);
  for (const cat of categories) urls.add(`/${cat.slug}`);
  const rows = (await getDb().prepare("SELECT DISTINCT category, brand_slug, model_slug FROM reviews WHERE status='live'").all<{ category: string; brand_slug: string; model_slug: string }>()).results;
  for (const r of rows) { urls.add(`/${r.category}/${r.brand_slug}`); urls.add(`/${r.category}/${r.brand_slug}/${r.model_slug}`); }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map((u) => `<url><loc>${ORIGIN}${u}</loc></url>`).join("\n")}\n</urlset>`;
  return c.body(body, 200, { "content-type": "application/xml; charset=utf-8" });
});

// ---------- Formlar ----------

app.post("/yorum", async (c) => {
  const f = Object.fromEntries((await c.req.formData()).entries()) as Record<string, string>;
  const cat = categoryBySlug(f.kategori ?? "") ?? categories[0];
  const brand = Object.keys(cat.brands).find((b) => b === f.marka) ?? "";
  const model = clean(f.model === "__diger" ? f.model_serbest : f.model, 60);
  const formTime = await formStamp();
  const fail = (msg: string) => page(c, "Deneyimini yaz", "/yorum-yaz", <WritePage cat={cat} brand={brand} model={model} error={msg} values={f} formTime={formTime} />, { status: 400, noindex: true });
  const guard = await checkForm(f);
  if (guard === "bot") return c.redirect("/?ok=yorum", 303); // bota başarılı gibi görün
  if (guard === "expired") return fail("Formun süresi doldu. Bilgilerin duruyor, tekrar gönder.");
  if (!brand) return fail("Markayı listeden seç.");
  if (model.length < 1) return fail("Modeli seç ya da adını yaz.");
  const title = clean(f.baslik, 90), body = clean(f.metin, 4000).replace(/\r/g, "");
  if (title.length < 8) return fail("Özet cümlesi en az 8 karakter olmalı.");
  if (body.length < 60) return fail("Deneyimin en az 60 karakter olmalı. Biraz daha anlatır mısın?");
  const nick = clean(f.rumuz, 30);
  if (nick.length < 2) return fail("Bir rumuz yaz.");
  const s = [score(f.p_konfor), score(f.p_ekonomi), score(f.p_saglamlik), score(f.p_maliyet)];
  if (s.some((x) => !x)) return fail("Dört başlığın hepsine 1 ile 5 arasında puan ver.");
  if (f.tekrar !== "1" && f.tekrar !== "0") return fail("Tekrar alır mıydın sorusunu cevapla.");
  if (!f.onay) return fail("Kuralları onaylaman gerekiyor.");
  if (linkCount(body + title + (f.artilar ?? "") + (f.eksiler ?? "")) > 0) return fail("Deneyimlere bağlantı eklenemez.");
  const ip = await ipHash(c);
  const recent = await getDb().prepare("SELECT COUNT(*)::int AS n FROM reviews WHERE ip_hash=? AND created_at>?").bind(ip, now() - 3600).first<{ n: number }>();
  if ((recent?.n ?? 0) >= 5) return fail("Kısa sürede çok fazla deneyim gönderildi. Biraz sonra tekrar dene.");
  const bSlug = slugify(brand), mSlug = slugify(model) || "model";
  const year = intOrNull(f.yil, 1900, new Date().getFullYear() + 1);
  const km = intOrNull(f.km, 0, 5_000_000);
  const usage = cat.usageLabel ? floatOrNull(f.tuketim, 0.1, 2000) : null;
  const res = await getDb().prepare(
    "INSERT INTO reviews (category,brand,brand_slug,model,model_slug,year,km,nickname,city,title,body,pros,cons,usage_value,s_comfort,s_economy,s_reliability,s_cost,buy_again,ip_hash,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id",
  ).bind(cat.slug, brand, bSlug, model, mSlug, year, km, nick, clean(f.sehir, 30), title, body, clean(f.artilar, 500), clean(f.eksiler, 500), usage, s[0], s[1], s[2], s[3], Number(f.tekrar), ip, now()).run();
  // Yorumdaki "tekrar alırım" cevabı model oyuna da sayılır.
  await getDb().prepare("INSERT INTO votes (kind,target,voter,value,created_at) VALUES ('again',?,?,?,?) ON CONFLICT(kind,target,voter) DO UPDATE SET value=excluded.value").bind(modelKey(cat.slug, bSlug, mSlug), c.get("voter"), Number(f.tekrar), now()).run();
  return c.redirect(`/${cat.slug}/${bSlug}/${mSlug}?ok=yorum#yorum-${res.meta.last_row_id}`, 303);
});

app.post("/sorun", async (c) => {
  const f = Object.fromEntries((await c.req.formData()).entries()) as Record<string, string>;
  const cat = categoryBySlug(f.kategori ?? "");
  const brand = cat ? Object.keys(cat.brands).find((b) => b === f.marka) : undefined;
  const model = clean(f.model, 60);
  if (!cat || !brand || !model) return notFound(c);
  const bSlug = slugify(brand), mSlug = slugify(model);
  const back = `/${cat.slug}/${bSlug}/${mSlug}`;
  if (await checkForm(f)) return c.redirect(back + "#sorun-bildir", 303);
  const title = clean(f.baslik, 90), nick = clean(f.rumuz, 30), body = clean(f.aciklama, 600);
  if (title.length < 6 || nick.length < 2 || !f.onay || linkCount(title + body) > 0) return c.redirect(back + "#sorun-bildir", 303);
  const ip = await ipHash(c);
  const recent = await getDb().prepare("SELECT COUNT(*)::int AS n FROM issues WHERE ip_hash=? AND created_at>?").bind(ip, now() - 3600).first<{ n: number }>();
  if ((recent?.n ?? 0) >= 8) return c.redirect(back, 303);
  const res = await getDb().prepare("INSERT INTO issues (category,brand,brand_slug,model,model_slug,title,body,km,nickname,ip_hash,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?) RETURNING id").bind(cat.slug, brand, bSlug, model, mSlug, title, body, intOrNull(f.km, 0, 5_000_000), nick, ip, now()).run();
  await getDb().prepare("INSERT INTO votes (kind,target,voter,value,created_at) VALUES ('metoo',?,?,1,?) ON CONFLICT DO NOTHING").bind(String(res.meta.last_row_id), c.get("voter"), now()).run();
  return c.redirect(`${back}?ok=sorun#sorun-${res.meta.last_row_id}`, 303);
});

// ---------- API ----------

const jsonOnly = (c: C) => (c.req.header("content-type") ?? "").startsWith("application/json");

app.post("/api/oy", async (c) => {
  if (!jsonOnly(c)) return c.json({ error: "Geçersiz istek" }, 415);
  const ipH = await ipHash(c);
  const recentVotes = await getDb().prepare("SELECT COUNT(*)::int AS n FROM votes WHERE ip_hash=? AND created_at>?").bind(ipH, now() - 3600).first<{ n: number }>();
  if ((recentVotes?.n ?? 0) >= 150) return c.json({ error: "Çok fazla oy verdin, biraz sonra tekrar dene." }, 429);
  const body = (await c.req.json().catch(() => ({}))) as { kind?: string; target?: string; value?: number };
  const voter = c.get("voter");
  const db = getDb();
  const t = now();
  if (body.kind === "helpful" || body.kind === "metoo") {
    const id = intOrNull(body.target, 1, 1e12);
    if (!id) return c.json({ error: "Geçersiz hedef" }, 400);
    const table = body.kind === "helpful" ? "reviews" : "issues";
    const col = body.kind === "helpful" ? "helpful" : "me_too";
    const exists = await db.prepare(`SELECT id FROM ${table} WHERE id=? AND status='live'`).bind(id).first();
    if (!exists) return c.json({ error: "Bulunamadı" }, 404);
    const had = await db.prepare("SELECT 1 FROM votes WHERE kind=? AND target=? AND voter=?").bind(body.kind, String(id), voter).first();
    if (had) {
      await db.batch([
        db.prepare("DELETE FROM votes WHERE kind=? AND target=? AND voter=?").bind(body.kind, String(id), voter),
        db.prepare(`UPDATE ${table} SET ${col}=GREATEST(0, ${col}-1) WHERE id=?`).bind(id),
      ]);
    } else {
      await db.batch([
        db.prepare("INSERT INTO votes (kind,target,voter,value,created_at,ip_hash) VALUES (?,?,?,1,?,?) ON CONFLICT DO NOTHING").bind(body.kind, String(id), voter, t, ipH),
        db.prepare(`UPDATE ${table} SET ${col}=${col}+1 WHERE id=?`).bind(id),
      ]);
    }
    const row = await db.prepare(`SELECT ${col} AS n FROM ${table} WHERE id=?`).bind(id).first<{ n: number }>();
    return c.json({ n: row?.n ?? 0, on: !had });
  }
  if (body.kind === "again") {
    const [cat, b, m] = String(body.target ?? "").split("/");
    const res = cat && b && m ? await resolveModel(db, cat, b, m) : null;
    if (!res) return c.json({ error: "Bulunamadı" }, 404);
    const value = body.value === 1 ? 1 : 0;
    await db.prepare("INSERT INTO votes (kind,target,voter,value,created_at,ip_hash) VALUES ('again',?,?,?,?,?) ON CONFLICT(kind,target,voter) DO UPDATE SET value=excluded.value").bind(modelKey(cat, b, m), voter, value, t, ipH).run();
    const s = await modelStats(db, cat, b, m);
    return c.json({ yes: s.againYes, no: s.againNo, mine: value });
  }
  return c.json({ error: "Geçersiz işlem" }, 400);
});

app.post("/api/bildir", async (c) => {
  if (!jsonOnly(c)) return c.json({ error: "Geçersiz istek" }, 415);
  const mine = await getDb().prepare("SELECT COUNT(*)::int AS n FROM reports WHERE voter=? AND created_at>?").bind(c.get("voter"), now() - 3600).first<{ n: number }>();
  if ((mine?.n ?? 0) >= 20) return c.json({ error: "Çok fazla bildirim" }, 429);
  const body = (await c.req.json().catch(() => ({}))) as { kind?: string; target?: string; reason?: string };
  const id = intOrNull(body.target, 1, 1e12);
  if (!id || (body.kind !== "review" && body.kind !== "issue")) return c.json({ error: "Geçersiz" }, 400);
  await getDb().prepare("INSERT INTO reports (kind,target_id,reason,voter,created_at) VALUES (?,?,?,?,?)").bind(body.kind, id, clean(body.reason, 300), c.get("voter"), now()).run();
  // 5 farklı bildirim alan içerik incelenene kadar gizlenir.
  const n = await getDb().prepare("SELECT COUNT(DISTINCT voter)::int AS n FROM reports WHERE kind=? AND target_id=?").bind(body.kind, id).first<{ n: number }>();
  if ((n?.n ?? 0) >= 5) await getDb().prepare(`UPDATE ${body.kind === "review" ? "reviews" : "issues"} SET status='hidden' WHERE id=?`).bind(id).run();
  return c.json({ ok: true });
});

app.get("/api/katalog/:cat", (c) => {
  const cat = categoryBySlug(c.req.param("cat"));
  if (!cat) return c.json({ error: "Kategori yok" }, 404);
  return c.json({ brands: cat.brands, usageLabel: cat.usageLabel, usageUnit: cat.usageUnit }, 200, { "cache-control": "public, max-age=3600" });
});

app.get("/sifir-arac-fiyatlari", (c) => {
  const label = currentMonth ? monthLabel(currentMonth.month) : "";
  return page(c, `Sıfır araç fiyatları ${label}`.trim(), "/sifir-arac-fiyatlari", <MarketPage rows={marketRows} movers={movers()} month={label} sources={marketSources} />, {
    description: `${label} sıfır araç fiyat listesi: marka, model ve paket bazında güncel fiyatlar ve aylık değişimler.`,
  });
});

// ---------- Kategori / marka / model ----------

app.get("/:cat", async (c) => {
  const cat = categoryBySlug(c.req.param("cat"));
  if (!cat) return notFound(c);
  const [counts, latest] = await Promise.all([brandCounts(getDb(), cat.slug), recentReviews(getDb(), 6, cat.slug)]);
  const mine = await myVotes(getDb(), c.get("voter"), "helpful", latest.map((r) => String(r.id)));
  return page(c, `${cat.name} yorumları`, `/${cat.slug}`, <CategoryPage cat={cat} counts={counts} latest={latest} helpfulMine={mine} />, { description: `${cat.name}: sahiplerinden gerçek deneyimler, kronik sorunlar ve marka marka karşılaştırma.` });
});

app.get("/:cat/:brand", async (c) => {
  const cat = categoryBySlug(c.req.param("cat"));
  const brand = cat ? brandBySlug(cat, c.req.param("brand")) : undefined;
  if (!cat || !brand) return notFound(c);
  const counted = await modelCounts(getDb(), cat.slug, slugify(brand));
  const map = new Map<string, { name: string; slug: string; n: number }>();
  for (const m of modelsFor(cat, brand)) map.set(slugify(m), { name: m, slug: slugify(m), n: 0 });
  for (const r of marketRows) if (r.category === cat.slug && r.brand === brand && !map.has(slugify(r.model))) map.set(slugify(r.model), { name: r.model, slug: slugify(r.model), n: 0 });
  for (const r of counted) map.set(r.slug, { name: map.get(r.slug)?.name ?? r.model, slug: r.slug, n: r.n });
  const models = [...map.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "tr", { numeric: true }));
  return page(c, `${brand} ${cat.short.toLocaleLowerCase("tr")} yorumları`, `/${cat.slug}/${slugify(brand)}`, <BrandPage cat={cat} brand={brand} models={models} />, { description: `${brand} sahiplerinin ${cat.name.toLocaleLowerCase("tr")} deneyimleri, model model kronik sorunlar ve tekrar alır mısın oyları.` });
});

app.get("/:cat/:brand/:model", async (c) => {
  const { cat: cs, brand: bs, model: ms } = c.req.param();
  const res = await resolveModel(getDb(), cs, bs, ms);
  if (!res) return notFound(c);
  const sort = c.req.query("sira") === "yeni" ? "yeni" : "faydali";
  const db = getDb();
  const [stats, reviews, issues] = await Promise.all([modelStats(db, cs, bs, ms), modelReviews(db, cs, bs, ms, sort), modelIssues(db, cs, bs, ms)]);
  const voter = c.get("voter");
  const [again, helpfulMine, metooMine] = await Promise.all([
    myVotes(db, voter, "again", [modelKey(cs, bs, ms)]),
    myVotes(db, voter, "helpful", reviews.map((r) => String(r.id))),
    myVotes(db, voter, "metoo", issues.map((i) => String(i.id))),
  ]);
  const name = `${res.brand} ${res.model}`;
  const total = stats.againYes + stats.againNo;
  const desc = `${name} sahipleri ne diyor? ${stats.reviews} gerçek kullanıcı deneyimi, ${issues.length} kronik sorun bildirimi${total ? `, sahiplerinin %${Math.round((stats.againYes / total) * 100)}'i tekrar alırım diyor` : ""}.`;
  return page(c, `${name} yorumları ve kronik sorunları`, `/${cs}/${bs}/${ms}`, (
    <ModelPage cat={res.cat} brand={res.brand} model={res.model} b={bs} m={ms} stats={stats} reviews={reviews} issues={issues} sort={sort} againMine={again[modelKey(cs, bs, ms)]} helpfulMine={helpfulMine} metooMine={metooMine} pkgs={modelRows(cs, bs, ms)} history={historyFor(`${cs}/${bs}/${ms}`)} formTime={await formStamp()} />
  ), { description: desc });
});

app.notFound((c) => notFound(c as unknown as C));
app.onError((err, c) => {
  console.error(err);
  return c.html(<Layout title="Bir hata oluştu" path={c.req.path} noindex><div class="wrap page narrow"><h1 class="page-h">Bir şeyler ters gitti</h1><p class="page-lead">Sayfa yüklenemedi. Birkaç saniye sonra yenile; sorun sürerse merhaba@yorumarac.com adresine yaz.</p></div></Layout>, 500);
});

export default app;
