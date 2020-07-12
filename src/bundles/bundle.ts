import { h, render, removeAllChildNodes } from '../core'
import { nodeToString } from '../helpers'
import { renderSSR } from '../ssr'

import { Component } from '../component'
import { Fragment } from '../fragment'
import { createContext } from '../context'

import { Helmet } from '../components/helmet'
import { Link } from '../components/link'
import { Img } from '../components/img'
import { Visible } from '../components/visible'

// @ts-ignore
import htm from 'htm/dist/htm.js'
const jsx = htm.bind(h)

export default {
  Nano: { createContext, h, render, renderSSR, removeAllChildNodes, nodeToString },
  Fragment,
  Component,
  Helmet,
  Link,
  Img,
  Visible,
  jsx,
  h,
}
