<p align="center">
  <a href="https://nanojsx.github.io/">
    <img src="readme/nano-jsx-logo.svg" alt="Nano JSX Logo" width="350"/>
  </a>
</p>

<p align="center">Lightweight <b>1kB</b> JSX library.</p>

</div>

<h3 align="center">Designed to build ultra fast Multi-Page Apps (MPAs), using isomorphic JavaScript. Written in TypeScript. Perfect for your next PWA.</h3>

<p align="center">  
  <a href="https://www.npmjs.com/package/nano-jsx"><img src="https://img.shields.io/npm/v/nano-jsx?style=flat-square" alt="NPM version"></a>
  <img src="https://badgen.net/badgesize/gzip/nanojsx/nano/master/bundles/nano.core.min.js?style=flat-square" alt="gzip size">
  <a href="https://github.com/nanojsx/nano/actions?query=workflow%3ACI"><img src="https://img.shields.io/github/workflow/status/nanojsx/nano/CI/master?label=github%20build&logo=github&style=flat-square"></a>
  <a href="https://github.com/nanojsx/nano/commits/master"><img src="https://img.shields.io/github/last-commit/nanojsx/nano.svg?style=flat-square" alt="GitHub last commit"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/built%20with-TypeScript-blue?style=flat-square"></a>
  <a href="https://codecov.io/gh/nanojsx/nano"><img src="https://img.shields.io/codecov/c/github/nanojsx/nano?logo=codecov&style=flat-square" alt="Codecov"/></a>
  <img src="https://img.shields.io/node/v/nano-jsx.svg?style=flat-square" alt="Node version"/>
</p>

<hr>

## Website

Checkout the [website](https://nanojsx.github.io/) to find out more!

## Demo App

Take a look at the [demo app](https://nano-jsx-demo.herokuapp.com/).  
_It's hosted on a free heroku dyno, so it might take a while to spin up the server and load the app_

## Features

The best about nano-jsx is the **small bundle size**. It builds, although is sound crazy, a even smaller bundle size than Svelte!

### More Features

- **SSR**  
  Out of the box, very simple to use

- **Pre-Rendering**  
  Renders your app to static html if you want.  
  (This is possible, but requires some knowledge.  
  I plan to make a tutorial soon.)

- **Hydration**  
  Render your app on the server and hydrate it on the client

- **Partial Hydration**  
  Hydrate and only the parts you need

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

## Why

In the past, I did a lot of websites using Isomorphic React (Pre-Rendering on the Server and Hydrating it on the client). Once the website did load all scripts, the website was very fast (not so much on mobile though). But the script where always _way_ too big.

Nowadays, I prefer to pre-render the JSX on the server and only hydrate the parts that are needed. The client now only gets few kilobytes and uses much less CPU.

Of course with this new approach, the client does not have a router and must thus fetch each new site on navigating to it. But, this is not really a problem since the static html is usually very small and we can easily prefetch pages using `<link rel="prefetch" href="index.html" as="document">` on page load or on hovering over a link.

## Documentation

Checkout the [website](https://nanojsx.github.io/) to find out more!
