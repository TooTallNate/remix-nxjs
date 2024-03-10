import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/server-runtime";

export async function loader(args: LoaderFunctionArgs) {
  return { version: Switch.version.nxjs };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix on nx.js v{data.version}</h1>
      <ul>
        <li>
          <a target="_blank" href="https://nxjs.n8.io" rel="noreferrer">
            nx.js Docs
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
