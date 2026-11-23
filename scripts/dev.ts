// Yerel geliştirme sunucusu: npm run dev → http://127.0.0.1:3000
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import app from "../src/app";

const root = new Hono();
root.use("*", serveStatic({ root: "./public" }));
root.route("/", app);
serve({ fetch: root.fetch, port: Number(process.env.PORT ?? 3000), hostname: "127.0.0.1" }, (i) => console.log(`http://127.0.0.1:${i.port}`));
