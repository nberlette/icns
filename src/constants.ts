/**
 * Environment Variables and Constants
 */
export const API_BASE_URL = "https://api.iconify.design";
export const BASE_URL = "https://icns.ml";
export const ALT_BASE_URL = "https://icns.deno.dev";

/**
 * List of icon slugs to display as examples on the homepage.
 */
export const exampleIconSlugs: string[] = [
  "indianred/bmw",
  "dynamic/deno",
  "ph:cloud-fill:lightblue",
  "tabler:brand-github",
  "0cf/twitter",
];

/**
 * Default icon color to apply for fills and strokes.
 * @default `inherit`
 * @note Providing any value for the color parameter will override this.
 */
export const defaultIconColor = "inherit";

/**
 * The default icon color to apply for dark mode when the color param is `dynamic`.
 * @default `#ffffff`
 */
export const defaultIconColorDark = "#ffffff";

/**
 * Default attributes (or props) to use when rendering icons. Stringified into SVG.
 * @example `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">`
 */
export const defaultIconProps: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": "true",
  role: "img",
};

/**
 * Default response headers to send when rendering icons.
 * @note `cache-control` will be overridden if necessary.
 */
export const defaultIconHeaders: HeadersInit = {
  "Content-Type": "image/svg+xml;charset=utf-8",
  "Access-Control-Allow-Origin": "*",
};

/**
 * Whitelist of patterns to determine which attributes the user can override via `URLSearchParams`.
 * Supports string literals and RegExp patterns (to match several related attributes with less code).
 * @example `/^fill(?:-(.+))?$/ig` - allows `fill`, `fill-rule`, `fill-opacity`, etc.
 * @example `'fill'` - only allows `fill`.
 */
export const allowedIconProps: (string | RegExp)[] = [
  "role",
  "title",
  "viewBox",
  /^aria-(.+)$/i,
  /^fill(?:-(.+))?$/i,
  /^stroke(?:-(.+))?$/i,
  /^(id|class|style|color|transform(?:-origin)?)$/i,
];

/**
 * Options passed to the colorHash() constructor when generating color based on a hashed string.
 * @note this feature requires the param named `hash` be provided in order to activate.
 */
export const colorHashOptions = {};
