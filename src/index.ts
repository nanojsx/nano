import './types'

import { createElement, render, removeAllChildNodes } from './core'
import { Fragment, createContext, nodeToString } from './helpers'
import { Component } from './component'
import { Link } from './components/link'

export default { createContext, createElement, render, removeAllChildNodes, nodeToString }
export { Fragment, Component, Link }
