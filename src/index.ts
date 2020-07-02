import './types'

import { h, render, removeAllChildNodes } from './core'
import { Fragment, createContext, nodeToString } from './helpers'
import { Component } from './component'
import { renderSSR } from './ssr'

import { Helmet } from './components/helmet'
import { Img } from './components/img'
import { Link } from './components/link'
import { Visible } from './components/visible'

// @ts-ignore
import htm from 'htm/dist/htm.js'
const jsx = htm.bind(h)

export default { createContext, h, render, renderSSR, removeAllChildNodes, nodeToString }
export { Fragment, Component, jsx, h }
export { Helmet, Img, Link, Visible }
