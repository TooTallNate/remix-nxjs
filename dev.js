import { networkInterfaces } from "os";
import { spawnSync } from "child_process";
import { build } from "esbuild";
import chokidar from "chokidar";
import express from "express";
import serveStatic from "serve-static";
import cors from "cors";

const baseUrl = process.argv[2];
if (!baseUrl) {
    console.log('Error! You must specify the URL of the Switch application!');
    process.exit(2);
}
console.log(`Switch URL: ${baseUrl}`);

const url = new URL("/__dev", baseUrl);

const host = Object.values(networkInterfaces())
  .flatMap((i) => i)
  .find((i) => !i.internal && i.family === "IPv4");
if (!host) {
  throw new Error("Could not determine host IP address");
}

const app = express();
app.use(cors());
app.use(serveStatic("build/client"));
app.listen(8080);

chokidar
  .watch("app", { ignoreInitial: true })
  .on("all", async (event, path) => {
    console.log("Rebuilding");
    console.time("Rebuilding");
    spawnSync("remix", ["vite:build"], {
      //stdio: 'inherit',
      env: {
        ...process.env,
        DEV_HOST: `http://${host.address}:8080/`,
      },
    });
    console.timeEnd("Rebuilding");

    const bundle = await build({
      entryPoints: ["build/server/index.js"],
      bundle: true,
      write: false,
      format: "cjs",
    });
    const output = bundle.outputFiles[0];
    console.log("Updating dev server");
    console.time(`Dev server ready`);
    await fetch(url, {
      method: "POST",
      body: output.contents,
    });
    console.timeEnd(`Dev server ready`);
  });
