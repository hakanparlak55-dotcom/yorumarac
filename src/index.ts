// Vercel giriş noktası. Uygulama derleme adımında (npm run build) dist/app.js olarak tek dosyada paketlenir.
import { Hono } from "hono";
// @ts-ignore: derleme çıktısı, kaynakta bulunmaz
import site from "../dist/app.js";

const app = new Hono();
app.route("/", site);

export default app;
