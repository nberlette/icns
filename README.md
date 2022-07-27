# [`icns`](https://icns.ml)

### Dynamic Icons + Deno Deploy

---  

## Features

- [x] Rendered just-in-time on the Edge, deployed globally in seconds.
- [x] Supports [**the _complete_ Iconify collection**](https://github.com/iconify): 100,000+ icons in 100+ collections!
- [x] Parses colors with [**culori**](https://deno.land/x/culori) as opposed to [**tinycolor2**](https://github.com/bgrins/TinyColor)
- [x] Experimental support for [**colorhash**](https://deno.land/x/colorhash) (deterministic colors from strings)
- [x] Frontend powered by [**preact**](https://preactjs.org) and [**unocss**](https://uno.antfu.me)
- [x] Supports a `dynamic` color option to support dark mode. (adds a small CSS media query to the SVG)
- [x] Supports a `random` color option to render icons in a randomly generated hue (cache-buster!)
- [x] Preview icons on the homepage using slugs URL fragments: [`https://icns.ml/#ph:alien-duotone:red.svg`](https://icns.ml/#ph:alien-duotone:red.svg)
- [x] Extremely portable (and therefore very easy to deploy to your own instance)

---

## License

MIT © [Nicholas Berlette](https://github.com/nberlette)
