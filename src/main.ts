import * as http from "@nx.js/http";
import { createRequestHandler } from "@remix-run/server-runtime";

// @ts-expect-error The Remix server build does not include any types
import * as build from "../build/server/index.js";

let requestHandler: http.ServerHandler;
const staticHandler = http.createStaticFileHandler("romfs:/public/");

declare const DEV_MODE: boolean;
if (DEV_MODE) {
  (globalThis as any).__devServerBuild = build;
  requestHandler = (req: Request) =>
    createRequestHandler((globalThis as any).__devServerBuild)(req);
} else {
  requestHandler = createRequestHandler(build);
}

const port = 8080;
http.listen({
  port,

  async fetch(req) {
    let res = await staticHandler(req);
    if (!res) res = await requestHandler(req);
    return res;
  },
});

const { ip } = Switch.networkInfo();
console.log(`HTTP server listening at: http://${ip}:${port}`);
