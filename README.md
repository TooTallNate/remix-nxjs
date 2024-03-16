# Welcome to nx.js + Remix!

This [Remix template](https://remix.run/) is configured to output a Nintendo Switch homebrew application which serves the Remix application, using [nx.js](https://nxjs.n8.io/). You can use nx.js APIs in your `loader()`/`action()` functions in your Remix routes.

## Getting Started

Run the following command to copy this template:

```sh
npx create-remix@latest --template TooTallNate/remix-nxjs
```

## Development

Run the Vite dev server:

```sh
npm run dev
```

> [!IMPORTANT]
> In development, the `nx.js` APIs are not present, so you should create mock data / function calls. You can check `typeof Switch === 'undefined'` to detect when running in dev mode.

## Generate a `.nro`

First, run the `build` script to build your Remix app and place the client-side assets into the "romfs" directory:

```sh
npm run build
```

Then run the `nro` script to generate the final `.nro` file.

```sh
npm run nro
```

Place the `.nro` file onto your Switch's SD card inside the "switch" directory, and launch the app through the Homebrew Launcher (album menu). While the app is running, you can access your Remix application from a web browser using the IP address and port shown on the Switch screen.

### `.nro` Metadata

* Add a square `icon.jpg` file in the root of the project to customize the icon of the NRO file
* The following `package.json` values are shown on the Homebrew Launcher:
  * `name`
  * `version`
  * `author`
* Set the `titleId` property in `package.json` to a random 16 digit hex string (example: `012a792e7a730000`)
  * This allows your app to access Save Data via `localStorage` in `loader()`/`action()` functions
