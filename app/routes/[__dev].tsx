import { ActionFunctionArgs } from "@remix-run/server-runtime";

/**
 * This is a special route for dev mode. The body of the POST
 * request should contain the esbuild output of the Remix
 * server bundle. It is then evaluated to replace the in-memory
 * server bundle for future HTTP requests to use.
 */
export async function action({ request }: ActionFunctionArgs) {
  const module: any = {};
  new Function("module", await request.text())(module);
  (globalThis as any).__devServerBuild = module.exports;
  console.log(`Dev server updated: ${new Date()}`);
  return new Response(null, { status: 202 });
}
