import type { Child } from "hono/jsx";
import { categories } from "../data/categories";

export const SITE = "YorumAraç";
export const ORIGIN = "https://yorumarac.com";

export function Plate(props: { text: string; size?: "s" | "m" | "l"; as?: "div" | "h1" | "span" }) {
  const Tag = (props.as ?? "div") as "div";
  return (
    <Tag class={`plate plate-${props.size ?? "m"}`}>
      <span class="plate-tr" aria-hidden="true">TR</span>
      <span class="plate-text">{props.text}</span>
    </Tag>
  );
}

export function Layout(props: { title: string; description?: string; path: string; children: Child; flash?: string; noindex?: boolean }) {
  const fullTitle = props.title === SITE ? `${SITE} · Sürücülerin gerçek araç deneyimleri` : `${props.title} | ${SITE}`;
  const desc = props.description ?? "Otomobilden motosiklete, tekneden traktöre her araç için sahiplerinin gerçek deneyimleri, kronik sorunlar ve gerçek tüketim değerleri.";
  return (
    <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{fullTitle}</title>
        <meta name="description" content={desc} />
        <link rel="canonical" href={ORIGIN + props.path} />
        {props.noindex ? <meta name="robots" content="noindex" /> : null}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ORIGIN + props.path} />
        <meta property="og:locale" content="tr_TR" />
        <meta name="theme-color" content="#1d4fb5" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preload" href="/fonts/barlow-condensed-latin-ext-800-normal.woff2" as="font" type="font/woff2" crossorigin="" />
        <link rel="stylesheet" href="/app.css?v=1" />
      </head>
      <body>
        <a class="skip" href="#icerik">İçeriğe geç</a>
        <header class="site-head">
          <div class="wrap head-row">
            <a class="logo" href="/" aria-label={`${SITE} ana sayfa`}>
              <Plate text="YORUM ARAÇ" size="s" />
            </a>
            <form class="head-search" action="/ara" method="get" role="search">
              <label class="sr" for="hq">Araç ara</label>
              <input id="hq" name="q" type="search" placeholder="Marka veya model ara" autocomplete="off" />
            </form>
            <nav class="head-nav" aria-label="Ana menü">
              <a href="/kategoriler">Kategoriler</a>
              <a href="/kronik-sorunlar">Kronik sorunlar</a>
              <a href="/son-yorumlar">Son yorumlar</a>
            </nav>
            <a class="btn btn-yellow head-cta" href="/yorum-yaz">Deneyimini yaz</a>
          </div>
        </header>
        {props.flash ? <div class="flash" role="status">{props.flash}</div> : null}
        <main id="icerik">{props.children}</main>
        <footer class="site-foot">
          <div class="wrap foot-grid">
            <div>
              <Plate text="YORUM ARAÇ" size="s" />
              <p class="foot-note">Sürücülerin kendi araçlarını anlattığı bağımsız deneyim platformu. Yorumlar kullanıcılara aittir; ücretli ya da sponsorlu yorum yayımlanmaz.</p>
            </div>
            <div>
              <h2 class="foot-h">Kategoriler</h2>
              <ul class="foot-cats">
                {categories.map((c) => <li><a href={`/${c.slug}`}>{c.short}</a></li>)}
              </ul>
            </div>
            <div>
              <h2 class="foot-h">Site</h2>
              <ul class="foot-links">
                <li><a href="/kurallar">Topluluk kuralları</a></li>
                <li><a href="/gizlilik">Gizlilik ve KVKK</a></li>
                <li><a href="mailto:merhaba@yorumarac.com">merhaba@yorumarac.com</a></li>
              </ul>
            </div>
          </div>
          <div class="wrap foot-bottom">© {new Date().getFullYear()} {SITE}</div>
        </footer>
        <script src="/app.js?v=1" defer></script>
      </body>
    </html>
  );
}

export function Breadcrumb(props: { items: { href?: string; label: string }[] }) {
  return (
    <nav class="crumbs" aria-label="Konum">
      <ol>
        <li><a href="/">Ana sayfa</a></li>
        {props.items.map((i) => <li>{i.href ? <a href={i.href}>{i.label}</a> : <span aria-current="page">{i.label}</span>}</li>)}
      </ol>
    </nav>
  );
}

const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
export function when(ts: number) {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} gün önce`;
  const d = new Date(ts * 1000);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export const fmtKm = (n: number | null) => (n == null ? "" : `${n.toLocaleString("tr-TR")} km`);
export const fmt1 = (n: number | null) => (n == null ? "–" : n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
