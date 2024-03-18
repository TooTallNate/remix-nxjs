import * as http from "@nx.js/http";
import {
  type ServerBuild,
  createRequestHandler,
} from "@remix-run/server-runtime";

// @ts-expect-error The Remix server build does not include any types
import * as build from "../build/server/index.js";
let serverBuild: ServerBuild = build;

let requestHandler: http.ServerHandler;
const staticHandler = http.createStaticFileHandler("romfs:/public/");

declare const DEV_MODE: boolean;
if (DEV_MODE) {
  requestHandler = (req: Request) => createRequestHandler(serverBuild)(req);
} else {
  requestHandler = createRequestHandler(build);
}

const port = 8080;
http.listen({
  port,

  async fetch(req) {
    if (
      DEV_MODE &&
      req.method === "POST" &&
      new URL(req.url).pathname === "/__dev"
    ) {
      const module: any = {};
      new Function("module", await req.text())(module);
      serverBuild = module.exports;
      console.log(`Dev server updated: ${new Date()}`);
      return new Response(null, { status: 202 });
    }
    let res = await staticHandler(req);
    if (!res) res = await requestHandler(req);
    return res;
  },
});

const { ip } = Switch.networkInfo();
const url = `http://${ip}:${port}`;
console.log(`HTTP server listening at: ${url}`);

if (DEV_MODE) {
  console.log()
  console.log('\x1B[1m\x1B[33mDEVELOPMENT MODE\x1B[39m\x1B[22m');
  console.log(`\x1B[33mRun the following command on your local machine:\x1B[39m`);
  console.log()
  console.log(`\x1B[36m  npm run dev ${url}\x1B[39m`)
  console.log()
}
