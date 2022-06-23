/** @jsx h */
import { serve, jsx } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { formatHex, parse } from "https://esm.sh/culori?dts";
import { h, html } from "https://deno.land/x/htm@0.0.7/mod.tsx";
import { $fetch } from "https://esm.sh/ohmyfetch?dts";
import colorHash from "https://deno.land/x/color_hash@v2.0.1/mod.ts";
import { DurableKV } from "https://deno.land/x/gokv@0.0.12/mod.ts"

/**
 * Environment Variables and Constants
 */
const API_BASE_URL = Deno.env.get('API_BASE_URL') || 'https://api.iconify.design';
const BASE_URL = Deno.env.get('BASE_URL') || 'https://icns.ml';
const GOKV_TOKEN = Deno.env.get('GOKV_TOKEN') || null;
const GOKV_NAMESPACE = Deno.env.get('GOKV_NAMESPACE') || 'icns.ml';

/**
 * Default attributes (or props) to use when rendering icons. Stringified into SVG.
 * @example `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img">`
 */
const defaultIconProps: IconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': 'true',
  role: 'img',
}

/**
 * Default icon color to apply for fills and strokes. 
 * @note Providing any value for the color parameter will override this.
 */
const defaultIconColor = '#000000';

/**
 * Default response headers to send when rendering icons.
 * @note `cache-control` will be overridden if necessary.
 */
const defaultIconHeaders: HeadersInit = {
  'Content-Type': 'image/svg+xml;charset=utf-8',
  'Access-Control-Allow-Origin': '*',
}

/**
 * Whitelist of SVG attribute names the user is allowed to override via the URL's query string.
 * @example `./deno.svg?stroke-width=0.5&id=deno&class=blue`
 */
const allowedAttributes: (keyof IconProps)[] = ['viewBox', 'fill', 'stroke', 'stroke-width', 'color', 'id', 'class', 'style', 'transform'];

/**
 * List of icon slugs to display as examples on the homepage.
 */
const exampleIconSlugs: string[] = [
  'simple-icons:bmw:indianred',
  'deno',
  'c00/carbon:bat',
  'rgba(0,160,240,.8)/ph:cloud-fill',
  'tabler:brand-github',
  '0cf/twitter'
];

/**
 * URL Request Parameters for serving up hot icons.
 */
interface IconParams {
  color?: string;
  colorhash?: string;
  collection?: string;
  slug: string;
}

/**
 * Some common SVG attributes we can expect to encounter.
 */
interface IconAttributes {
  xmlns: string;
  viewBox: `${number} ${number} ${number} ${number}`;
  width: string | number;
  height: string | number;
  fill: string;
  role: string;
  stroke: string;
  [prop: string]: string | number | boolean;
}
type IconProps = Partial<IconAttributes>;

/**
 * Options passed to the colorHash() constructor when generating color based on a hashed string.
 * @note this feature requires the param named `hash` be provided in order to activate.
 */
const colorHashOptions = {};

/**
 * Response handler functions depending on request.
 */
const handle = {
  /**
   * Where all the magic happens: the primary icon handler.
   */
  async icon(req: Request, _connInfo: any, params: IconParams, extraProps: IconProps = {}) {
    const url = new URL(req.url)

    // determine color
    let color: string = defaultIconColor;

    if (url.searchParams.has('hash')) {
      color = formatHex(parse(new colorHash(colorHashOptions).hex(url.searchParams.get('hash') || params.slug)))
    }
    else if (params.color === 'random') {
      color = formatHex(parse(new colorHash(colorHashOptions).hex(Math.random())))
    }
    else {
      color = !!params.color
        ? params.color === 'dynamic'
          ? 'inherit'
          : (formatHex(parse(params.color)) || defaultIconColor)
        : defaultIconColor;
    }

    const {
      // default icon collection
      collection = 'simple-icons',
      // default icon slug
      slug = 'svg'
    } = params as IconParams;

    // construct a filename 
    const filename = `${collection.toLowerCase()}:${slug.toLowerCase()}.svg`

    // merge props from defaults, path-based params, and query-based params
    const props: IconProps = Object.assign(
      Object.create(null),
      defaultIconProps,
      { color },
      Object.fromEntries(Array.from(url.searchParams.entries()).filter(([k, v]) => allowedAttributes.includes(k))),
      extraProps,
    );

    // using 'dynamic' for the color will add a media query to support dark mode ;)
    let style: string = '';
    if (params.color === 'dynamic')
      style = `<style>@media(prefers-color-scheme:dark){svg{color:#ffffff !important}}</style>`;

    try {
      const body: string = await $fetch(`${API_BASE_URL}/${filename}`, {
        parseResponse(svg: string) {
          return (style + svg.trim().replace(/(^[\s\n]*<svg([^>]+)>|<\/svg>[\n\s]*$)/ig, (attrs) => {
            try {
              if (attrs) {
                const matches = /viewBox=['"]([^'"]+)['"]/i.exec(attrs)
                if (matches && matches[1])
                  Object.assign(props, { viewBox: matches[1] })
              }
            } catch { }
            return ''
          })).trim()
        }
      })

      return await handle.svg(body, { ...props, ...(extraProps || {}) })
    } catch {
      return await handle['404'](req)
    }
  },

  /**
   * Helper function to stringify our SVG's
   */
  svg(body: string, props: IconProps = defaultIconProps, headers: HeadersInit = {}) {
    return jsx(<svg {...(props || {})} dangerouslySetInnerHTML={{ __html: body }} />, {
      headers: Object.assign(Object.create(null), defaultIconHeaders, headers),
    })
  },

  /**
   * The homepage (or root).
   */
  async root(req: Request) {
    return html({
      title: "icns.ml",
      body: (
        <div class="overflow-hidden w-screen h-screen relative">
          <div
            class="fixed inset w-screen h-screen straighten-up !scale-150 -z-1 [-webkit-mask-image:radial-gradient(50%_50%_at_50%_50%,#ffff,#fff0_80%)]"
            style={`background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2359657c' opacity='0.5' fill-opacity='0.3'%3E%3Cpath opacity='0.45' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
          ></div>
          <button
            class="fixed z-100 top-10 right-10 btn-icon cursor-pointer dark:!text-white no-underline font-semibold text-sm inline-block overflow-hidden bg-transparent border-none"
            onclick="setColorScheme((localStorage.getItem('color-scheme') === 'dark' ? 'light' : 'dark'))"
          >
            <span class="bg-blue-200 dark:!bg-yellow-200 dark:mix-blend-exclusion inline-block w-8 h-8 [-webkit-mask-image:url(./heroicons-outline:moon.svg)] [mask-image:url(./heroicons-outline:moon.svg)] dark:![-webkit-mask-image:url(./heroicons-outline:sun.svg)] dark:![mask-image:url(./heroicons-outline:sun.svg)]">&nbsp;</span>
          </button>
          <div
            style="--straighten-up-delay:6500ms;"
            class="straighten-up overflow-y-scroll flex flex-col items-center justify-center w-full h-screen !scale-100 peer text-gray-900 dark:!text-white"
          >
            <h1 class="cursor-default select-none text-6xl sm:text-8xl font-extrabold tracking-tighter text-shadow peer animate animate-back-in-left animate-count-1 animate-duration-700 animate-both">{(new URL(BASE_URL).hostname).split('.').slice(0, 1)}<span class="font-extralight tracking-tight text-4xl sm:text-6xl">.{(new URL(BASE_URL).hostname).split('.').slice(1).join('.')}</span></h1>
            <div class="mt-2 mb-6 text-center text-gray-600 font-light lowercase gap-y-1 flex flex-col">
              <strong class="animate-fade-in-down animate-count-1 animate-duration-500 animate-delay-1500 animate-both text-base">dynamic edge-rendered icons</strong>
              <span class="animate-fade-in-down animate-count-1 animate-duration-500 animate-delay-2500 animate-both text-sm">sub-millisecond response time</span>
            </div>
            <a href="/" title={(new URL(BASE_URL).hostname)} class="inline-block mt-6 w-20 h-20 text-gray-600 hover:text-gray-900 transition-colors ease-in duration-300 animate animate-fade-in-up animate-count-1 animate-delay-2500 animate-both">
              <img id="icon-preview" src="/favicon.svg" alt={(new URL(BASE_URL).hostname)} width="80" class="animate animate-tada animate-count-1 animate-delay-8000 animate-both animate-duration-600" />
            </a>
            <p class="mt-2 mb-4 flex flex-col flex-wrap gap-x-2 gap-y-4">
              <h2 class="text-2xl font-bold mb-2 lowercase sr-only" aria-hidden="true">Schema Examples</h2>
              {exampleIconSlugs // sort icons by length
                .sort((a, b) => (+a.length - +b.length))
                .map((icon, i) =>
                (<div>
                  <a
                    href={`#${icon}`}
                    key={i + icon}
                    class={`flex flex-row place-items-center gap-2 my-2 animate animate-back-in-right animate-ease-out animate-both animate-count-1 animate-delay-${1700 + (i * 200)}`}
                  >
                    <button class="text-gray-900 border border-solid border-b-2 shadow-sm hover:shadow !transition-all !duration-300 !ease-in bg-gradient-to-t active:!bg-gradient-to-b to-blue-gray-50 from-blue-gray-200 border-blue-gray-200 border-b-blue-gray-300 hover:border-blue-gray-300 focus:border-blue-gray-300 ring-1 ring-transparent focus:ring-blue-200 hover:focus:!ring-violet-200 !rounded-full !pl-5 !pr-1 py-1.5 leading-8 inline-flex place-items-center flex-row flex-nowrap !gap-x-3"><code class="text-sm sm:text-base underline underline-1 underline-dotted underline-gray-400 underline-offset-1">./{icon}.svg</code><img src={`/${icon}.svg`} alt="" class="w-5 h-5 mr-4 text-inherit inline-block" /></button>
                  </a>
                </div>)
                )}
            </p>
            <footer class="fixed bottom-16 w-full h-10 flex items-center justify-center gap-10 text-gray-800 dark:!text-gray-50">
              <a
                class="text-sm no-underline text-black"
                href="https://github.com/nberlette/icns"
                title="View Source on GitHub"
              >
                <span class="bg-black dark:!bg-white [-webkit-mask-image:url(./tabler:brand-github.svg)] [mask-image:url(./tabler:brand-github.svg)] inline-block w-8 h-8"></span>
              </a>
              <a
                href="https://berlette.com"
                class="inline-block"
                title="Made with ❤️ by Nicholas Berlette"
              >
                <span class="bg-black dark:!bg-white [-webkit-mask-image:url(./mdi:alpha-n-circle-outline.svg)] [mask-image:url(./mdi:alpha-n-circle-outline.svg)] inline-block w-8 h-8"></span>
              </a>
            </footer>
          </div>
        </div>
      ),
      links: [
        { href: '/favicon.svg', type: 'image/svg+xml', rel: 'icon' },
        { href: '/favicon.svg', type: 'image/svg+xml', rel: 'prefetch', as: 'image' },
      ],
      scripts: [
        `var $=document.querySelector.bind(document);var $$=document.querySelectorAll.bind(document);var hashchange=(e)=>{$('#icon-preview').src='/'+location.hash.replace(/(^[#]|\\.svg$)/ig, '')+'.svg'};window.addEventListener('hashchange', hashchange);if(!!window.location.hash){hashchange()}`,
      ],
      styles: [
        `@keyframes straighten-up{from{transform:rotateX(-1deg) rotateZ(2deg) scale3d(var(--un-scale-x,1.5),var(--un-scale-y,1.5),var(--un-scale-z,1.5));transition:.333s transform 6s ease-in;} to{transform:rotateX(0deg) rotateZ(0deg) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z)) !important;}} @keyframes desharpen{from{backdrop-filter:blur(0)}to{backdrop-filter:blur(2px)}} .straighten-up{animation:500ms straighten-up linear var(--straighten-up-delay,6000ms) 1 both, 1000ms fade-in linear 200ms 1 both, 1000ms desharpen 6000ms 1 both;}`,
        `pre,code,kbd{font-family:'IBM Plex Mono','Dank Mono','Operator Mono SSm','Operator Mono','Fira Code','Fira Mono',monospace !important}`,
      ],
    })
  },

  /**
   * Choose a favicon! (and how to display it!)
   */
  favicon(req: Request) {
    return handle.icon(req, null, { collection: 'ic', slug: 'baseline-gradient', color: 'dynamic' }, { stroke: 'black', 'stroke-width': '0.5', viewBox: '-0.5 -0.5 25 25' })
  },

  /**
   * In case we encounter a typo or otherwise missing icon, this will render a placeholder to prevent broken images.
   */
  404: (req: Request) => handle.icon(req, null, { collection: 'heroicons-outline', slug: 'exclamation', color: '#bb0000' })
}

/**
 * Routing table
 */
serve({
  "/":
    handle.root,
  "/favicon.:ext(.+)":
    handle.favicon,
  "/:color/:collection([^:]+)(:):slug(.+).svg":
    handle.icon,
  "/:color/:slug(.+).svg":
    handle.icon,
  "/:collection([^:]+)(:):slug([^:]+)(:):color(.+).svg":
    handle.icon,
  "/:collection([^:]+)(:):slug(.+).svg":
    handle.icon,
  "/:slug(.+).svg":
    handle.icon,
  "/(.*).svg":
    handle['404'],
  "/*":
    handle.root,
  404:
    handle['404']
});    