import type { Issue, ModelStats, Review } from "../db.js";
import { categories, type Category, modelsFor, slugify } from "../data/categories.js";
import { IssueRow, modelHref, PollWidget, ReviewCard, Scorecard } from "./components.js";
import { Breadcrumb, Change, Icon, Plate, tl } from "./layout.js";
import { movers, rows as marketRows, type Row } from "../data/market/index.js";
import type { ModelHistory } from "../data/market/types.js";

const popular: [string, string, string][] = [
  ["otomobil", "Fiat", "Egea"], ["otomobil", "Renault", "Clio"], ["otomobil", "Toyota", "Corolla"],
  ["otomobil", "TOGG", "T10X"], ["otomobil", "Volkswagen", "Passat"], ["otomobil", "Hyundai", "i20"],
  ["otomobil", "Dacia", "Duster"], ["otomobil", "Peugeot", "2008"],
];

export function Home(p: {
  latest: Review[]; issues: Issue[]; board: { target: string; name: string; yes: number; total: number }[];
  counts: Record<string, number>; totals: { reviews: number; issues: number; votes: number };
  helpfulMine: Record<string, number>; metooMine: Record<string, number>;
}) {
  return (
    <>
      <section class="hero">
        <div class={`wrap hero-grid${p.board.length ? "" : " solo"}`}>
          <div class="hero-copy">
            <h1>Aracını en iyi, onu kullanan anlatır.</h1>
            <form class="plate-search" action="/ara" method="get" role="search">
              <label class="sr" for="big-q">Marka veya model</label>
              <span class="plate-tr" aria-hidden="true">TR</span>
              <input id="big-q" name="q" type="search" placeholder="Marka veya model yaz" autocomplete="off" />
              <button class="btn btn-blue" type="submit">Ara</button>
            </form>
            <ul class="chips" aria-label="Çok aranan modeller">
              {popular.map(([c, b, m]) => <li><a href={modelHref(c, slugify(b), slugify(m))}>{b} {m}</a></li>)}
            </ul>
          </div>
          {p.board.length ? (
          <aside class="hero-board" aria-labelledby="board-h">
            <h2 id="board-h">Alır mıydın?</h2>
              <ol class="board">
                {p.board.map((r) => {
                  const pct = Math.round((r.yes / r.total) * 100);
                  return (
                    <li>
                      <a href={"/" + r.target}>
                        <span class="board-name">{r.name}</span>
                        <span class="board-bar"><i style={`width:${pct}%`} /></span>
                        <b>%{pct}</b>
                        <small>{r.total} oy</small>
                      </a>
                    </li>
                  );
                })}
              </ol>
          </aside>
          ) : null}
        </div>
      </section>

      <section class="wrap section" aria-labelledby="cats-h">
        <div class="sec-head">
          <h2 id="cats-h">Kategoriler</h2>
        </div>
        <CategoryGrid counts={p.counts} />
      </section>

      <section class="wrap section two-col">
        <div>
          <div class="sec-head">
            <h2>Son deneyimler</h2>
            <a href="/son-yorumlar">Hepsi</a>
          </div>
          {p.latest.length ? (
            <div class="review-list">{p.latest.map((r) => <ReviewCard r={r} showVehicle voted={p.helpfulMine[String(r.id)] != null} />)}</div>
          ) : (
            <Empty title="İlk deneyimi sen yaz" text="Kullandığın aracı anlat; sonra gelenler senin yazdığına bakarak karar verecek." href="/yorum-yaz" cta="Deneyimini yaz" />
          )}
        </div>
        <aside class="side">
          {p.issues.length ? (
            <section class="side-box" aria-labelledby="iss-h">
              <h2 id="iss-h">Kronik sorunlar</h2>
              <ul class="issue-list compact">{p.issues.map((i) => <IssueRow i={i} showVehicle voted={p.metooMine[String(i.id)] != null} />)}</ul>
              <a class="side-more" href="/kronik-sorunlar">Tüm sorunlar</a>
            </section>
          ) : null}
          <MarketBox />
        </aside>
      </section>
    </>
  );
}

export function CategoryGrid(p: { counts: Record<string, number> }) {
  return (
    <ul class="cat-grid icons">
      {categories.map((c) => (
        <li>
          <a href={`/${c.slug}`}>
            <Icon name={c.icon} />
            <b>{c.name}</b>
            {p.counts[c.slug] ? <small>{p.counts[c.slug].toLocaleString("tr-TR")}</small> : null}
          </a>
        </li>
      ))}
    </ul>
  );
}

function MarketBox() {
  const m = movers();
  const list = [...m.up.slice(0, 2), ...m.down.slice(0, 2)];
  const items = list.length ? list : marketRows.slice(0, 4);
  if (!items.length) return null;
  return (
    <section class="side-box">
      <h2>Sıfır fiyatlarda bu ay</h2>
      <ul class="mini-mkt">
        {items.map((r) => <li><a href={r.modelHref}>{r.brand} {r.model}</a><span>{tl(r.price)}</span><Change value={r.change} /></li>)}
      </ul>
      <a class="side-more" href="/sifir-arac-fiyatlari">Tüm fiyatlar</a>
    </section>
  );
}

export function CategoriesPage(p: { counts: Record<string, number> }) {
  return (
    <div class="wrap page">
      <Breadcrumb items={[{ label: "Kategoriler" }]} />
      <h1 class="page-h">Tüm araç kategorileri</h1>
      <CategoryGrid counts={p.counts} />
    </div>
  );
}

export function CategoryPage(p: { cat: Category; counts: Record<string, number>; latest: Review[]; helpfulMine: Record<string, number> }) {
  const brands = Object.keys(p.cat.brands).sort((a, b) => (p.counts[slugify(b)] ?? 0) - (p.counts[slugify(a)] ?? 0) || a.localeCompare(b, "tr"));
  return (
    <div class="wrap page">
      <Breadcrumb items={[{ href: "/kategoriler", label: "Kategoriler" }, { label: p.cat.name }]} />
      <h1 class="page-h">{p.cat.name}</h1>
      <div class="filter-row">
        <label for="brand-filter" class="sr">Marka ara</label>
        <input id="brand-filter" type="search" placeholder="Marka ara" data-filter=".brand-grid li" />
        <a class="btn btn-yellow" href={`/yorum-yaz?kategori=${p.cat.slug}`}>Bu kategoride deneyim yaz</a>
      </div>
      <ul class="brand-grid">
        {brands.map((b) => (
          <li data-name={b.toLocaleLowerCase("tr")}>
            <a href={`/${p.cat.slug}/${slugify(b)}`}>
              <b>{b}</b>
              {p.counts[slugify(b)] ? <small>{p.counts[slugify(b)]} deneyim</small> : null}
            </a>
          </li>
        ))}
      </ul>
      {p.latest.length ? (
        <section class="section">
          <h2 class="sub-h">{p.cat.short} kategorisinde son deneyimler</h2>
          <div class="review-list">{p.latest.map((r) => <ReviewCard r={r} showVehicle voted={p.helpfulMine[String(r.id)] != null} />)}</div>
        </section>
      ) : null}
    </div>
  );
}

export function BrandPage(p: { cat: Category; brand: string; models: { name: string; slug: string; n: number }[] }) {
  const b = slugify(p.brand);
  return (
    <div class="wrap page">
      <Breadcrumb items={[{ href: `/${p.cat.slug}`, label: p.cat.short }, { label: p.brand }]} />
      <Plate as="h1" text={p.brand.toUpperCase()} size="l" />
      {p.models.length ? (
        <>
          <div class="filter-row">
            <label for="model-filter" class="sr">Model ara</label>
            <input id="model-filter" type="search" placeholder="Model ara" data-filter=".model-grid li" />
          </div>
          <ul class="model-grid">
            {p.models.map((m) => (
              <li data-name={m.name.toLocaleLowerCase("tr")}>
                <a href={`/${p.cat.slug}/${b}/${m.slug}`}><b>{m.name}</b>{m.n ? <small>{m.n} deneyim</small> : null}</a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Empty title={`${p.brand} için henüz model sayfası yok`} text="Kullandığın modeli yaz; ilk deneyimle birlikte model sayfası açılır." href={`/yorum-yaz?kategori=${p.cat.slug}&marka=${encodeURIComponent(p.brand)}`} cta="Deneyimini yaz" />
      )}
      <p class="brand-foot"><a class="btn btn-yellow" href={`/yorum-yaz?kategori=${p.cat.slug}&marka=${encodeURIComponent(p.brand)}`}>{p.brand} deneyimini yaz</a></p>
    </div>
  );
}

export function ModelPage(p: {
  cat: Category; brand: string; model: string; b: string; m: string; stats: ModelStats; reviews: Review[]; issues: Issue[];
  sort: "yeni" | "faydali"; ownerMine?: number; againMine?: number; helpfulMine: Record<string, number>; metooMine: Record<string, number>;
  pkgs: Row[]; history: ModelHistory | null; formTime: string;
}) {
  const name = `${p.brand} ${p.model}`;
  const writeHref = `/yorum-yaz?kategori=${p.cat.slug}&marka=${encodeURIComponent(p.brand)}&model=${encodeURIComponent(p.model)}`;
  const here = modelHref(p.cat.slug, p.b, p.m);
  const cheapest = p.pkgs.length ? p.pkgs.reduce((a, r) => (r.price < a.price ? r : a)) : null;
  const first = p.history?.generations[0];
  const current = p.history?.generations.find((g) => g.to == null);
  return (
    <div class="wrap page">
      <Breadcrumb items={[{ href: `/${p.cat.slug}`, label: p.cat.short }, { href: `/${p.cat.slug}/${p.b}`, label: p.brand }, { label: p.model }]} />
      <div class="model-head">
        <Plate as="h1" text={name.toUpperCase()} size="l" />
        <div class="model-actions">
          <a class="btn btn-yellow" href={writeHref}>Deneyimini yaz</a>
          <button class="btn btn-ghost" type="button" data-share={name}>Paylaş</button>
        </div>
      </div>
      {first || cheapest ? (
        <p class="model-facts">
          {first ? <span>Üretim: <b>{first.from}'dan beri</b></span> : null}
          {current ? <span>Satıştaki kasa: <b>{current.name}</b></span> : null}
          {cheapest ? <span>Sıfır fiyatı: <b>{tl(cheapest.price)}'den</b> <Change value={cheapest.change} /></span> : null}
        </p>
      ) : null}
      <nav class="tabs" aria-label="Bölümler">
        {p.pkgs.length ? <a href="#paketler">Fiyatlar</a> : null}
        {p.history ? <a href="#kasa">Kasa geçmişi</a> : null}
        <a href="#yorumlar">Deneyimler ({p.reviews.length})</a>
        <a href="#sorunlar">Kronik sorunlar ({p.issues.length})</a>
      </nav>

      <div class={`model-top${p.stats.reviews ? "" : " solo"}`} id="genel">
        <PollWidget cat={p.cat.slug} b={p.b} m={p.m} name={p.model} poll={p.stats} mineOwner={p.ownerMine} mineAgain={p.againMine} />
        {p.stats.reviews ? <Scorecard stats={p.stats} usageLabel={p.cat.usageLabel} usageUnit={p.cat.usageUnit} /> : null}
      </div>

      {p.pkgs.length ? (
        <section class="sec" id="paketler">
          <h2>Paketler ve fiyatlar</h2>
          <table class="pk">
            <thead><tr><th>Paket</th><th class="num">Fiyat</th></tr></thead>
            <tbody>
              {[...p.pkgs].sort((a, b) => a.price - b.price).map((r) => (
                <tr>
                  <td><b>{r.trim}</b><small>{r.engine} · {r.fuel} · {r.gearbox}</small></td>
                  <td class="num"><b>{tl(r.price)}</b><small><Change value={r.change} /></small></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p class="src-note">Tavsiye edilen anahtar teslim liste fiyatları. <a href="/sifir-arac-fiyatlari">Tüm sıfır fiyatlar</a></p>
        </section>
      ) : null}

      {p.history ? <Timeline h={p.history} /> : null}

      <div class="two-col model-body">
        <section aria-labelledby="yorumlar">
          <div class="sec-head">
            <h2 id="yorumlar">Deneyimler <span class="count">{p.reviews.length}</span></h2>
            {p.reviews.length > 1 ? (
              <div class="sort" role="group" aria-label="Sırala">
                <a href={`${here}?sira=faydali#yorumlar`} aria-current={p.sort === "faydali" ? "true" : undefined}>En faydalı</a>
                <a href={`${here}?sira=yeni#yorumlar`} aria-current={p.sort === "yeni" ? "true" : undefined}>En yeni</a>
              </div>
            ) : null}
          </div>
          {p.reviews.length ? (
            <div class="review-list">{p.reviews.map((r) => <ReviewCard r={r} voted={p.helpfulMine[String(r.id)] != null} />)}</div>
          ) : (
            <Empty title={`${name} için ilk deneyimi sen yaz`} text="Kaç km'de, hangi yılda, ne yaşadın? Kısa da olsa işe yarar." href={writeHref} cta="Deneyimini yaz" />
          )}
        </section>

        <aside class="side" id="sorunlar">
          <section class="side-box" aria-labelledby="iss-h">
            <h2 id="iss-h">Kronik sorunlar</h2>
            {p.issues.length ? (
              <ul class="issue-list">{p.issues.map((i) => <IssueRow i={i} voted={p.metooMine[String(i.id)] != null} />)}</ul>
            ) : (
              <p class="empty-mini">Bildirilmiş sorun yok.</p>
            )}
            <details class="report" id="sorun-bildir">
              <summary class="btn btn-ghost">Sorun bildir</summary>
            <form class="form compact-form" method="post" action="/sorun">
              <input type="hidden" name="kategori" value={p.cat.slug} />
              <input type="hidden" name="marka" value={p.brand} />
              <input type="hidden" name="model" value={p.model} />
              <FormGuard t={p.formTime} />
              <label>Sorun ne?<input name="baslik" required minlength={6} maxlength={90} placeholder="Örn. Soğukta vites geçişleri sertleşiyor" /></label>
              <label><span class="lbl">Ayrıntı <span class="opt">(isteğe bağlı)</span></span><textarea name="aciklama" rows={3} maxlength={600} /></label>
              <div class="row2">
                <label>Kaç km'de?<input name="km" inputmode="numeric" pattern="[0-9. ]*" maxlength={9} placeholder="85000" /></label>
                <label>Rumuz<input name="rumuz" required minlength={2} maxlength={30} /></label>
              </div>
              <label class="check"><input type="checkbox" name="onay" required /> <span><a href="/kurallar">Kuralları</a> ve <a href="/gizlilik">KVKK metnini</a> okudum.</span></label>
              <button class="btn btn-blue" type="submit">Sorunu bildir</button>
            </form>
            </details>
          </section>
        </aside>
      </div>
    </div>
  );
}

const bodyIcon = (b: string) => (b === "sedan" ? "otomobil" : b);

export function Timeline(p: { h: ModelHistory }) {
  const gens = p.h.generations;
  const nowY = new Date().getFullYear();
  const start = Math.min(...gens.map((g) => g.from)) - 2;
  const end = nowY + 7;
  const x = (y: number) => ((y - start) / (end - start)) * 100;
  const ticks: number[] = [];
  for (let y = Math.ceil(start / 5) * 5; y <= end; y += 5) ticks.push(y);
  return (
    <section class="tl-wrap" id="kasa">
      <h2>Kasa geçmişi</h2>
      <div class="tl-scroll">
        <div class="tl">
          <div class="tl-axis" />
          {ticks.map((y) => <><span class="tl-tick" style={`left:${x(y)}%`} /><span class="tl-year" style={`left:${x(y)}%`}>{y}</span></>)}
          {gens.map((g, i) => {
            const next = gens[i + 1]?.from ?? end;
            return (
              <div class={`tl-gen${g.to == null ? " now" : ""}`} style={`left:${x(g.from)}%;width:${x(next) - x(g.from)}%`}>
                <h3>{g.name}{g.to == null ? <span class="tl-now">satışta</span> : null}</h3>
                <p class="yrs">{g.from}–{g.to ?? ""}</p>
                {gens.length <= 8 ? <ul>{g.bodies.map((b) => <li><Icon name={bodyIcon(b.body)} />{b.label}{b.year ? ` · ${b.year}` : ""}</li>)}</ul> : <Icon name={bodyIcon(g.bodies[0].body)} />}
              </div>
            );
          })}
          {(p.h.events ?? []).map((e) => <div class="tl-ev" style={`left:${x(e.year)}%`}>{e.year}<br />{e.label}</div>)}
        </div>
      </div>
      {p.h.sources.length ? <p class="src-note">Kaynak: {p.h.sources.map((u, i) => <>{i ? ", " : ""}<a href={u} rel="nofollow noopener" target="_blank">{new URL(u).hostname.replace("www.", "")}</a></>)}</p> : null}
    </section>
  );
}

/** Bot tuzağı: görünmez alan + formun açıldığı zaman. */
export function FormGuard(p: { t: string }) {
  return (
    <>
      <div class="hp" aria-hidden="true"><label>Web sitesi<input name="website" tabindex={-1} autocomplete="off" /></label></div>
      <input type="hidden" name="t" value={p.t} />
    </>
  );
}

export function Empty(p: { title: string; text: string; href?: string; cta?: string }) {
  return (
    <div class="empty">
      <h3>{p.title}</h3>
      <p>{p.text}</p>
      {p.href ? <a class="btn btn-yellow" href={p.href}>{p.cta}</a> : null}
    </div>
  );
}

export function WritePage(p: { cat: Category; brand: string; model: string; error?: string; values?: Record<string, string>; formTime: string }) {
  const v = p.values ?? {};
  const brands = Object.keys(p.cat.brands).sort((a, b) => a.localeCompare(b, "tr"));
  const models = p.brand ? modelsFor(p.cat, p.brand) : [];
  const modelInList = !p.model || models.includes(p.model);
  const year = new Date().getFullYear();
  const scoreRow = (name: string, label: string, low: string, high: string) => (
    <fieldset class="score-field">
      <legend>{label}</legend>
      <div class="seg">
        {[1, 2, 3, 4, 5].map((n) => (
          <label><input type="radio" name={name} value={String(n)} required checked={v[name] === String(n)} /><span>{n}</span></label>
        ))}
      </div>
      <p class="seg-ends"><span>{low}</span><span>{high}</span></p>
    </fieldset>
  );
  return (
    <div class="wrap page narrow">
      <Breadcrumb items={[{ label: "Deneyimini yaz" }]} />
      <h1 class="page-h">Deneyimini yaz</h1>
      <p class="page-lead">Üyelik gerekmez.</p>
      {p.error ? <p class="form-error" role="alert">{p.error}</p> : null}
      <form class="form" method="post" action="/yorum" id="write-form">
        <FormGuard t={p.formTime} />
        <fieldset class="block">
          <legend>Araç</legend>
          <label>Kategori
            <select name="kategori" id="f-cat" required>
              {categories.map((c) => <option value={c.slug} selected={c.slug === p.cat.slug}>{c.name}</option>)}
            </select>
          </label>
          <div class="row2">
            <label>Marka
              <select name="marka" id="f-brand" required>
                <option value="">Seç</option>
                {brands.map((b) => <option selected={b === p.brand}>{b}</option>)}
              </select>
            </label>
            <label>Model
              <select name="model" id="f-model" required={modelInList}>
                <option value="">{models.length ? "Seç" : "Önce marka seç"}</option>
                {models.map((m) => <option selected={m === p.model}>{m}</option>)}
                <option value="__diger" selected={!modelInList}>Listede yok, kendim yazacağım</option>
              </select>
            </label>
          </div>
          <label class={`free-model${modelInList ? " is-hidden" : ""}`} id="f-free-wrap">Model adı
            <input name="model_serbest" id="f-free" maxlength={60} value={modelInList ? "" : p.model} placeholder="Örn. PCX 125" />
          </label>
          <div class="row3">
            <label>Model yılı<input name="yil" inputmode="numeric" pattern="[0-9]{4}" maxlength={4} placeholder={String(year - 3)} value={v.yil ?? ""} /></label>
            <label>Kilometre / çalışma saati<input name="km" inputmode="numeric" pattern="[0-9. ]*" maxlength={9} placeholder="60000" value={v.km ?? ""} /></label>
            <label id="f-usage-wrap" class={p.cat.usageLabel ? "" : "is-hidden"}><span id="f-usage-label">{p.cat.usageLabel ?? "Tüketim"} {p.cat.usageUnit ? `(${p.cat.usageUnit})` : ""}</span><input name="tuketim" inputmode="decimal" maxlength={6} placeholder="6,5" value={v.tuketim ?? ""} /></label>
          </div>
        </fieldset>

        <fieldset class="block">
          <legend>Puanların</legend>
          <div class="score-grid">
            {scoreRow("p_konfor", "Konfor", "Yorucu", "Çok rahat")}
            {scoreRow("p_ekonomi", "Yakıt / enerji", "Çok yakıyor", "Çok az")}
            {scoreRow("p_saglamlik", "Sağlamlık", "Sürekli arıza", "Hiç sorun yok")}
            {scoreRow("p_maliyet", "Bakım maliyeti", "Çok pahalı", "Çok uygun")}
          </div>
          <fieldset class="again-field">
            <legend>Tekrar alır mıydın?</legend>
            <label><input type="radio" name="tekrar" value="1" required checked={v.tekrar === "1"} /><span>Evet, alırım</span></label>
            <label><input type="radio" name="tekrar" value="0" checked={v.tekrar === "0"} /><span>Hayır, almam</span></label>
          </fieldset>
        </fieldset>

        <fieldset class="block">
          <legend>Deneyimin</legend>
          <label>Tek cümleyle özetle<input name="baslik" required minlength={8} maxlength={90} placeholder="Örn. Şehir içinde ekonomik, uzun yolda yorucu" value={v.baslik ?? ""} /></label>
          <label>Anlat
            <textarea name="metin" required minlength={60} maxlength={4000} rows={7} placeholder="Ne kadar süredir kullanıyorsun? Neyi seviyorsun, seni ne yordu? Serviste ne yaşadın?">{v.metin ?? ""}</textarea>
            <small class="counter" data-count-for="metin">En az 60 karakter</small>
          </label>
          <label>Rumuz<input name="rumuz" required minlength={2} maxlength={30} placeholder="Örn. Mert34" value={v.rumuz ?? ""} /></label>
          <label class="check"><input type="checkbox" name="onay" required /> <span>Bu aracı gerçekten kullandım. <a href="/kurallar">Topluluk kurallarını</a> ve <a href="/gizlilik">KVKK metnini</a> okudum.</span></label>
        </fieldset>
        <button class="btn btn-blue btn-big" type="submit">Deneyimimi yayımla</button>
      </form>
    </div>
  );
}

export function ListPage(p: { title: string; lead: string; reviews?: Review[]; issues?: Issue[]; helpfulMine?: Record<string, number>; metooMine?: Record<string, number> }) {
  return (
    <div class="wrap page">
      <Breadcrumb items={[{ label: p.title }]} />
      <h1 class="page-h">{p.title}</h1>
      <p class="page-lead">{p.lead}</p>
      {p.reviews ? (p.reviews.length ? <div class="review-list wide">{p.reviews.map((r) => <ReviewCard r={r} showVehicle voted={p.helpfulMine?.[String(r.id)] != null} />)}</div> : <Empty title="Henüz deneyim yok" text="İlk deneyimi sen yaz." href="/yorum-yaz" cta="Deneyimini yaz" />) : null}
      {p.issues ? (p.issues.length ? <ul class="issue-list wide">{p.issues.map((i) => <IssueRow i={i} showVehicle voted={p.metooMine?.[String(i.id)] != null} />)}</ul> : <Empty title="Henüz sorun bildirilmedi" text="Aracında tekrarlayan bir arıza varsa model sayfasından bildir." href="/kategoriler" cta="Aracımı bul" />) : null}
    </div>
  );
}

export function SearchPage(p: { q: string; hits: { cat: Category; brand: string; model?: string; href: string }[] }) {
  return (
    <div class="wrap page">
      <Breadcrumb items={[{ label: "Arama" }]} />
      <h1 class="page-h">{p.q ? `“${p.q}” için sonuçlar` : "Araç ara"}</h1>
      <form class="plate-search inline" action="/ara" method="get" role="search">
        <label class="sr" for="sq">Marka veya model</label>
        <span class="plate-tr" aria-hidden="true">TR</span>
        <input id="sq" name="q" type="search" value={p.q} placeholder="Marka veya model" autofocus />
        <button class="btn btn-blue" type="submit">Ara</button>
      </form>
      {p.q ? (
        p.hits.length ? (
          <ul class="hits">{p.hits.map((h) => <li><a href={h.href}><b>{h.brand}{h.model ? ` ${h.model}` : ""}</b><span>{h.cat.short}</span></a></li>)}</ul>
        ) : (
          <Empty title="Bu isimle bir araç bulamadık" text="Yazımı kontrol et ya da kategoriden markanı seç. Listede olmayan bir modelse deneyimini yazarken adını kendin girebilirsin." href="/yorum-yaz" cta="Deneyimini yaz" />
        )
      ) : null}
    </div>
  );
}

export function TextPage(p: { title: string; paras: string[] }) {
  return (
    <div class="wrap page narrow prose">
      <Breadcrumb items={[{ label: p.title }]} />
      <h1 class="page-h">{p.title}</h1>
      {p.paras.map((t) => <p>{t}</p>)}
    </div>
  );
}
