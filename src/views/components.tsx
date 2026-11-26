import type { Issue, ModelStats, Review } from "../db.js";
import { modelKey } from "../db.js";
import { categoryBySlug } from "../data/categories.js";
import { fmt1, fmtKm, when } from "./layout.js";

export const modelHref = (cat: string, b: string, m: string) => `/${cat}/${b}/${m}`;

const scoreNames: [keyof Review, string][] = [
  ["s_comfort", "Konfor"],
  ["s_economy", "Yakıt / enerji"],
  ["s_reliability", "Sağlamlık"],
  ["s_cost", "Bakım maliyeti"],
];

export function Pips(props: { value: number; label: string }) {
  return (
    <span class="pips" role="img" aria-label={`${props.label}: 5 üzerinden ${props.value}`}>
      {[1, 2, 3, 4, 5].map((i) => <i class={i <= props.value ? "on" : ""} />)}
    </span>
  );
}

export function ReviewCard(props: { r: Review; showVehicle?: boolean; voted?: boolean }) {
  const r = props.r;
  const cat = categoryBySlug(r.category);
  return (
    <article class="review" id={`yorum-${r.id}`}>
      {props.showVehicle ? (
        <a class="review-vehicle" href={modelHref(r.category, r.brand_slug, r.model_slug)}>
          <b>{r.brand} {r.model}</b>
          <span>{cat?.short}</span>
        </a>
      ) : null}
      <h3 class="review-title">{r.title}</h3>
      <p class="review-meta">
        <span>{r.nickname}</span>
        {r.city ? <span>{r.city}</span> : null}
        {r.year ? <span>{r.year} model</span> : null}
        {r.km ? <span>{fmtKm(r.km)}</span> : null}
        <time datetime={new Date(r.created_at * 1000).toISOString()}>{when(r.created_at)}</time>
      </p>
      {r.buy_again != null ? (
        <p class={`again-badge ${r.buy_again ? "yes" : "no"}`}>{r.buy_again ? "Tekrar alırım" : "Tekrar almam"}</p>
      ) : null}
      <div class="review-body">{r.body.split(/\n+/).map((p) => <p>{p}</p>)}</div>
      {r.pros || r.cons ? (
        <div class="pc">
          {r.pros ? <div class="pc-pro"><h4>Artılar</h4><p>{r.pros}</p></div> : null}
          {r.cons ? <div class="pc-con"><h4>Eksiler</h4><p>{r.cons}</p></div> : null}
        </div>
      ) : null}
      <dl class="review-scores">
        {scoreNames.map(([k, label]) => (
          <div><dt>{label}</dt><dd><Pips value={Number(r[k])} label={label} /></dd></div>
        ))}
      </dl>
      <div class="review-foot">
        <button class={`vote-btn${props.voted ? " is-on" : ""}`} type="button" data-vote="helpful" data-target={String(r.id)} aria-pressed={props.voted ? "true" : "false"}>
          Faydalı <span class="vote-n">{r.helpful}</span>
        </button>
        <button class="link-btn" type="button" data-report="review" data-target={String(r.id)}>Bildir</button>
      </div>
    </article>
  );
}

export function IssueRow(props: { i: Issue; voted?: boolean; showVehicle?: boolean }) {
  const i = props.i;
  return (
    <li class="issue" id={`sorun-${i.id}`}>
      <div class="issue-main">
        {props.showVehicle ? <a class="issue-vehicle" href={modelHref(i.category, i.brand_slug, i.model_slug) + "#sorunlar"}>{i.brand} {i.model}</a> : null}
        <h3 class="issue-title">{i.title}</h3>
        {i.body ? <p class="issue-body">{i.body}</p> : null}
        <p class="issue-meta">{i.nickname}{i.km ? ` · ${fmtKm(i.km)}'de` : ""} · {when(i.created_at)}</p>
      </div>
      <button class={`metoo${props.voted ? " is-on" : ""}`} type="button" data-vote="metoo" data-target={String(i.id)} aria-pressed={props.voted ? "true" : "false"}>
        <span class="vote-n">{i.me_too}</span>
        <span class="metoo-l">Ben de yaşadım</span>
      </button>
    </li>
  );
}

export type PollData = Pick<ModelStats, "againYes" | "againNo" | "ownerYes" | "ownerNo" | "ownersBuyYes" | "ownersBuyTotal">;

/** Model sayfasındaki iki soruluk anket. Oy verilince sunucu bu bileşeni yeniden üretip gönderir. */
export function PollWidget(props: { cat: string; b: string; m: string; name: string; poll: PollData; mineOwner?: number; mineAgain?: number }) {
  const p = props.poll;
  const target = modelKey(props.cat, props.b, props.m);
  const owners = p.ownerYes + p.ownerNo;
  const total = p.againYes + p.againNo;
  const pct = total ? Math.round((p.againYes / total) * 100) : 0;
  const ownersPct = p.ownersBuyTotal ? Math.round((p.ownersBuyYes / p.ownersBuyTotal) * 100) : 0;
  const choice = (kind: string, value: 1 | 0, label: string, mine?: number) => (
    <button type="button" class={`${value ? "poll-yes" : "poll-no"}${mine === value ? " is-on" : ""}`} data-vote={kind} data-target={target} data-value={String(value)} aria-pressed={mine === value ? "true" : "false"}>{label}</button>
  );
  return (
    <section class="poll" data-poll={target} aria-label={`${props.name} anketi`}>
      <div class="poll-q">
        <h2>{props.name} sende var mı?</h2>
        <div class="poll-btns">
          {choice("owner", 1, "Evet", props.mineOwner)}
          {choice("owner", 0, "Hayır", props.mineOwner)}
        </div>
        {owners ? <p class="poll-note">{p.ownerYes} kişide var, {p.ownerNo} kişide yok</p> : null}
      </div>
      <div class="poll-q">
        <h2>Bu aracı alır mıydın?</h2>
        <div class="poll-btns">
          {choice("again", 1, "Evet, alırım", props.mineAgain)}
          {choice("again", 0, "Hayır, almam", props.mineAgain)}
        </div>
        <div class="poll-result" aria-live="polite">
          <div class="poll-bar"><i style={`width:${pct}%`} /></div>
          <p class="poll-text">
            {total
              ? <><b class="poll-pct">%{pct}</b> alırım diyor <span class="poll-total">({total} oy)</span></>
              : <>Henüz oy yok. İlk oyu sen ver.</>}
          </p>
          {p.ownersBuyTotal ? <p class="poll-note">Aracı olanlarda: <b>%{ownersPct}</b> tekrar alırım diyor ({p.ownersBuyTotal} oy)</p> : null}
        </div>
      </div>
    </section>
  );
}

export function Scorecard(props: { stats: ModelStats; usageLabel: string | null; usageUnit: string | null }) {
  const s = props.stats;
  const rows: [string, number | null][] = [
    ["Konfor", s.comfort], ["Yakıt / enerji", s.economy], ["Sağlamlık", s.reliability], ["Bakım maliyeti", s.cost],
  ];
  return (
    <section class="scorecard" aria-labelledby="karne-h">
      <h2 id="karne-h">Sahiplerinden karne</h2>
      {s.reviews ? (
        <>
          <ul class="gauges">
            {rows.map(([label, v]) => (
              <li>
                <span class="g-label">{label}</span>
                <span class="g-track"><i style={`width:${v ? (v / 5) * 100 : 0}%`} /></span>
                <b class="g-val">{fmt1(v)}</b>
              </li>
            ))}
          </ul>
          {props.usageLabel && s.usageCount ? (
            <p class="usage"><span>{props.usageLabel}</span><b>{fmt1(s.usage)} {props.usageUnit}</b><small>{s.usageCount} sahibin beyanı</small></p>
          ) : null}
          <p class="scorecard-n">{s.reviews} deneyime göre, 5 üzerinden</p>
        </>
      ) : (
        <p class="empty-mini">Karne ilk deneyimle birlikte oluşur.</p>
      )}
    </section>
  );
}
