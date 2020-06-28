import './types'

import { createElement, render, removeAllChildNodes } from './core'
import { Fragment, createContext, nodeToString } from './helpers'
import { Component } from './component'
import { Img } from './components/img'
import { Link } from './components/link'
import { Visible } from './components/visible'

// @ts-ignore
import htm from 'htm/dist/htm.js'
const jsx = htm.bind(createElement)

export default { createContext, createElement, render, removeAllChildNodes, nodeToString }
export { Fragment, Component, Img, Link, Visible, jsx }
