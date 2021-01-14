// core
import { h, render, hydrate, removeAllChildNodes, tick } from '../core'
import { hydrateLazy } from '../lazy'
import { nodeToString, task } from '../helpers'

// useful tools
import { Component } from '../component'
import { Fragment } from '../fragment'
import { Store } from '../store'
import { createContext } from '../context'

// built-in components
import { Helmet } from '../components/helmet'
import { Link } from '../components/link'
import { Img } from '../components/img'
import { Visible } from '../components/visible'

// tagged templates
import { jsx } from '../jsx'

// ui
import * as UI from '../ui/index'

export default {
  createContext,
  h,
  hydrate,
  hydrateLazy,
  jsx,
  nodeToString,
  removeAllChildNodes,
  render,
  tick,
  task,
  Component,
  Fragment,
  Helmet,
  Img,
  Link,
  Store,
  Visible,
  UI,
}

// version
export { printVersion } from '../helpers'
export { VERSION } from '../version'
