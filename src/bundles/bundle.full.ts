// core
import { h, render, hydrate, removeAllChildNodes, renderComponent, tick } from '../core'
import { hydrateLazy } from '../lazy'
import { nodeToString } from '../helpers'

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
//@ts-ignore
import htm from '../htm'
const jsx = htm.bind(h)

export default {
  h,
  render,
  hydrate,
  removeAllChildNodes,
  renderComponent,
  tick,
  nodeToString,
  createContext,
  Component,
  Fragment,
  Store,
  Helmet,
  Link,
  Img,
  Visible,
  jsx,
  hydrateLazy,
}
