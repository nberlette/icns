import { html } from "https://deno.land/x/htm@0.0.10/mod.tsx";

import { UnoCSS } from "https://deno.land/x/htm@0.0.10/plugins.ts";

import GOKV from "https://deno.land/x/gokv@0.0.12/mod.ts";

export { default as _ } from "https://deno.land/x/911@0.0.5/mod.ts";

export { json } from "https://deno.land/x/911@0.0.5/src/json.ts";

import log from "https://deno.land/x/911@0.0.5/src/log.ts";

import {
  formatHex,
  parse,
} from "https://deno.land/x/culori@v2.1.0-alpha.1/index.js";

export * from "https://deno.land/x/culori@v2.1.0-alpha.1/index.js";

export {
  jsx,
  serve,
  serveStatic,
  Status,
  STATUS_TEXT,
} from "https://deno.land/x/sift@0.5.0/mod.ts";

export type {
  ComponentProps,
  Context,
} from "https://deno.land/x/sift@0.5.0/mod.ts";

export { default as colorHash } from "https://deno.land/x/color_hash@v2.0.1/mod.ts";

export * from "https://esm.sh/preact@10.10.1";
export { render as renderSSR } from "https://esm.sh/preact-render-to-string@5.2.1";

// Importing the parts of NanoJSX which we are using in the application.
// export { Helmet } from "https://deno.land/x/nano_jsx@v0.0.33/components/helmet.ts";
// export { h } from "https://deno.land/x/nano_jsx@v0.0.33/core.ts";
// export { Fragment } from "https://deno.land/x/nano_jsx@v0.0.33/fragment.ts";
// export { renderSSR } from "https://deno.land/x/nano_jsx@v0.0.33/ssr.ts";
// export { Store } from "https://deno.land/x/nano_jsx@v0.0.33/store.ts";
// export {
//   getState,
//   setState,
// } from "https://deno.land/x/nano_jsx@v0.0.33/hooks/useState.ts";

// resvg WASM bindings that allow conversion of an SVG to a PNG. Open graph and
// twitter do not support SVGs for card images.
export { render as renderSVG } from "https://deno.land/x/resvg_wasm@0.1.0/mod.ts";

html.use(UnoCSS());

export { html, log };

const token = Deno.env.get("GOKV_TOKEN") || null;
const namespace = Deno.env.get("GOKV_NAMESPACE") || "icns.ml";
try {
  GOKV.config({ token });
} catch (err) {
  log.error("Unable to configure GOKV", err.toString());
}

export const $kv = GOKV.KV({ namespace });
export const $dkv = GOKV.DurableKV({ namespace });

export const parseAndFormatHex = (c: string) => formatHex(parse(c));
