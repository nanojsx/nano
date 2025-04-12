<p align="center">
  <a href="http://nanojsx.io/">
  <!-- https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to -->
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nanojsx/nano/master/readme/nano-jsx-logo-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/nanojsx/nano/master/readme/nano-jsx-logo.svg">
    <img alt="Nano JSX Logo" src="https://raw.githubusercontent.com/nanojsx/nano/master/readme/nano-jsx-logo.svg">
  </picture>
  </a>
</p>

<p align="center">
  SSR first, lightweight <b>1kB</b> JSX library.
</p>

</div>

<h3 align="center">
  Written in TypeScript.<br />
  Works on Node and Deno.<br />
  Designed to build ultra fast MPAs and SPAs.
</h3>

<br/>

<p align="center">  
  <a href="https://www.npmjs.com/package/nano-jsx"><img src="https://img.shields.io/badge/available%20on-npmjs.com-lightgrey.svg?logo=node.js&logoColor=339933&labelColor=white&style=flat-square"></a>
  <a href="https://deno.land/x/nano_jsx"><img src="https://img.shields.io/badge/available%20on-deno.land/x-lightgrey.svg?logo=deno&labelColor=black&style=flat-square"></a>
  <br/><br/>
  <img src="https://img.badgesize.io/nanojsx/nano/master/bundles/nano.core.min.js?compression=gzip&style=flat-square" alt="gzip size">
  <a href="https://github.com/nanojsx/nano/actions?query=workflow%3ANodeJS"><img src="https://img.shields.io/github/actions/workflow/status/nanojsx/nano/nodejs.yml?branch=master&label=NodeJS&logo=github&style=flat-square"></a>
  <a href="https://github.com/nanojsx/nano/actions?query=workflow%3ADeno"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/nanojsx/nano/deno.yml?branch=master&label=Deno&logo=github&style=flat-square"></a>
  <a href="https://github.com/nanojsx/nano/commits/master"><img src="https://img.shields.io/github/last-commit/nanojsx/nano.svg?style=flat-square" alt="GitHub last commit"></a>
  <a href="https://github.com/sponsors/yandeu"><img src="https://img.shields.io/github/sponsors/yandeu?style=flat-square" alt="Sponsors"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/built%20with-TypeScript-blue?style=flat-square"></a>
  <a href="https://codecov.io/gh/nanojsx/nano"><img src="https://img.shields.io/codecov/c/github/nanojsx/nano?logo=codecov&style=flat-square" alt="Codecov"/></a>
  <img src="https://img.shields.io/node/v/nano-jsx.svg?style=flat-square" alt="Node version"/>
  <a href="https://discord.gg/96PGJeB8xf"> <img src="https://img.shields.io/discord/912874504877912075?color=%237289da&label=discord&logo=discord" alt="Join our discord server!"></a>
</p>

<hr>

## News

nano-jsx is now at v0.1.x 🎉  
This means, no breaking changes till v0.2.x  
[Tweet about it!](http://twitter.com/share?text=nano-jsx%20has%20reached%20v0.1!&url=https://nanojsx.io/)

## Getting Started

- Visit the [website](http://nanojsx.io/)
- Download the [template](https://github.com/nanojsx/template)
- Check out the [sandbox](https://codepen.io/yandeu/pen/MWKMmbq)
- Try the [deno example](https://github.com/nanojsx/nano-jsx-deno-example)

## Video Tutorial

<a href="https://www.youtube.com/playlist?list=PLC2Z8IWl1XDJI4Ah7ABolQ79AugF_eH1g"><img width="300" src="https://raw.githubusercontent.com/nanojsx/nano/master/readme/thumbnail.png" /></a>

## Features

The best about Nano JSX is the **small bundle size**. It builds, although is sound crazy, bundles as small as svelte!

### More Features

- **SSR**  
  Out of the box, very simple to use

- **Pre-Rendering**  
  Renders your app to static html if you want.  
  (This is possible, but requires some knowledge.  
  I plan to make a tutorial soon.)

- **Partial Hydration**  
  Hydrate and only the parts you really need

- **Isomorphic Router**  
  Works on Client- and Server-Side

- **CSS in JS**  
  Use JavaScript objects for styling

- **No JSX build tools required**  
  Uses Tagged Templates instead of JSX if you prefer

- **Props, Ref, Context and Events**  
  Use Props, Ref, Context API and Events as you are used to in react

- **Inline SVG**  
  No problem

- **Prefetch**  
  Use the built-in Link Component

- **1KB (gzip)**  
  All of this in only ~1KB  
  _(Well, the core module is only about ~1KB)_

- **CustomElements mode**  
  You can define your component written with Nano JSX as web-components with `defineAsCustomElements`. This enables you to develop very light web components. (thanks @Shinyaigeek)

## Documentation

Checkout the [website](http://nanojsx.io/) to find out more!

---

## Development Section

### Run browser tests (visually)

```bash
# install dependencies
npm install

# build
npm run build

# bundle
npm run bundle

# create instrumented bundle
npx webpack -c webpack/webpack.bundle.instrumented.js

# transpile browserTest library
npx tsc -p scripts/browserTest/tsconfig.json

# open browser to run the tests
npx five-server . --open=test/browser
```
