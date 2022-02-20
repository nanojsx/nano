// core
import { h, render, tick } from '../core.js'
import { task } from '../helpers.js'

// useful tools
import { Component } from '../component.js'
import { Fragment } from '../fragment.js'
import { Store } from '../store.js'
import { createContext } from '../context.js'
import { withStyles } from '../withStyles.js'
import * as Router from '../components/router.js'

// tagged templates
import { jsx } from '../jsx.js'

export default {
  Component,
  Fragment,
  Router,
  Store,
  createContext,
  h,
  jsx,
  render,
  task,
  tick,
  withStyles
}

// version
export { printVersion } from '../helpers.js'
export { VERSION } from '../version.js'
