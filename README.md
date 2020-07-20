<div align="center">

<img src="readme/nano-jsx-logo.png" alt="Nano JSX Logo" width="230"/>

</div>

<h4 align="center">
Written in TypeScript, super Lightweight, simply Awesome!</h4>

<h3 align="center">Designed to build blazing fast Multi-Page Apps (MPAs). Using isomorphic JavaScript. Perfect for your next PWA.</h3>

<p align="center">  
  <a href="https://www.npmjs.com/package/nano-jsx"><img src="https://img.shields.io/npm/v/nano-jsx?style=flat-square" alt="NPM version"></a>
  <img src="https://badgen.net/badgesize/gzip/yandeu/nano-jsx/master/bundles/nano.core.min.js?style=flat-square" alt="gzip size">
  <a href="https://github.com/yandeu/nano-jsx/actions?query=workflow%3ACI"><img src="https://img.shields.io/github/workflow/status/yandeu/nano-jsx/CI/master?label=github%20build&logo=github&style=flat-square"></a>
  <a href="https://github.com/yandeu/nano-jsx/commits/master"><img src="https://img.shields.io/github/last-commit/yandeu/nano-jsx.svg?style=flat-square" alt="GitHub last commit"></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="code style: prettier"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/built%20with-TypeScript-blue?style=flat-square"></a>
  <a href="https://codecov.io/gh/yandeu/nano-jsx"><img src="https://img.shields.io/codecov/c/github/yandeu/nano-jsx?logo=codecov&style=flat-square" alt="Codecov"/></a>
  <img src="https://img.shields.io/node/v/nano-jsx.svg?style=flat-square" alt="Node version"/>
</p>

<hr>

## Demo App

Take a look at the [demo app](https://nano-jsx-demo.herokuapp.com/).  
_It's hosted on a free heroku dyno, so it might take a while to spin up the server and load the app_

## Roadmap

At this time, nano-jsx is highly in development. In the near future, I will make a github organization, nice website, a template repository, video tutorials and some example repositories. This project has really become awesome and once finished, I will certainly ues it for many of my future projects. Remember, the whole goal of nano-jsx, is to make your website/app as fast as possible, by only shipping what the client really needs.

## Features

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
  _(Well, the core module is only about ~1KB,_  
  _together with all the cool features it's ~3KB)_

## Why

Well, in the past, I did a lot of websites using Isomorphic React (Pre-Rendering on the Server and Hydrating it on the client). Once the website did load all scripts, the website was very fast (not so much on mobile though). But the script where always _way_ too big.

Nowadays, I prefer to pre-render the JSX on the server and only hydrate the parts that are needed. The client now only gets few kilobytes and uses much less CPU.

Of course with this new approach, the client does not have a router and must thus fetch each new site on navigating to it. But, this is not really a problem since the static html is usually very small and we can easily prefetch pages using `<link rel="prefetch" href="index.html" as="document">` on page load or on hovering over a link.

## How

npm

```bash
# install nano-jsx
npm i nano-jsx
```

```tsx
// import nano-jsx
import Nano, { Component, Link, more... } from 'nano-jsx'

// create your components
const App = (props) => <h1>Hello from {props.name}!</h1>

// render the app to the root element
Nano.render(<App name="Nano" />, document.getElementById('root'))
```

bundle

```html
<!-- Nano JSX -->
<script src="https://unpkg.com/nano-jsx/bundles/nano.min.js"></script>

<!-- Use (with build tools (Babel/TypeScript))-->
<script>
  const { Nano, Component, Link, more... } = nano

  const App = (props) => <h1>Hello from {props.name}!</h1>

  Nano.render(<App name="Nano" />, document.getElementById('root'))
</script>

<!-- Use (without build tools (purse JavaScript))-->
<script>
  const { Nano, Component, Link, jsx } = nano

  const App = (props) => jsx`<h1>Hello from ${props.name}!</h1>`

  Nano.render(jsx`<${App} name="Nano" />`, document.getElementById('root'))
</script>
```

## Documentation

### Props

You can simply pass props to children as you are used to in other JSX libraries.

### Lifecycle

If you extend from `Component` you will have `willMount()`, `render()` and `didMount()`.

If you use SSR, you should only manipulate the DOM inside `didMount()`, since `didMount()` will not get executed on the server-side.

### Update/Re-render Component

Nano-JSX does _never_ update the component automatically. You have to call `update()`. On every component you call `update()`, the root element needs to be a DOM element.

Also, there is no `this.state`, you can simply use any name you want ("data" in the example below).

```tsx
import Nano, { Component } from 'nano-jsx'

class Names extends Component {
  data: any

  async didMount() {
    const res = (await fetchMock('/api/names')) as any

    if (res) {
      this.data = res.data
      this.update()
    }
  }

  render() {
    if (this.data) {
      return (
        <ul>
          {this.data.map((d: any) => {
            return <li>{d.name}</li>
          })}
        </ul>
      )
    } else {
      return <div>...loading</div>
    }
  }
}
```

### Context API

```tsx
import Nano from 'nano-jsx'

const MyContext = Nano.createContext('suzanne')

const Child = () => {
  return (
    <MyContext.Consumer>
      {(value: any) => {
        return <p>{value}</p>
      }}
    </MyContext.Consumer>
  )
}

const Parent = (props: any) => {
  return (
    <MyContext.Provider value={props.name}>
      <Child />
    </MyContext.Provider>
  )
}

Nano.render(<Parent name="john" />, document.getElementById('root'))
```

### Fragment

```tsx
import Nano, { Fragment } from 'nano-jsx'

const List = () => (
  <Fragment>
    <p>first</p>
    <p>second</p>
    <p>third</p>
  </Fragment>
)
```

### Store

Use an external store, to store your application's state.

```tsx
// import Nano, Component and Store
import Nano, { Component, Store } from '../index'

// initialize the store with a default value
const myStore = new Store({ name: 'Hulk' })

// set a new state
myStore.state = { name: 'Thor' }

class Hero extends Component {
  // use the store in your component
  store = myStore.use()

  didMount() {
    // subscribe to store changes
    this.store.subscribe((newState: any, prevState: any) => {
      // check if you need to update your component or not
      if (newState.name !== prevState.name) this.update()
    })
  }

  didUnmount() {
    // cancel the store subscription
    this.store.cancel()
  }

  render() {
    // display the name property of your store's state
    return <p>Name: {this.store.state.name}</p>
  }
}

class App extends Component {
  // use the store in your component
  store = myStore.use()

  didMount() {
    setTimeout(() => {
      // set a new state after 2 seconds
      this.store.setState({ name: 'Iron Man' })
    }, 2000)
  }

  render() {
    return <Hero />
  }
}

Nano.render(<App />, document.getElementById('root'))
```

### SSR (with the built-in Helmet component)

```tsx
// server.tsx
import Nano, { Img, Helmet } from 'nano-jsx'

const App = () => {
  return (
    <div>
      <Helmet>
        <title>Nano JSX Helmet SSR</title>
        <meta name="description" content="Nano-JSX application" />
      </Helmet>

      <Helmet footer>
        <script src="/this/belongs/to/the/footer.js"></script>
      </Helmet>

      <Img width="280" height="160" src="some-url" placeholder="placeholder-url" />
    </div>
  )
}

const app = Nano.renderSSR(<App />)
const { body, head, footer } = Helmet.SSR(app)

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join('\n')}
  </head>
  <body>
    ${body}
    ${footer.join('\n')}
  </body>
</html>
`

// now send the html to the client
```

## Built-in Components

### \<Link />

Nano JSX provides a fancy **link component** for prefetching pages.

```tsx
// prefetch the link on page load
<Link prefetch href="https://geckosio.github.io/">
  Link to geckos.io
</Link>

// prefetch the link if user hovers over it
<Link prefetch="hover" href="https://geckosio.github.io/">
  Link to geckos.io
</Link>

// prefetch the link if it is visible
<Link prefetch="visible" href="https://geckosio.github.io/">
  Link to geckos.io
</Link>

// back will use window.history.back(), if last page matches href
// (this will navigate faster by serving the last page from the browser caches)
<Link back href="https://geckosio.github.io/">
  Link to geckos.io
</Link>

// wait for 150ms before navigating
// (useful if, for example, you want to fadeOut the content before navigating)
// (together with "prefetch", your MPA will just look like a SPA ❤️)
<Link delay="150" href="https://geckosio.github.io/">
  Link to geckos.io
</Link>
```

### \<Visible />

This children of Visible will only be rendered and added to the dom, if they are visible. This is useful, for example, for a comment section. The root elements of Visible needs to be DOM elements.  
(Does not work to lazy load images)

```tsx
// some lazy rendered section
<div id="lazy-section">
  <Visible>
    <p>Will be rendered once in the visible area.</p>
    <script>
      console.log('visible!')
    </script>
  </Visible>
</div>

// the comments section
<div id="comment-section">
  <Visible>
    <div id="comments">
      <Comments />
    </div>
  </Visible>
</div>
```

### \<Img />

Lazy Loading Images. You should add a height and width if possible.

```tsx
// lazy load an image
<Img src="imageURL" />

// do not lazy load an image
<Img src="imageURL" lazy={false} />

// lazy load an image, displays a blue box while loading
<div style={{width:'100px', height:'100px', backgroundColor: 'blue'}}>
  <Img height="100" src="imageURL" />
</div>

// lazy load an image with a placeholder image
<Img src="imageURL" placeholder="placeholderURL" />

// lazy load an image with a placeholder component
<Img src="imageURL" placeholder={Placeholder} />
```

### \<Helmet />

Works just like react-helmet. Works client-side and SSR.

```tsx
<Helmet>
  {/* html attributes */}
  <html lang="en" amp />

  {/* body attributes */}
  <body class="root" />

  {/* title element */}
  <title>My Plain Title or {dynamic} title</title>

  {/* meta elements */}
  <meta name="description" content="Nano-JSX application" />

  {/* link elements */}
  <link rel="canonical" href="http://mysite.com/example" />

  {/* inline style elements */}
  <style type="text/css">{`
    body {
      background-color: blue;
    }
  `}</style>

  {/* inline script elements */}
  <script>console.log("Hello");</script>

  {/* noscript elements */}
  <noscript>{`
    <link rel="stylesheet" type="text/css" href="foo.css" />
  `}</noscript>

  {/* JSON-LD */}
  <script type="application/ld+json">{`
    {
      "@context": "https://schema.org/",
      "@type": "Recipe",
      "name": "Party Coffee Cake",
      "author": {
        "@type": "Person",
        "name": "Mary Stone"
      },
      "datePublished": "2018-03-10",
      "description": "This coffee cake is awesome and perfect for parties.",
      "prepTime": "PT20M"
    }
  `}</script>
</Helmet>
```

## Tagged Template Literals

You can use jsx without any build tools, if you want.

The example below will render:

```console
List of names
  • joe
  • suzanne
  Link
```

```js
<script>
  const { Nano, Link, jsx } = nano

  const names = ['joe', 'suzanne']

  const Names = (props) => {
    return jsx`
      <ul>
        ${names.map((name) => {
          return jsx`<li>${name}</li>`
        })}
      </ul>`
  }

  const App = () => {
    return jsx`
    <div>

      <!-- Listen for the click event -->
      <h2 onClick="${() => console.log('click')}">List of names</h2>

      <!-- Render the Names component -->
      <${Names} />

      <!-- Use the built-in Link component -->
      <${Link} prefetch="hover" href="https://geckosio.github.io/">
        Link
      </${Link}>

    </div>`
  }

  Nano.render(App, document.getElementById('root'))
</script>
```
