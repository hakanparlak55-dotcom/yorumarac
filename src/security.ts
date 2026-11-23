import type { MiddlewareHandler } from "hono";

// İmza anahtarı ortam değişkeninden gelir (depo herkese açık; anahtar kodda tutulmaz).
// FORM_SECRET yoksa veritabanı adresinden türetilir: o da gizli ve tüm sunucularda aynıdır.
const secretSource = () => process.env.FORM_SECRET ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "yerel-gelistirme";

let keyPromise: Promise<CryptoKey> | null = null;
function key() {
  keyPromise ??= crypto.subtle.importKey("raw", new TextEncoder().encode(secretSource()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return keyPromise;
}
async function sign(data: string) {
  const sig = await crypto.subtle.sign("HMAC", await key(), new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].slice(0, 12).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Formun açıldığı anın imzalı damgası. */
export async function formStamp() {
  const t = Date.now().toString(36);
  return `${t}.${await sign("form:" + t)}`;
}

const MIN_MS = 3_000; // insanlar formu 3 saniyeden kısa sürede dolduramaz
const MAX_MS = 12 * 3600_000;

/** Bot tuzağı ve süre kontrolü. Sorun yoksa null, varsa sebep döner. */
export async function checkForm(f: Record<string, string>): Promise<"bot" | "expired" | null> {
  if (f.website) return "bot";
  const [t, sig] = String(f.t ?? "").split(".");
  if (!t || !sig || sig !== (await sign("form:" + t))) return "expired";
  const age = Date.now() - parseInt(t, 36);
  if (!(age >= MIN_MS)) return "bot";
  if (age > MAX_MS) return "expired";
  return null;
}

/** Başka sitelerden gönderilen formları ve istekleri reddet. */
export const sameOrigin: MiddlewareHandler = async (c, next) => {
  if (c.req.method === "GET" || c.req.method === "HEAD" || c.req.method === "OPTIONS") return next();
  const host = c.req.header("x-forwarded-host") ?? c.req.header("host") ?? "";
  const origin = c.req.header("origin") ?? c.req.header("referer") ?? "";
  let ok = false;
  try { ok = !!origin && new URL(origin).host === host; } catch { ok = false; }
  if (!ok) return c.text("İstek reddedildi.", 403);
  return next();
};

const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https://upload.wikimedia.org",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export const securityHeaders: MiddlewareHandler = async (c, next) => {
  await next();
  c.header("Content-Security-Policy", CSP);
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  c.header("Cross-Origin-Opener-Policy", "same-origin");
};
