# <img src="https://icns.ml/dynamic/deno.svg" alt="icns.ml" height="40" align="left"> [`icns.deno.dev`](https://icns.ml)

This is a [**Deno implementation**](https://icns.deno.dev) of the [icns project](https://github.com/nberlette/icns), with some notable new features. I suppose a more accurate description might be a **Deno *re-imagination***, since it was completely rewritten from the ground up.

## Feature Comparison

The previous iteration's shortcomings are very apparent when it's standing next to the new one:

#### New

1. Supports [**the _complete_ Iconify collection**](https://github.com/iconify): 100,000+ icons in 100+ collections!
2. Completely contained in a single [`mod.tsx`](./mod.tsx) file. (it was written in the Deno Playground 😜)
3. Parses colors with [**culori**](https://deno.land/x/culori) as opposed to [tinycolor2](https://github.com/bgrins/TinyColor)
4. Introduces support for [**ColorHash**](https://deno.land/x/colorhash) (deterministic colors from strings)
5. Frontend powered by [**Preact**](https://preactjs.org) and [**unocss**](https://uno.antfu.me)
6. Supports a `dynamic` color option to support dark mode. (adds a small CSS media query to the SVG) 
7. Supports a `random` color option to render icons in a randomly generated hue (cache-buster!)
8. Preview icons on the homepage with a new URL hash format: [`https://icns.ml/#ph:alien-duotone.svg`](https://icns.ml/#ph:alien-duotone.svg)
9. Extremely portable and simple to deploy a self-hosted version (there's only one file!)

#### Old

1. **Only** supported [**SimpleIcons**](https://github.com/simple-icons/simple-icons) (and had a _**huge**_ bundle size from that dependency)
2. Was written entirely in a hurried, last-minute environment, as evidenced by the terrible code
3. Suffered from many incomplete or entirely nonfunctional features
4. Rendered company logos in their appropriate colors by default, thanks to SimpleIcons (the old version's only upshot)
5. Was deployed with [**Vercel**](https://vercel.com) as opposed to [**Deno Deploy**](https://dash.deno.com/new)  

> **Note**: I feel that I should make a note here that Vercel is **great**. Unfortunately, I experienced
> difficulties with their page routing API from day one on this particular project.  

---  

## License

MIT © [Nicholas Berlette](https://github.com/nberlette)  
