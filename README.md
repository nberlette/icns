# [`icns`](https://icns.ml)

### Dynamic Icons + Deno Deploy

---

## Features

- [x] Rendered just-in-time on the Edge, deployed globally in seconds.
- [x] Supports
      [**the _complete_ Iconify collection**](https://github.com/iconify):
      **100,000+ icons in 100+ collections!**
  - The default collection is `simple-icons`, meaning `./bmw.svg` is really
    `/simple-icons:bmw.svg`
- [x] Parses colors with [**culori**](https://deno.land/x/culori) as opposed to
      [tinycolor2](https://github.com/bgrins/TinyColor)
  - Accepts most CSS colors, either as a pathname:
    [`https://icns.ml/indianred/tabler:brand-github.svg`](https://icns.ml/indianred/tabler:brand-github.svg)
  - Or as an additional parameter in the filename:
    [`https://icns.ml/tabler:brand-github:indianred.svg`](https://icns.ml/tabler:brand-github:indianred.svg)
- [x] Experimental support for [**colorhash**](https://deno.land/x/colorhash)
      (deterministic colors from strings)
  - Add a query parameter `?hash=foobar` and `foobar` will determine your icon
    color
- [x] Supports a `dynamic` color option to support dark mode. (adds a small CSS
      media query to the SVG)
  - Set the color to `dynamic` to enable:
    [`https://icns.ml/dynamic/deno.svg`](https://icns.ml/dynamic/deno.svg)
- [x] Supports a `random` color option to render icons in a randomly generated
      hue.
  - Simply set the color name to `random` (see above) and roll the dice!
- [x] Preview icons on the homepage using slug URL fragments:
      [`https://icns.ml/#ph:alien-duotone:red.svg`](https://icns.ml/#ph:alien-duotone:red.svg)
- [x] Totally useless frontend, powered by [**preact**](https://preactjs.org)
      and [**unocss**](https://uno.antfu.me)
- [x] Extremely portable and easy to deploy to your own instance

---

## License

MIT © [Nicholas Berlette](https://github.com/nberlette)
