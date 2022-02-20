// core
import { h, hydrate, removeAllChildNodes, render, tick } from '../core.js'
import { hydrateLazy } from '../lazy.js'
import { nodeToString, task } from '../helpers.js'

// useful tools
import { Component } from '../component.js'
import { Fragment } from '../fragment.js'
import { Store } from '../store.js'
import { createContext } from '../context.js'
import { withStyles } from '../withStyles.js'

// built-in components
import { Helmet } from '../components/helmet.js'
import { Link } from '../components/link.js'
import { Img } from '../components/img.js'
import { Visible } from '../components/visible.js'
import * as Router from '../components/router.js'

// tagged templates
import { jsx } from '../jsx.js'

// ui
import * as UI from '../ui/index.js'

export default {
  Component,
  Fragment,
  Helmet,
  Img,
  Link,
  Router,
  Store,
  UI,
  Visible,
  createContext,
  h,
  hydrate,
  hydrateLazy,
  jsx,
  nodeToString,
  removeAllChildNodes,
  render,
  task,
  tick,
  withStyles
}

// version
export { printVersion } from '../helpers.js'
export { VERSION } from '../version.js'
