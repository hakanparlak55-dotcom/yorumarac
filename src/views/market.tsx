import type { Row } from "../data/market/index.js";
import { slugify } from "../data/categories.js";
import { Change, Icon, tl } from "./layout.js";

const bodyIcon = (b: string) => (b === "sedan" ? "otomobil" : b);
const bodyName: Record<string, string> = { hatchback: "Hatchback", sedan: "Sedan", stationwagon: "SW", suv: "SUV", pickup: "Pickup", minivan: "Minivan", ticari: "Ticari", coupe: "Coupe" };

function Spark(p: { values: number[] }) {
  const v = p.values;
  if (v.length < 2) return <span class="spark-none">–</span>;
  const lo = Math.min(...v), hi = Math.max(...v), w = 96, h = 28;
  const pts = v.map((y, i) => `${((i * (w - 4)) / (v.length - 1) + 2).toFixed(1)},${(h - 3 - ((y - lo) / (hi - lo || 1)) * (h - 6)).toFixed(1)}`).join(" ");
  const col = v.at(-1)! >= v[0] ? "#1d7a4f" : "#c2352d";
  return <svg class="spark" viewBox={`0 0 ${w} ${h}`} aria-hidden="true"><polyline fill="none" stroke={col} stroke-width="2" points={pts} /></svg>;
}

export function MarketPage(p: {
  rows: Row[]; month: string; sources: { brand: string; urls: string[] }[];
  movers: { up: Row[]; down: Row[]; avg: number | null; count: number };
}) {
  const groups = new Map<string, Row[]>();
  for (const r of [...p.rows].sort((a, b) => a.brand.localeCompare(b.brand, "tr") || a.model.localeCompare(b.model, "tr") || a.price - b.price)) {
    const k = `${r.brand} ${r.model}`;
    groups.set(k, [...(groups.get(k) ?? []), r]);
  }
  const bodies = [...new Set(p.rows.map((r) => r.body))];
  const fuels = [...new Set(p.rows.map((r) => r.fuel))].sort();
  const brands = [...new Set(p.rows.map((r) => r.brand))].sort((a, b) => a.localeCompare(b, "tr"));
  const m = p.movers;
  return (
    <div class="wrap page">
      <div class="mkt-head">
        <h1 class="page-h">Sıfır araç fiyatları</h1>
        {p.month ? <p class="updated">Liste fiyatları · {p.month}</p> : null}
      </div>
      {!p.rows.length ? <p class="page-lead">Fiyat listesi hazırlanıyor.</p> : (
        <>
          {m.count ? (
            <div class="movers">
              <section class="mover"><h2>En çok artan</h2><ol>{m.up.map((r) => <li><a href={r.modelHref}>{r.brand} {r.model} {r.trim}</a><Change value={r.change} /></li>)}</ol></section>
              <section class="mover"><h2>En çok düşen</h2>{m.down.length ? <ol>{m.down.map((r) => <li><a href={r.modelHref}>{r.brand} {r.model} {r.trim}</a><Change value={r.change} /></li>)}</ol> : <p class="empty-mini">Bu ay düşüş yok.</p>}</section>
              <section class="mover"><h2>Piyasa ortalaması</h2><p class="big"><Change value={m.avg} /></p><p class="mover-sub">{m.count} paketin aylık ortalama değişimi</p></section>
            </div>
          ) : null}
          <div class="filters" id="mkt-filters">
            <label class="sr" for="mq">Ara</label>
            <input id="mq" type="search" placeholder="Marka, model veya paket" data-mkt="q" />
            <div class="seg-chips" role="group" aria-label="Kasa tipi">
              <button type="button" class="on" data-mkt-body="">Tümü</button>
              {bodies.map((b) => <button type="button" data-mkt-body={b}><Icon name={bodyIcon(b)} />{bodyName[b] ?? b}</button>)}
            </div>
            <label class="sr" for="mb">Marka</label>
            <select id="mb" data-mkt="brand"><option value="">Marka: hepsi</option>{brands.map((b) => <option value={slugify(b)}>{b}</option>)}</select>
            <label class="sr" for="mf">Yakıt</label>
            <select id="mf" data-mkt="fuel"><option value="">Yakıt: hepsi</option>{fuels.map((f) => <option>{f}</option>)}</select>
            <label class="sr" for="ms">Sırala</label>
            <select id="ms" data-mkt="sort"><option value="">Sırala: marka</option><option value="up">En çok artan</option><option value="down">En çok düşen</option><option value="cheap">En ucuz</option><option value="exp">En pahalı</option></select>
          </div>
          <div class="tbl-scroll">
            <table class="mkt" id="mkt-table">
              <thead><tr><th>Paket</th><th>Yakıt · vites</th><th class="num">Fiyat</th><th class="num">Aylık</th><th>6 ay</th><th class="num">Geçen ay</th><th><span class="sr">Bağlantı</span></th></tr></thead>
              {[...groups.entries()].map(([name, rs]) => (
                <tbody data-group>
                  <tr class="grp"><td colspan={7}><a href={rs[0].modelHref}>{name}</a></td></tr>
                  {rs.map((r) => (
                    <tr data-row data-brand={slugify(r.brand)} data-body={r.body} data-fuel={r.fuel} data-price={String(r.price)} data-change={r.change == null ? "" : String(r.change)}
                      data-text={`${r.brand} ${r.model} ${r.trim} ${r.engine}`.toLocaleLowerCase("tr")}>
                      <td><div class="model"><Icon name={bodyIcon(r.body)} class="ico ico-s" /><div><b>{r.trim}</b><small>{r.engine}</small></div></div></td>
                      <td>{r.fuel} · {r.gearbox}</td>
                      <td class="num price">{tl(r.price)}</td>
                      <td class="num"><Change value={r.change} /></td>
                      <td><Spark values={r.history} /></td>
                      <td class="num">{r.prev ? tl(r.prev) : "–"}</td>
                      <td class="rate"><a href={r.modelHref + "#yorumlar"}>Yorumlar</a></td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
          <p class="empty-mini is-hidden" id="mkt-empty">Bu filtrelerle eşleşen paket yok.</p>
          <details class="sources">
            <summary>Kaynaklar</summary>
            <p>Markaların yayımladığı tavsiye edilen anahtar teslim liste fiyatlarıdır; kampanya ve bayi indirimleri dahil değildir.</p>
            <ul>{p.sources.map((s) => <li><b>{s.brand}:</b> {s.urls.map((u, i) => <>{i ? ", " : ""}<a href={u} rel="nofollow noopener" target="_blank">{new URL(u).hostname.replace("www.", "")}</a></>)}</li>)}</ul>
          </details>
        </>
      )}
    </div>
  );
}
