// Vercel giriş noktası: Hono uygulamasını dışa aktarır.
import { Hono } from "hono";
import site from "./app.js";

const app = new Hono();
app.route("/", site);

export default app;
