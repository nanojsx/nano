import { h, render, removeAllChildNodes } from '../core'
import { nodeToString } from '../helpers'
import { renderSSR } from '../ssr'

import { Component } from '../component'
import { Fragment } from '../fragment'
import { Store } from '../store'
import { createContext } from '../context'
import { withStyles } from '../withStyles'

import { Helmet } from '../components/helmet'
import { Link } from '../components/link'
import { Img } from '../components/img'
import { Visible } from '../components/visible'

// @ts-ignore
import htm from 'htm/dist/htm.js'
const jsx = htm.bind(h)

export default {
  Nano: { h, render, renderSSR, removeAllChildNodes, nodeToString, createContext },
  Component,
  Fragment,
  Store,
  Helmet,
  Link,
  Img,
  Visible,
  jsx,
  h,
  withStyles,
}
