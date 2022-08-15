import {
  $kv,
  colorHash,
  Fragment,
  h,
  html,
  jsx,
  parseAndFormatHex,
  serve,
} from "~/deps.ts";
import { App } from "~/src/components.tsx";
import {
  allowedIconProps,
  ALT_BASE_URL,
  API_BASE_URL,
  BASE_URL,
  colorHashOptions,
  defaultIconColor,
  defaultIconColorDark,
  defaultIconHeaders,
  defaultIconProps,
  exampleIconSlugs,
} from "~/src/constants.ts";

/**
 * URL Request Parameters for serving up hot icons.
 */
export declare interface IconParams {
  color?: string;
  fill?: string;
  colorhash?: string;
  collection?: string;
  slug: string;
}

/**
 * Some common SVG attributes we can expect to encounter.
 */
export declare type IconAttributes = {
  xmlns: string & "http://www.w3.org/2000/svg";
  viewBox: string & `${number} ${number} ${number} ${number}`;
  width: string | number;
  height: string | number;
  fill: string;
  stroke: string;
  [prop: string]: unknown;
};

export declare type IconProps = Partial<IconAttributes>;

/**
 * Response handler functions depending on request.
 */
const handle = {
  /**
   * Where all the magic happens: the primary icon handler.
   */
  async icon(
    req: Request,
    connInfo: ConnInfo,
    params: IconParams,
    extraProps: IconProps = {},
  ): Promise<Response> {
    const url = new URL(req.url);

    // determine color
    let color: string = defaultIconColor;

    if (url.searchParams.has("hash")) {
      color = parseAndFormatHex(
        new colorHash(colorHashOptions).hex(
          url.searchParams.get("hash") || params.slug,
        ),
      );
    } else if (params.color === "random") {
      color = parseAndFormatHex(
        new colorHash(colorHashOptions).hex(`${Math.random()}`),
      );
    } else {
      color = params.color ?? params.fill
        ? params.color === "dynamic"
          ? "inherit"
          : (parseAndFormatHex(params.color) || defaultIconColor)
        : defaultIconColor;
    }

    // default icon collection is simple-icons
    const { collection = "simple-icons", slug = "svg" } = params as IconParams;

    // construct a filename
    const filename = `${collection.toLowerCase()}:${slug.toLowerCase()}.svg`;

    // merge props from defaults, path-based params, and query-based params
    const props: IconProps = Object.assign(
      {},
      defaultIconProps,
      { color, ...extraProps },
      Object.fromEntries( // only allow query params that match the whitelist
        [...url.searchParams.entries()].filter(([k, v]) =>
          allowedIconProps.some((
            pattern: RegExp | string,
          ) => (pattern instanceof RegExp
            ? pattern.test(k)
            : `${pattern}` === `${k}`)
          )
        ),
      ),
    );

    // using 'dynamic' for the color will add a media query to support dark mode ;)
    let style = "";
    if (params.color === "dynamic") {
      style = `<defs><style>@media(prefers-color-scheme:dark){svg,svg>*{color:${
        defaultIconColorDark ?? "#ffffff"
      } !important}}</style></defs>`;
    }

    // fetch the icon from the iconify cdn origin server
    try {
      const body = await fetch(`${API_BASE_URL}/${filename}`)
        .then(async (res) => res.ok && await res.text())
        .then((svg: string) =>
          (style +
            svg.trim().replace(
              /^[\s\n]*<svg([^>]+)>|<\/svg>[\n\s]*$/ig,
              (attrs) => {
                try {
                  if (attrs) {
                    const [, viewBox = defaultIconProps.viewBox] = (
                      /viewBox=['"]([^'"]+)['"]/i.exec(attrs) ?? []
                    );
                    Object.assign(props, { viewBox });
                  }
                } catch {
                  return "";
                }
                return "";
              },
            )).trim()
        );
      return await handle.svg(body, props);
    } catch {
      return await handle.error(req);
    }
  },

  /**
   * Helper function to stringify our SVG's
   */
  svg(
    body: string,
    props: IconProps = defaultIconProps,
    headers: HeadersInit = {},
  ): any {
    headers = Object.assign(
      {},
      defaultIconHeaders,
      headers as Record<string, string>,
    );
    props = {
      ...defaultIconProps,
      ...props,
      dangerouslySetInnerHTML: { __html: body },
    };
    return jsx(<svg {...props} /> as any, {
      headers,
    });
  },

  /**
   * The homepage (or root).
   */
  root(req: Request, connInfo?: ConnInfo): Promise<any> {
    return html({
      title: "icns.ml",
      body: <App />,
      links: [
        { href: "/favicon.svg", type: "image/svg+xml", rel: "icon" },
        {
          href: "/favicon.svg",
          type: "image/svg+xml",
          rel: "prefetch",
          as: "image",
        },
      ],
      scripts: [
        `var $=document.querySelector.bind(document);var $$=document.querySelectorAll.bind(document);var hashchange=(e)=>{location.hash.endsWith('.svg')&&($('#icon-preview').src='/'+location.hash.replace(/(^[#\/]|\\.svg$)/ig, '')+'.svg')};window.addEventListener('hashchange', hashchange);if(!!location.hash){setTimeout(hashchange,100)}`,
      ],
      styles: [
        `@keyframes straighten-up{from{transform:rotateX(-1deg) rotateZ(2deg) scale3d(var(--un-scale-x,1.5),var(--un-scale-y,1.5),var(--un-scale-z,1.5));transition:.333s transform 6s ease-in;} to{transform:rotateX(0deg) rotateZ(0deg) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z)) !important;}} @keyframes desharpen{from{backdrop-filter:blur(2px)}to{backdrop-filter:blur(0)}} .straighten-up{animation:500ms straighten-up linear var(--straighten-up-delay,4500ms) 1 both, 1000ms fade-in linear 500ms 1 both, 500ms desharpen 4500ms 1 both;} pre,code,kbd{font-family:'IBM Plex Mono','Dank Mono','Operator Mono SSm','Operator Mono','Fira Code','Fira Mono',monospace !important}`,
      ],
    });
  },

  /**
   * Choose a favicon! (and how to display it!)
   */
  favicon(req: Request, connInfo?: ConnInfo) {
    return handle.icon(req, connInfo, {
      collection: "ic",
      slug: "baseline-gradient",
      color: "dynamic",
    }, { stroke: "black", "stroke-width": "0.5", viewBox: "-0.5 -0.5 25 25" });
  },

  /**
   * In case we encounter a typo or otherwise missing icon, this will render a placeholder to prevent broken images.
   */
  error(req: Request, connInfo?: ConnInfo) {
    return handle.icon(req, connInfo, {
      collection: "heroicons-outline",
      slug: "exclamation",
      color: "#bb0000",
    });
  },
};

/**
 * Routing table
 */
serve({
  "/": handle.root,
  "/favicon.:ext(.+)": handle.favicon,
  "/:color/:collection/:slug(.+).svg": handle.icon,
  "/:color/:collection([^:]+)(:):slug(.+).svg": handle.icon,
  "/:color/:slug(.+).svg": handle.icon,
  "/:collection([^:]+)(:):slug(.+)(:):color(.+).svg": handle.icon,
  "/:collection([^:]+)(:):slug(.+).svg": handle.icon,
  "/:slug(.+).svg": handle.icon,
  "/(.*).svg": handle.error,
  "/*": handle.root,
  404: handle.error,
} as Routes);
