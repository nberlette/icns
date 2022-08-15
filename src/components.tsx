import { type ComponentProps, Fragment, h, parseAndFormatHex } from "~/deps.ts";

import { BASE_URL, exampleIconSlugs } from "~/src/constants.ts";

const Wrapper = ({ children, ...props }: ComponentProps<"div">) => (
  <div class="overflow-hidden w-screen h-screen relative">{children}</div>
);
export const App = ({ ...props }) => (
  <Wrapper>
    <div
      class="fixed inset w-screen h-screen straighten-up !scale-150 -z-1 [-webkit-mask-image:radial-gradient(50%_50%_at_50%_50%,#ffff,#fff0_80%)] [mask-image:radial-gradient(50%_50%_at_50%_50%,#ffff,#fff0_80%)]"
      style={`background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2359657c' opacity='0.5' fill-opacity='0.3'%3E%3Cpath opacity='0.45' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
    >
    </div>
    <button
      class="fixed z-100 top-10 right-10 btn-icon cursor-pointer dark:!text-white no-underline font-semibold text-sm inline-block overflow-hidden bg-transparent border-none"
      // @ts-ignore runs in the client as `window.setColorScheme`
      onclick="setColorScheme((localStorage.getItem('color-scheme')==='dark'?'light':'dark'))"
    >
      <span class="bg-blue-200 dark:!bg-yellow-200 dark:mix-blend-exclusion inline-block w-8 h-8 [-webkit-mask-image:url(./heroicons-outline:moon.svg)] [mask-image:url(./heroicons-outline:moon.svg)] dark:![-webkit-mask-image:url(./heroicons-outline:sun.svg)] dark:![mask-image:url(./heroicons-outline:sun.svg)]">
        &nbsp;
      </span>
    </button>
    <div
      style="--straighten-up-delay:5000ms;"
      class="straighten-up overflow-y-scroll flex flex-col items-center justify-center w-full h-screen !scale-100 peer text-gray-900 dark:!text-white"
    >
      <h1 class="cursor-default select-none text-6xl sm:text-8xl font-extrabold tracking-tighter text-shadow peer animate animate-back-in-left animate-count-1 animate-duration-500 animate-both">
        {(new URL(BASE_URL).hostname).split(".").slice(0, 1)}
        <span class="font-extralight tracking-tight text-4xl sm:text-6xl">
          .{(new URL(BASE_URL).hostname).split(".").slice(1).join(".")}
        </span>
      </h1>
      <div class="mt-2 mb-6 text-center text-gray-600 font-light lowercase gap-y-1 flex flex-col select-none">
        <strong class="animate-fade-in-down animate-count-1 animate-duration-300 animate-delay-1000 animate-both text-base">
          dynamic edge-rendered icons
        </strong>
        <span class="animate-fade-in-down animate-count-1 animate-duration-300 animate-delay-1300 animate-both text-sm">
          sub-millisecond response time
        </span>
      </div>
      <a
        href="/"
        title={new URL(BASE_URL).hostname}
        class="inline-block mt-6 w-20 h-20 select-none text-gray-600 hover:text-gray-900 transition-colors ease-in duration-300 animate animate-fade-in-up animate-count-1 animate-delay-2000 animate-ease-in animate-both"
      >
        <img
          id="icon-preview"
          src="/favicon.svg"
          alt={new URL(BASE_URL).hostname}
          width="80"
          class="animate animate-tada animate-count-1 animate-delay-4000 animate-both"
        />
      </a>
      <p class="mt-2 mb-4 flex flex-col flex-wrap gap-x-2 gap-y-4">
        <h2
          class="text-2xl font-bold mb-2 lowercase sr-only"
          aria-hidden="true"
        >
          Examples
        </h2>
        {exampleIconSlugs // sort icons by length
          .sort((a, b) => (+a.length - +b.length))
          .map((icon, i) => (
            <div>
              <a
                href={`#${icon}.svg`}
                key={i + icon}
                class={`flex flex-row place-items-center gap-2 my-2 animate animate-back-in-right animate-ease-out animate-both animate-count-1 animate-delay-${
                  500 + (i * 125)
                }`}
              >
                <button class="select-none drag-none text-gray-900 border border-solid border-b-2 shadow-sm hover:shadow-md !transition-all !duration-300 !ease-in bg-gradient-to-t active:!bg-gradient-to-b to-blue-gray-50 from-blue-gray-200 border-blue-gray-200 border-b-blue-gray-300 hover:border-blue-gray-300 focus:border-blue-gray-300 ring-1 ring-transparent focus:ring-blue-200 hover:focus:!ring-violet-200 !rounded-full !px-5 !py-1.5 leading-8 inline-flex place-items-center flex-row flex-nowrap !gap-x-3">
                  <code class="text-sm sm:text-base underline underline-1 underline-dotted underline-gray-400 underline-offset-1">
                    ./{icon}.svg
                  </code>
                  <img
                    src={`/${icon}.svg`}
                    alt=""
                    class="w-5 h-5 text-inherit inline-block no-sr"
                  />
                </button>
              </a>
            </div>
          ))}
      </p>
      <footer class="sticky -z-1 bottom-16 w-full max-w-[70vw] mx-auto mt-12 h-12 flex flex-row place-items-center justify-evenly gap-10 group">
        <a
          href="https://berlette.com"
          class="select-none no-underline inline-block"
          title="Nicholas Berlette Stands With Ukraine"
        >
          <span class="opacity-70 group-hover:!opacity-100 transition-opacity duration-300 ease-in ![background:linear-gradient(#044bbb_50%,#fcc500_50.1%)] [-webkit-mask-image:url(./mdi:alpha-n-circle-outline.svg)] [mask-image:url(./mdi:alpha-n-circle-outline.svg)] inline-block w-12 h-12">
          </span>
        </a>
      </footer>
    </div>
  </Wrapper>
);
