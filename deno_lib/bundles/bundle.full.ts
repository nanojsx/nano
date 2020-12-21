// core
import { h, render, hydrate, removeAllChildNodes, renderComponent, tick, task } from '../core.ts'
import { hydrateLazy } from '../lazy.ts'
import { nodeToString } from '../helpers.ts'

// useful tools
import { Component } from '../component.ts'
import { Fragment } from '../fragment.ts'
import { Store } from '../store.ts'
import { createContext } from '../context.ts'

// built-in components
import { Helmet } from '../components/helmet.ts'
import { Link } from '../components/link.ts'
import { Img } from '../components/img.ts'
import { Visible } from '../components/visible.ts'

// tagged templates
import { jsx } from '../jsx.ts'

// ui
import * as UI from '../ui/index.ts'

export default {
  createContext,
  h,
  hydrate,
  hydrateLazy,
  jsx,
  nodeToString,
  removeAllChildNodes,
  render,
  renderComponent,
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
