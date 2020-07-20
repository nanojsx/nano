import './types'

import { h, render, removeAllChildNodes } from './core'
import { nodeToString } from './helpers'
import { renderSSR } from './ssr'
import { Component } from './component'
import { Fragment } from './fragment'
import { Store } from './store'
import { createContext } from './context'

import { Helmet } from './components/helmet'
import { Img } from './components/img'
import { Link } from './components/link'
import { Visible } from './components/visible'

// @ts-ignore
import htm from 'htm/dist/htm.js'
const jsx = htm.bind(h)

export default { createContext, h, render, renderSSR, removeAllChildNodes, nodeToString }
export { Component, Fragment, Store, jsx, h }
export { Helmet, Img, Link, Visible }
